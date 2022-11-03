import { html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { UIGCElement } from './base/UIGCElement';

import './AssetInput';
import './AssetSelector';

@customElement('ui-asset-transfer')
export class AssetTransfer extends UIGCElement {
  @property({ type: String }) id = null;
  @property({ type: String }) title = null;
  @property({ type: String }) balance = null;
  @property({ type: String }) amount = null;
  @property({ type: String }) asset = null;

  static styles = [
    UIGCElement.styles,
    css`
      :host {
        display: grid;
        background: rgba(var(--rgb-primary-100), 0.06);
        border-radius: 12px;
        box-sizing: border-box;
        padding: 14px;
        row-gap: 5px;
      }

      :host > :nth-child(1) {
        grid-area: 1 / 1 / 2 / 3;
      }

      :host > :nth-child(2) {
        padding-top: 5px;
        grid-area: 3 / 1 / 4 / 3;
      }

      :host > :nth-child(3) {
        grid-area: 2 / 1 / 3 / 3;
      }

      @media (min-width: 768px) {
        :host {
          padding: 20px;
          row-gap: 11px;
        }

        :host > :nth-child(1) {
          grid-area: 1 / 1 / 2 / 2;
        }

        :host > :nth-child(2) {
          padding-top: 0;
          grid-area: 1 / 2 / 2 / 3;
        }

        :host > :nth-child(3) {
          grid-area: 2 / 1 / 3 / 3;
        }
      }

      .title {
        font-weight: 600;
        font-size: 16px;
        line-height: 22px;
        color: var(--hex-primary-200);
      }

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
      }

      .asset {
        display: flex;
        flex-direction: row;
        align-items: center;
      }

      .asset > *:last-child {
        margin-left: 18px;
      }

      @media (min-width: 768px) {
        .asset > *:last-child {
          margin-left: 23px;
        }
      }
    `,
  ];

  onMaxClick(e: Event) {
    this.amount = this.balance;
    const options = {
      bubbles: true,
      composed: true,
      detail: { id: this.id, asset: this.asset, value: this.amount },
    };
    this.dispatchEvent(new CustomEvent('asset-input-changed', options));
  }

  render() {
    return html`
      <span class="title">${this.title}</span>
      <div class="balance">
        <span class="label">Your balance: &nbsp</span>
        <span>${this.balance ? this.balance : '-'}</span>
        <ui-button
          class="max"
          variant="max"
          size="micro"
          capitalize
          ?disabled=${this.balance == null}
          @click=${this.onMaxClick}
          >Max</ui-button
        >
      </div>
      <div class="asset">
        <ui-asset-selector id=${this.id} .asset=${this.asset}></ui-asset-selector>
        <ui-asset-input id=${this.id} .asset=${this.asset} .amount=${this.amount}></ui-asset-input>
      </div>
    `;
  }
}
