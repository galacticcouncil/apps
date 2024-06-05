import { html, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';

import { UIGCElement } from './base/UIGCElement';
import { amountFormatter } from './utils/formatters';

import styles from './AssetBalance.css';

@customElement('uigc-asset-balance')
export class AssetBalance extends UIGCElement {
  @property({ type: String }) balance = null;
  @property({ type: Boolean }) disabled = false;
  @property({ type: Boolean }) visible = true;
  @property({ attribute: false }) formatter = null;
  @property({ attribute: false }) onMaxClick = null;

  static styles = [UIGCElement.styles, unsafeCSS(styles)];

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
