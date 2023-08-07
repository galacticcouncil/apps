import { html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';

import { BaseApp } from '../../base/BaseApp';

import { AssetApi } from '../../../api/asset';
import { TimeApi } from '../../../api/time';
import { Account, Chain, chainCursor } from '../../../db';
import { DatabaseController } from '../../../db.ctrl';

import '@galacticcouncil/ui';
import { AssetMetadata, BigNumber, bnum } from '@galacticcouncil/sdk';

import './grid';
import './list';

import { DcaOrder, DcaTransaction } from './types';
import { DcaOrdersApi } from './api';

@customElement('gc-dca-orders')
export class DcaOrders extends BaseApp {
  private chain = new DatabaseController<Chain>(this, chainCursor);
  private disconnectSubscribeNewHeads: () => void = null;

  private assetApi: AssetApi = null;
  private ordersApi: DcaOrdersApi = null;
  private timeApi: TimeApi = null;

  private blockNumber: number = null;
  private blockTime: number = null;

  @state() orders = {
    list: [] as DcaOrder[],
    open: new Set<number>([]),
  };

  @state() width: number = window.innerWidth;
  @state() meta: Map<string, AssetMetadata> = new Map([]);

  static styles = [
    css`
      .orders {
        background: var(--uigc-app-background-color);
        overflow: hidden;
      }

      @media (min-width: 480px) {
        .orders {
          border-radius: var(--uigc-app-border-radius);
        }
      }
    `,
  ];

  private async getNextExecutionBlock(scheduleId: number): Promise<number> {
    return await this.ordersApi.getPlanned(scheduleId);
  }

  private async getTransactions(scheduleId: number): Promise<DcaTransaction[]> {
    const trades = await this.ordersApi.getTrades(scheduleId);
    return trades ?? [];
  }

  private async getRemaining(scheduleId: number): Promise<BigNumber> {
    const { api } = this.chain.state;
    const remainingAmount = await api.query.dca.remainingAmounts(scheduleId);
    return bnum(remainingAmount.unwrapOr(0).toString());
  }

  private async syncSummary(scheduleId: number) {
    const dcaOrdersUpdated = this.orders.list.map(async (order) => {
      if (order.id == scheduleId) {
        const transactions = await this.getTransactions(order.id);
        const remaining = await this.getRemaining(order.id);
        const received = await this.ordersApi.getReceived(order.id);
        const nextExecutionBlock = await this.getNextExecutionBlock(order.id);
        const nextExecution = await this.timeApi.toTimestamp(this.blockTime, nextExecutionBlock);
        const orderStatus = order.status;
        const hasPendingTx = (): boolean => {
          return nextExecutionBlock <= this.blockNumber && !orderStatus;
        };

        return { ...order, remaining, received, transactions, nextExecutionBlock, nextExecution, hasPendingTx };
      }
      return order;
    });
    this.orders = {
      ...this.orders,
      list: await Promise.all(dcaOrdersUpdated),
    };
  }

  private toggleOrder(scheduleId: number) {
    const open = this.orders.open;
    open.has(scheduleId) ? open.delete(scheduleId) : open.add(scheduleId);
  }

  private syncOrder(scheduleId: number) {
    const open = this.orders.open.has(scheduleId);
    open && this.syncSummary(scheduleId);
  }

  private resetOrders() {
    this.orders = {
      ...this.orders,
      list: [],
    };
  }

  private async syncOrders() {
    if (!this.hasAccount()) {
      return;
    }

    const account = this.account.state;
    const scheduled = await this.ordersApi.getScheduled(account);
    if (this.meta.size > 0) {
      const orders = scheduled.map(async (order: DcaOrder) => {
        const assetInMeta = this.meta.get(order.assetIn);
        const assetOutMeta = this.meta.get(order.assetOut);
        const remaining = await this.getRemaining(order.id);

        const open = this.orders.open.has(order.id);
        if (open) {
          const transactions = await this.getTransactions(order.id);
          const received = await this.ordersApi.getReceived(order.id);
          const nextExecutionBlock = await this.getNextExecutionBlock(order.id);
          const nextExecution = await this.timeApi.toTimestamp(this.blockTime, nextExecutionBlock);
          const orderStatus = order.status;
          const hasPendingTx = (): boolean => {
            return nextExecutionBlock <= this.blockNumber && !orderStatus;
          };

          return {
            ...order,
            remaining,
            received,
            assetInMeta,
            assetOutMeta,
            transactions,
            nextExecution,
            nextExecutionBlock,
            hasPendingTx,
          } as DcaOrder;
        }

        return {
          ...order,
          remaining,
          assetInMeta,
          assetOutMeta,
          hasPendingTx: () => false,
        } as DcaOrder;
      });
      this.orders = {
        ...this.orders,
        list: await Promise.all(orders),
      };
    }
  }

  private async init() {
    const { api, router } = this.chain.state;
    this.assetApi = new AssetApi(api, router);
    this.ordersApi = new DcaOrdersApi(api, this.indexerUrl, this.grafanaUrl, this.grafanaDsn);
    this.timeApi = new TimeApi(api);
    const assets = await router.getAllAssets();
    this.meta = await this.assetApi.getMetadata(assets);
    this.timeApi.getBlockTime().then((time: number) => {
      this.blockTime = time;
    });
  }

  private async subscribe() {
    const { api } = this.chain.state;
    this.disconnectSubscribeNewHeads = await api.rpc.chain.subscribeNewHeads(async (lastHeader) => {
      const blockNumber = lastHeader.number.toNumber();
      this.blockNumber = blockNumber;
      this.syncOrders();
    });
  }

  override async updated() {
    if (this.chain.state && !this.ordersApi) {
      await this.init();
      await this.subscribe();
    }
  }

  protected async onAccountChange(prev: Account, curr: Account): Promise<void> {
    if (curr) {
      this.isApiReady() && this.syncOrders();
    } else {
      this.resetOrders();
    }
  }

  onResize(_evt: UIEvent) {
    this.width = window.innerWidth;
  }

  isApiReady() {
    return this.chain.state && this.ordersApi;
  }

  override connectedCallback() {
    super.connectedCallback();
    window.addEventListener('resize', (evt) => this.onResize(evt));
  }

  override disconnectedCallback() {
    window.removeEventListener('resize', this.onResize);
    this.disconnectSubscribeNewHeads?.();
    super.disconnectedCallback();
  }

  render() {
    if (this.width > 768) {
      return html` <gc-dca-grid
        class="orders"
        .defaultData=${this.orders.list}
        @order-clicked=${({ detail: { id } }: CustomEvent) => {
          this.toggleOrder(id);
          this.syncOrder(id);
        }}
      >
        <slot slot="header" name="header"></slot>
      </gc-dca-grid>`;
    } else {
      return html` <gc-dca-list
        class="orders"
        .defaultData=${this.orders.list}
        @order-clicked=${({ detail: { id } }: CustomEvent) => {
          this.toggleOrder(id);
          this.syncOrder(id);
        }}
      >
        <slot slot="header" name="header"></slot>
      </gc-dca-list>`;
    }
  }
}
