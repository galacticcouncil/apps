import { css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { map } from 'lit/directives/map.js';
import { when } from 'lit/directives/when.js';

import { DcaOrder, DcaTransaction } from '../types';
import { formatAmount, humanizeAmount } from '../../../../utils/amount';

import { BaseElement } from '../../../base/BaseElement';
import { ZERO } from '@galacticcouncil/sdk';

@customElement('gc-dca-list-tx')
export class DcaOrdersListTx extends BaseElement {
  @property({ attribute: false }) position: DcaOrder = null;

  static styles = [
    css`
      .row {
        padding: 8px 16px;
        background-color: rgba(255, 255, 255, 0.03);
      }

      .row:not(:last-child) {
        border-bottom: 1px solid rgba(255, 255, 255, 0.06);
      }

      .item {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        padding: 3px 0;
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

      .error {
        margin-top: 5px;
        font-size: 10px;
        font-size: 12px;
        display: flex;
        align-items: center;
      }

      .error span {
        color: #ffec8a;
      }

      uigc-icon-warning {
        margin-right: 5px;
      }
    `,
  ];

  protected formatDate(transaction: DcaTransaction) {
    const dateStr = transaction.date;
    return this._dayjs(dateStr).format('DD-MM-YYYY HH:mm');
  }

  protected formatAmount(transaction: DcaTransaction) {
    const received = transaction.amountOut;
    if (received.isEqualTo(ZERO)) {
      return '-';
    }
    const assetOutMeta = this.position.assetOutMeta;
    const amount = formatAmount(transaction.amountOut, assetOutMeta.decimals);
    return [humanizeAmount(amount), assetOutMeta.symbol].join(' ');
  }

  protected formatPrice(transaction: DcaTransaction) {
    const received = transaction.amountOut;
    if (received.isEqualTo(ZERO)) {
      return '-';
    }

    const { assetInMeta, assetOutMeta } = this.position;

    const aIn = transaction.amountIn.shiftedBy(-1 * assetInMeta.decimals);
    const aOut = transaction.amountOut.shiftedBy(-1 * assetOutMeta.decimals);

    const price = aOut.div(aIn);
    return [humanizeAmount(price.toFixed()), assetOutMeta.symbol].join(' ');
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
              ${this.itemTemplate('Price', this.formatPrice(transaction))}
              ${when(
                transaction.status.type === 'TradeFailed',
                () => html`
                  <div class="error">
                    <uigc-icon-warning></uigc-icon-warning>
                    <span>${transaction.status.desc}</span>
                  </div>
                `
              )}
            </div>
          `;
        })}
      </div>
    `;
  }
}
