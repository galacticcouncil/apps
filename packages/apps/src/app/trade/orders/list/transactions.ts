import { css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { map } from 'lit/directives/map.js';
import { when } from 'lit/directives/when.js';

import { ZERO } from '@galacticcouncil/sdk';

import { BaseElement } from 'element/BaseElement';
import { formatAmount, humanizeAmount } from 'utils/amount';

import { Order, OrderTransaction } from '../types';

@customElement('gc-orders-list-tx')
export class OrdersListTx extends BaseElement {
  @property({ attribute: false }) order: Order = null;

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

  protected formatDate(transaction: OrderTransaction) {
    const dateStr = transaction.date;
    return this._dayjs(dateStr).format('DD-MM-YYYY HH:mm');
  }

  protected formatAmount(transaction: OrderTransaction) {
    const received = transaction.amountOut;
    if (received.isEqualTo(ZERO)) {
      return '-';
    }
    const { decimals, symbol } = this.order.assetOut;
    const amount = formatAmount(transaction.amountOut, decimals);
    return [humanizeAmount(amount), symbol].join(' ');
  }

  protected formatPrice(transaction: OrderTransaction) {
    const received = transaction.amountOut;
    if (received.isEqualTo(ZERO)) {
      return '-';
    }

    const { assetIn, assetOut } = this.order;

    const aIn = transaction.amountIn.shiftedBy(-1 * assetIn.decimals);
    const aOut = transaction.amountOut.shiftedBy(-1 * assetOut.decimals);

    const price = aOut.div(aIn);
    return [humanizeAmount(price.toFixed()), assetOut.symbol].join(' ');
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
        ${map(
          this.order?.transactions.slice(0, 10),
          (transaction: OrderTransaction) => {
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
                  `,
                )}
              </div>
            `;
          },
        )}
      </div>
    `;
  }
}
