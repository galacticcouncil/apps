import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { map } from 'lit/directives/map.js';

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

import { DcaPosition, DcaTransaction } from '../types';
import { formatAmount, humanizeAmount } from '../../../../utils/amount';

@customElement('gc-dca-past-transactions-mob')
export class DcaPastTransactionsMob extends LitElement {
  @property({ attribute: false }) position: DcaPosition = null;

  constructor() {
    super();
    dayjs.extend(utc);
  }

  static styles = [
    css`
      .row {
        padding: 16px;
        background-color: rgba(255, 255, 255, 0.03);
      }

      .row:not(:last-child) {
        border-bottom: 1px solid rgba(255, 255, 255, 0.06);
      }

      .item {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        padding: 2px 0;
      }

      .item .label {
        font-weight: 500;
        font-size: 13px;
        line-height: 100%;
        text-align: left;
        color: var(--uigc-app-font-color__alternative);
        text-transform: uppercase;
      }

      .item .value {
        font-weight: 500;
        font-size: 14px;
        line-height: 100%;
        text-align: left;
        color: var(--hex-white);
      }
    `,
  ];

  protected formatDate(transaction: DcaTransaction) {
    const dateStr = transaction.date;
    return dayjs(dateStr).format('DD-MM-YYYY HH:mm');
  }

  protected formatAmount(transaction: DcaTransaction) {
    const assetOutMeta = this.position.assetOutMeta;
    const amount = formatAmount(transaction.amountOut, assetOutMeta.decimals);
    return [humanizeAmount(amount), assetOutMeta.symbol].join(' ');
  }

  protected itemTemplate(label: string, value: any) {
    return html`
      <span class="item">
        <span class="label">${label}</span>
        <span class="value">${value}</span>
      </span>
    `;
  }

  render() {
    return html`
      <div class="list">
        ${map(this.position?.transactions.slice(0, 10), (transaction: DcaTransaction) => {
          return html`
            <div class="row">
              ${this.itemTemplate('Date', this.formatDate(transaction))}
              ${this.itemTemplate('Received', this.formatAmount(transaction))}
            </div>
          `;
        })}
      </div>
    `;
  }
}
