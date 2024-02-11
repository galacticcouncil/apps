import { html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';

import { UIGCElement } from './base/UIGCElement';
import { amountFormatter } from './utils/formatters';

@customElement('uigc-asset-balance')
export class AssetBalance extends UIGCElement {
  @property({ type: String }) balance = null;
  @property({ type: Boolean }) disabled = false;
  @property({ type: Boolean }) visible = true;
  @property({ attribute: false }) formatter = null;
  @property({ attribute: false }) onMaxClick = null;

  static styles = [
    UIGCElement.styles,
    css`
      .balance {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: end;
      }

      .balance > span {
        font-weight: 500;
        font-size: 12px;
        line-height: 16px;
        color: var(--hex-white);
      }

      .balance > span.label {
        color: rgba(var(--rgb-white), 0.7);
      }

      .max {
        margin-left: 5px;
        margin-top: -2px;
      }
    `,
  ];

  isEmptyBalance() {
    return this.balance == null || this.balance == '' || this.balance == '0';
  }

  render() {
    const formatterFn = this.formatter ? this.formatter : amountFormatter;
    return html`
      <div class="balance">
        <span class="label">Balance: &nbsp</span>
        <span>${this.balance ? formatterFn(this.balance) : '-'}</span>
        ${when(
          this.visible,
          () => html`
            <uigc-button
              class="max"
              variant="max"
              size="micro"
              capitalize
              ?disabled=${this.isEmptyBalance() || this.disabled}
              @click=${this.onMaxClick}>
              Max
            </uigc-button>
          `,
        )}
      </div>
    `;
  }
}
