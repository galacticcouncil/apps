import type { RegistryError } from '@polkadot/types/types';
import { BN, hexToU8a } from '@polkadot/util';
import { ZERO, bnum } from '@galacticcouncil/sdk';

import { queryPlanned, queryScheduled, queryStatus, queryTrades } from './query';
import { Account, chainCursor } from '../../../db';
import { convertToHex } from '../../../utils/account';

import { DcaPosition, DcaStatus, DcaTransaction } from './types';

export class DcaOrdersApi {
  private _indexerUrl: string;

  public constructor(indexerUrl: string) {
    this._indexerUrl = indexerUrl;
  }

  async getScheduled(account: Account): Promise<DcaPosition[]> {
    const who = convertToHex(account.address);
    const scheduled = await queryScheduled(this._indexerUrl, who);
    const scheduledStatus = await this.getStatus(account);

    return scheduled.events.map((event) => {
      const id = event.args.id;
      const start = event.call.args.startExecutionBlock;
      const { order, period, totalAmount } = event.call.args.schedule;

      return {
        id: id,
        assetIn: order.assetIn.toString(),
        assetOut: order.assetOut.toString(),
        start: start,
        interval: period,
        amount: bnum(order.amountIn),
        total: bnum(totalAmount),
        status: scheduledStatus.get(id),
        transactions: [],
      } as DcaPosition;
    });
  }

  async getTrades(scheduleId: number): Promise<DcaTransaction[]> {
    const trades = await queryTrades(this._indexerUrl, scheduleId);

    return trades.events.map((event) => {
      const { amountIn, amountOut, error } = event.args;
      const { height, timestamp } = event.block;

      const type = event.name.replace('DCA.', '');
      let err: string;
      let desc: string;
      if (error) {
        const decoded: RegistryError = this.decodeError(error);
        err = decoded.method;
        desc = decoded.docs.join(' ');
      }

      return {
        date: timestamp,
        block: height,
        amountIn: error ? ZERO : bnum(amountIn),
        amountOut: error ? ZERO : bnum(amountOut),
        status: { type, err, desc } as DcaStatus,
      } as DcaTransaction;
    });
  }

  async getPlanned(scheduleId: number): Promise<number> {
    const planned = await queryPlanned(this._indexerUrl, scheduleId);
    return planned.events[0].args.block;
  }

  async getStatus(account: Account): Promise<Map<number, DcaStatus>> {
    const who = convertToHex(account.address);
    const status = await queryStatus(this._indexerUrl, who);

    const statuses: Map<number, DcaStatus> = new Map([]);
    status.events.map((event) => {
      const type = event.name.replace('DCA.', '');
      let err: string;
      let desc: string;
      const { error, id } = event.args;
      if (error) {
        const decoded: RegistryError = this.decodeError(error);
        err = decoded.method;
        desc = decoded.docs.join(' ');
      }
      statuses.set(id, { type, err, desc } as DcaStatus);
    });
    return statuses;
  }

  private decodeError(error: any): RegistryError {
    const api = chainCursor.deref().api;
    const errorU8a = hexToU8a(error.value.error);
    const indexBN = new BN(error.value.index);
    return api.registry.findMetaError({ error: errorU8a, index: indexBN });
  }
}
