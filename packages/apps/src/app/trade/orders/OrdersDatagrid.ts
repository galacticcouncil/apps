import { html } from 'lit';
import { property } from 'lit/decorators.js';
import { choose } from 'lit/directives/choose.js';
import { classMap } from 'lit/directives/class-map.js';

import {
  Account,
  AccountCursor,
  Chain,
  ChainCursor,
  DatabaseController,
} from 'db';
import { Datagrid } from 'element/datagrid';
import { TxInfo, TxMessage } from 'signer/types';
import { formatAmount, humanizeAmount } from 'utils/amount';
import { getRenderString } from 'utils/dom';

import { Amount, Asset, SubstrateTransaction } from '@galacticcouncil/sdk';
import { SubmittableExtrinsic } from '@polkadot/api/promise/types';

import { Order } from './types';

import 'element/id/AssetIdenticon';

import styles from './OrdersDatagrid.css';

export abstract class OrdersDatagrid extends Datagrid<Order> {
  protected chain = new DatabaseController<Chain>(this, ChainCursor);
  protected account = new DatabaseController<Account>(this, AccountCursor);

  static styles = [Datagrid.styles, styles];

  @property({ attribute: false }) assets: Map<string, Asset> = new Map([]);
  @property({ attribute: false }) atokens: Map<string, string> = new Map([]);
  @property({ attribute: false }) balances: Map<string, Amount> = new Map([]);

  notificationTemplate(mssg: string): TxMessage {
    const template = html`
      <span>${mssg}</span>
    `;
    return {
      message: template,
      rawHtml: getRenderString(template),
    } as TxMessage;
  }

  processTx(account: Account, transaction: SubstrateTransaction) {
    const notification = {
      processing: this.notificationTemplate('Terminating DCA schedule'),
      success: this.notificationTemplate('DCA schedule terminated'),
      failure: this.notificationTemplate('Termination of DCA schedule failed'),
    };
    const options = {
      bubbles: true,
      composed: true,
      detail: {
        account: account,
        transaction: transaction,
        notification: notification,
      } as TxInfo,
    };
    this.dispatchEvent(new CustomEvent<TxInfo>('gc:tx:terminateDca', options));
  }

  private async terminate(position: Order) {
    const chain = this.chain.state;
    const account = this.account.state;

    const tx: SubmittableExtrinsic = chain.api.tx.dca.terminate(
      position.id,
      position.nextExecutionBlock,
    );
    const transaction = {
      hex: tx.toHex(),
      name: 'dcaTerminate',
      get: (): SubmittableExtrinsic => {
        return tx;
      },
    } as SubstrateTransaction;
    this.processTx(account, transaction);
  }

  protected pairTemplate(order: Order) {
    const { assetIn, assetOut } = order;
    return html`
      <div class="pair">
        ${this.assetTemplate(assetIn)}
        <uigc-icon-arrow alt></uigc-icon-arrow>
        ${this.assetTemplate(assetOut)}
      </div>
    `;
  }

  private assetTemplate(asset: Asset) {
    const chain = this.chain.state;
    return html`
      <gc-asset-identicon
        slot="asset"
        size="small"
        .showSymbol=${false}
        .asset=${asset}
        .assets=${this.assets}
        .atokens=${this.atokens}
        .ecosystem=${chain.ecosystem}></gc-asset-identicon>
    `;
  }

  protected itemTemplate(label: string, value: any) {
    return html`
      <div>
        <span class="label">${label}</span>
        <span class="value">${value}</span>
      </div>
    `;
  }

  protected getReceived(order: Order) {
    const { decimals, symbol } = order.assetOut;
    const received = order.received;
    if (received) {
      const receivedAmount = formatAmount(received, decimals);
      return [humanizeAmount(receivedAmount), symbol].join(' ');
    } else {
      return '-';
    }
  }

  protected getBudget(order: Order) {
    const { decimals, id, symbol } = order.assetIn;

    if (order.total.isZero()) {
      const balance = this.balances.get(id);
      const remainingBudget = formatAmount(balance.amount, decimals);
      const remainingBudgetHuman = humanizeAmount(remainingBudget);
      return [remainingBudgetHuman, '/', '∞', symbol].join(' ');
    }

    const totalBudget = formatAmount(order.total, decimals);
    const totalBudgetHuman = humanizeAmount(totalBudget);
    if (order.status?.type == 'Completed') {
      return ['0', '/', totalBudgetHuman, symbol].join(' ');
    }

    const remainingBudget = formatAmount(order.remaining, decimals);
    const remainingBudgetHuman = humanizeAmount(remainingBudget);
    return [remainingBudgetHuman, '/', totalBudgetHuman, symbol].join(' ');
  }

  protected getAmount(order: Order) {
    const { decimals, symbol } = order.assetIn;
    const amount = formatAmount(order.amount, decimals);
    return [humanizeAmount(amount), symbol].join(' ');
  }

  protected getNextExecution(order: Order) {
    if (!order.nextExecutionBlock) {
      return '-';
    }

    if (order.hasPendingTx()) {
      const humanized = this._humanizer.humanize(0, {
        round: true,
        largest: 2,
      });
      return html`
        <span class="pulsate">${humanized}</span>
      `;
    } else {
      const diff = Date.now() - order.nextExecution;
      return this._humanizer.humanize(diff, { round: true, largest: 2 });
    }
  }

  protected getInterval(order: Order) {
    return order.interval;
  }

  protected getStatus(order: Order) {
    return order.status.type;
  }

  protected summaryTemplate(order: Order) {
    const classes = {
      summary: !order.status,
      hidden: !!order.status,
      item: true,
      execution: true,
    };
    return html`
      <div class="summary item">
        ${this.itemTemplate('Remaining / Budget', this.getBudget(order))}
        ${this.itemTemplate('Received', this.getReceived(order))}
      </div>
      <div class=${classMap(classes)}>
        ${this.itemTemplate('Next execution in', this.getNextExecution(order))}
        <uigc-button
          variant="error"
          size="small"
          ?disabled=${!order.nextExecutionBlock}
          @click=${() => this.terminate(order)}>
          Terminate
        </uigc-button>
      </div>
    `;
  }

  protected statusTemplate(order: Order) {
    const status = order.status;
    if (status) {
      return html`
        ${choose(status.type, [
          [
            'Terminated',
            () =>
              html`
                <span class="status status__terminated">${status.type}</span>
              `,
          ],
          [
            'Completed',
            () =>
              html`
                <span class="status status__completed">${status.type}</span>
              `,
          ],
        ])}
      `;
    } else {
      return html`
        <span class="status status__active">Active</span>
      `;
    }
  }
}
