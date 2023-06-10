import { html, css } from 'lit';
import { choose } from 'lit/directives/choose.js';
import { classMap } from 'lit/directives/class-map.js';

import { positionsStyles } from './base.css';

import { Datagrid } from '../../datagrid';
import { Account, Chain, accountCursor, chainCursor } from '../../../db';
import { DatabaseController } from '../../../db.ctrl';
import { formatAmount, humanizeAmount } from '../../../utils/amount';
import { getRenderString } from '../../../utils/dom';

import { ZERO, Transaction } from '@galacticcouncil/sdk';
import { SubmittableExtrinsic } from '@polkadot/api/promise/types';

import { DcaPosition } from './types';
import { TxInfo, TxNotificationMssg } from '../../transaction/types';

export abstract class DcaBasePositions extends Datagrid<DcaPosition> {
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

  private async terminate(position: DcaPosition) {
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

  protected pairTemplate(position: DcaPosition) {
    return html`
      <div class="pair">
        <uigc-logo-asset fit asset=${position.assetInMeta.symbol}></uigc-logo-asset>
        <uigc-icon-arrow alt></uigc-icon-arrow>
        <uigc-logo-asset fit asset=${position.assetOutMeta.symbol}></uigc-logo-asset>
      </div>
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

  protected getReceived(position: DcaPosition) {
    const assetOutMeta = position.assetOutMeta;
    const received = position.transactions
      .filter((trade) => !trade.status.err)
      .map((trade) => trade.amountOut)
      .reduce((a, b) => a.plus(b), ZERO);

    const receivedAmount = formatAmount(received, assetOutMeta.decimals);
    return [humanizeAmount(receivedAmount), assetOutMeta.symbol].join(' ');
  }

  protected getBudget(position: DcaPosition) {
    const assetInMeta = position.assetInMeta;
    const totalBudget = formatAmount(position.total, assetInMeta.decimals);
    if (position.status?.type == 'Completed') {
      return ['0', '/', totalBudget, assetInMeta.symbol].join(' ');
    }

    const swapped = position.transactions
      .filter((trade) => !trade.status.err)
      .map((trade) => trade.amountIn)
      .reduce((a, b) => a.plus(b), ZERO);
    const remaining = position.total.minus(swapped);
    const remainingBudget = formatAmount(remaining, assetInMeta.decimals);
    return [remainingBudget, '/', totalBudget, assetInMeta.symbol].join(' ');
  }

  protected getAmount(position: DcaPosition) {
    const assetInMeta = position.assetInMeta;
    const amount = formatAmount(position.amount, assetInMeta.decimals);
    return [amount, assetInMeta.symbol].join(' ');
  }

  protected getNextExecution(position: DcaPosition) {
    return this._dayjs(position.nextExecution).format('DD-MM-YYYY HH:mm');
  }

  protected getInterval(position: DcaPosition) {
    return position.interval;
  }

  protected getStatus(position: DcaPosition) {
    return position.status.type;
  }

  protected summaryTemplate(position: DcaPosition) {
    const classes = {
      summary: !position.status,
      hidden: !!position.status,
      item: true,
      execution: true,
    };
    return html`
      <div class="summary item">
        ${this.itemTemplate('Remaining / Budget', this.getBudget(position))}
        ${this.itemTemplate('Received', this.getReceived(position))}
      </div>
      <div class=${classMap(classes)}>
        ${this.itemTemplate('Next execution', this.getNextExecution(position))}
        <uigc-button variant="error" size="small" @click=${() => this.terminate(position)}>Terminate</uigc-button>
      </div>
    `;
  }

  protected statusTemplate(position: DcaPosition) {
    const status = position.status;
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
