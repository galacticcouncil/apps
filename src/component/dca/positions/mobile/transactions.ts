import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { map } from 'lit/directives/map.js';

import { PastTransactions } from '../model';

@customElement('gc-dca-past-transactions-mob')
export class DcaPastTransactionsMob extends LitElement {
  @property({ attribute: false }) defaultData: PastTransactions[] = [];

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
        ${map(this.defaultData, (transaction: PastTransactions) => {
          return html`
            <div class="row">
              ${this.itemTemplate('Date', transaction.date)} ${this.itemTemplate('Amount', transaction.amount)}
              ${this.itemTemplate('Price', transaction.price)} ${this.itemTemplate('Balance', transaction.balance)}
            </div>
          `;
        })}
      </div>
    `;
  }
}
