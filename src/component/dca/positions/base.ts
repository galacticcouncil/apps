import { html, css } from 'lit';
import { choose } from 'lit/directives/choose.js';

import { positionsStyles } from './base.css';
import { Datagrid } from '../../datagrid';
import { formatAmount, humanizeAmount } from '../../../utils/amount';

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

import { ZERO } from '@galacticcouncil/sdk';
import { DcaPosition } from './types';

export abstract class DcaBasePositions extends Datagrid<DcaPosition> {
  constructor() {
    super();
    dayjs.extend(utc);
  }

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
    return position.nextExecution ? dayjs(position.nextExecution).format('DD-MM-YYYY HH:mm') : '-';
  }

  protected getInterval(position: DcaPosition) {
    return position.interval;
  }

  protected getStatus(position: DcaPosition) {
    return position.status.type;
  }

  protected summaryTemplate(position: DcaPosition) {
    return html`
      <div class="summary item">
        ${this.itemTemplate('Remaining / Total Budget', this.getBudget(position))}
        ${this.itemTemplate('Total Received', this.getReceived(position))}
        ${this.itemTemplate('Next Execution', this.getNextExecution(position))}
        <uigc-button variant="secondary" size="small">Terminate</uigc-button>
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
