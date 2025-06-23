import type { RegistryError } from '@polkadot/types/types';
import { BN, hexToU8a } from '@polkadot/util';
import { ApiPromise } from '@polkadot/api';

import { Asset, BigNumber, ZERO, bnum } from '@galacticcouncil/sdk';

import { Account, ChainCursor } from 'db';
import { convertToHex } from 'utils/account';

import {
  buildReceivedAmountQuery,
  queryPlanned,
  queryScheduled,
  queryStatus,
  queryTrades,
} from './query';
import { Order, OrderStatus, OrderTransaction } from './types';

export class OrdersApi {
  private _api: ApiPromise;
  private _indexerUrl: string;
  private _grafanaUrl: string;
  private _grafanaDsn: number;

  public constructor(
    api: ApiPromise,
    indexerUrl: string,
    grafanaUrl: string,
    grafanaDsn: number,
  ) {
    this._api = api;
    this._indexerUrl = indexerUrl;
    this._grafanaUrl = grafanaUrl;
    this._grafanaDsn = grafanaDsn;
  }

  async getScheduled(
    account: Account,
    assets: Map<string, Asset>,
  ): Promise<Order[]> {
    const who = convertToHex(account.address);
    const scheduled = await queryScheduled(this._indexerUrl, who);
    const scheduledStatus = await this.getStatus(account);

    const orders = scheduled.events.map(async (event) => {
      const id = event.args.id;

      let order: any;
      let period: number;
      let totalAmount: string;
      if (event.call && event.call.args.schedule) {
        const schedule = event.call.args.schedule;
        order = schedule.order;
        period = schedule.period;
        totalAmount = schedule.totalAmount;
      } else {
        //console.log("using fallback to load DCA schedule", id);
        const apiAt = await this._api.at(event.block.hash);
        const scheduleOpt = await apiAt.query.dca.schedules(id);
        const schedule = scheduleOpt.unwrap();
        const scheduleOrder = schedule.order.isSell
          ? schedule.order.asSell
          : schedule.order.asBuy;
        order = scheduleOrder;
        period = schedule.period.toNumber();
        totalAmount = schedule.totalAmount.toString();
      }

      const amount = order.amountIn ?? order.maxAmountIn;
      const assetInId = order.assetIn.toString();
      const assetOutId = order.assetOut.toString();
      return {
        id: id,
        assetIn: assets.get(assetInId),
        assetOut: assets.get(assetOutId),
        interval: period,
        amount: bnum(amount),
        total: bnum(totalAmount),
        status: scheduledStatus.get(id),
        transactions: [],
      } as Order;
    });
    return await Promise.all(orders);
  }

  async getTrades(scheduleId: number): Promise<OrderTransaction[]> {
    const trades = await queryTrades(this._indexerUrl, scheduleId);

    return trades.events.map((event) => {
      const { amountIn, amountOut, error } = event.args;
      const { height, timestamp } = event.block;

      const type = event.name.replace('DCA.', '');
      let err: string;
      let desc: string;
      if (error) {
        try {
          const decoded: RegistryError = this.decodeError(error);
          err = decoded.method;
          desc = decoded.docs.join(' ');
        } catch {}
      }

      return {
        date: timestamp,
        block: height,
        amountIn: error ? ZERO : bnum(amountIn),
        amountOut: error ? ZERO : bnum(amountOut),
        status: { type, err, desc } as OrderStatus,
      } as OrderTransaction;
    });
  }

  async getReceived(scheduleId: number): Promise<BigNumber> {
    const data = await fetch(this._grafanaUrl, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify({
        queries: [
          {
            refId: 'events',
            rawSql: buildReceivedAmountQuery(scheduleId),
            format: 'table',
            datasourceId: Number(this._grafanaDsn),
          },
        ],
      }),
    });
    const dataJson = await data.json();
    try {
      const received = dataJson.results.events?.frames[0].data.values[0][0];
      return received ? new BigNumber(received) : ZERO;
    } catch {
      return ZERO;
    }
  }

  async getPlanned(scheduleId: number): Promise<number> {
    const planned = await queryPlanned(this._indexerUrl, scheduleId);
    return planned.events[0].args.block;
  }

  async getStatus(account: Account): Promise<Map<number, OrderStatus>> {
    const who = convertToHex(account.address);
    const status = await queryStatus(this._indexerUrl, who);

    const statuses: Map<number, OrderStatus> = new Map([]);
    status.events.map((event) => {
      const type = event.name.replace('DCA.', '');
      let err: string;
      let desc: string;
      const { error, id } = event.args;
      if (error) {
        try {
          const decoded: RegistryError = this.decodeError(error);
          err = decoded.method;
          desc = decoded.docs.join(' ');
        } catch {}
      }
      statuses.set(id, { type, err, desc } as OrderStatus);
    });
    return statuses;
  }

  private decodeError(error: any): RegistryError {
    const { api } = ChainCursor.deref();
    const errorU8a = hexToU8a(error.value.error);
    const indexBN = new BN(error.value.index);
    return api.registry.findMetaError({ error: errorU8a, index: indexBN });
  }
}
