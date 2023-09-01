import { html, css } from 'lit';
import { choose } from 'lit/directives/choose.js';
import { classMap } from 'lit/directives/class-map.js';

import { positionsStyles } from './datagrid.css';

import { Datagrid } from '../datagrid';
import { Account, Chain, accountCursor, chainCursor } from '../../db';
import { DatabaseController } from '../../db.ctrl';
import { formatAmount, humanizeAmount } from '../../utils/amount';
import { getChainKey } from '../../utils/chain';
import { getRenderString } from '../../utils/dom';

import { Transaction } from '@galacticcouncil/sdk';
import { SubmittableExtrinsic } from '@polkadot/api/promise/types';

import { DcaOrder } from './types';
import { TxInfo, TxNotificationMssg } from '../transaction/types';

export abstract class DcaBaseDatagrid extends Datagrid<DcaOrder> {
  protected chain = new DatabaseController<Chain>(this, chainCursor);
  protected account = new DatabaseController<Account>(this, accountCursor);

  static styles = [
    Datagrid.styles,
    positionsStyles,
    css`
      uigc-button path {
        stroke: var(--uigc-app-font-color__primary);
        transition: 0.2s ease-in-out;
      }

      uigc-button:hover path {
        stroke: #fff;
        transition: 0.2s ease-in-out;
      }

      .pulsate {
        animation: pulsate 3s ease-out;
        animation-iteration-count: infinite;
        opacity: 0.5;
        color: rgb(166, 221, 255);
      }

      @keyframes pulsate {
        0% {
          opacity: 0.5;
        }
        50% {
          opacity: 1;
        }
        100% {
          opacity: 0.5;
        }
      }
    `,
  ];

  notificationTemplate(mssg: string): TxNotificationMssg {
    const template = html` <span>${mssg}</span> `;
    return {
      message: template,
      rawHtml: getRenderString(template),
    } as TxNotificationMssg;
  }

  processTx(account: Account, transaction: Transaction) {
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

  private async terminate(position: DcaOrder) {
    const chain = this.chain.state;
    const account = this.account.state;

    const tx: SubmittableExtrinsic = chain.api.tx.dca.terminate(position.id, position.nextExecutionBlock);
    const transaction = {
      hex: tx.toHex(),
      name: 'dcaTerminate',
      get: (): SubmittableExtrinsic => {
        return tx;
      },
    } as Transaction;
    this.processTx(account, transaction);
  }

  protected pairTemplate(order: DcaOrder) {
    const assetIn = order.assetInMeta?.symbol;
    const assetOut = order.assetOutMeta?.symbol;
    return html`
      <div class="pair">
        ${this.assetTemplate(assetIn, order.assetInOrigin)}
        <uigc-icon-arrow alt></uigc-icon-arrow>
        ${this.assetTemplate(assetOut, order.assetOutOrigin)}
      </div>
    `;
  }

  private assetTemplate(symbol: string, origin: number) {
    const chain = this.chain.state;
    const assetOrigin = getChainKey(origin, chain?.ecosystem);
    if (origin) {
      return html` <uigc-asset-id symbol=${symbol} chain=${assetOrigin}></uigc-asset-id>`;
    } else {
      return html` <uigc-asset-id symbol=${symbol}></uigc-asset-id>`;
    }
  }

  protected itemTemplate(label: string, value: any) {
    return html`
      <div>
        <span class="label">${label}</span>
        <span class="value">${value}</span>
      </div>
    `;
  }

  protected getReceived(order: DcaOrder) {
    const assetOutMeta = order.assetOutMeta;
    const received = order.received;
    if (received) {
      const receivedAmount = formatAmount(received, assetOutMeta.decimals);
      return [humanizeAmount(receivedAmount), assetOutMeta.symbol].join(' ');
    } else {
      return '-';
    }
  }

  protected getBudget(order: DcaOrder) {
    const assetInMeta = order.assetInMeta;
    const totalBudget = formatAmount(order.total, assetInMeta.decimals);
    const totalBudgetHuman = humanizeAmount(totalBudget);
    if (order.status?.type == 'Completed') {
      return ['0', '/', totalBudgetHuman, assetInMeta.symbol].join(' ');
    }

    const remainingBudget = formatAmount(order.remaining, assetInMeta.decimals);
    const remainingBudgetHuman = humanizeAmount(remainingBudget);
    return [remainingBudgetHuman, '/', totalBudgetHuman, assetInMeta.symbol].join(' ');
  }

  protected getAmount(order: DcaOrder) {
    const assetInMeta = order.assetInMeta;
    const amount = formatAmount(order.amount, assetInMeta.decimals);
    return [humanizeAmount(amount), assetInMeta.symbol].join(' ');
  }

  protected getNextExecution(order: DcaOrder) {
    if (order.hasPendingTx()) {
      const humanized = this._humanizer.humanize(0, { round: true, largest: 2 });
      return html`<span class="pulsate">${humanized}</span>`;
    } else {
      const diff = Date.now() - order.nextExecution;
      return this._humanizer.humanize(diff, { round: true, largest: 2 });
    }
  }

  protected getInterval(order: DcaOrder) {
    return order.interval;
  }

  protected getStatus(order: DcaOrder) {
    return order.status.type;
  }

  protected summaryTemplate(order: DcaOrder) {
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
        <uigc-button variant="error" size="small" @click=${() => this.terminate(order)}>Terminate</uigc-button>
      </div>
    `;
  }

  protected statusTemplate(order: DcaOrder) {
    const status = order.status;
    if (status) {
      return html` ${choose(status.type, [
        ['Terminated', () => html`<span class="status status__terminated">${status.type}</span>`],
        ['Completed', () => html`<span class="status status__completed">${status.type}</span>`],
      ])}`;
    } else {
      return html`<span class="status status__active">Active</span>`;
    }
  }
}
