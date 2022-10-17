import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import './AssetInput';
import './AssetSelector';

@customElement('ui-asset-transfer')
export class AssetTransfer extends LitElement {
  @property({ type: String }) id = null;
  @property({ type: String }) title = null;
  @property({ type: String }) balance = 0;
  @property({ type: String }) amount = 0;
  @property({ type: String }) asset = null;

  static styles = [
    css`
      :host {
        display: flex;
        flex-direction: column;
        padding: 20px 23px;
        gap: 10px;
        background: rgba(var(--rgb-primary-100), 0.06);
        border-radius: 12px;
        box-sizing: border-box;
      }

      .info {
        display: flex;
        flex-direction: row;
        align-items: center;
      }

      .info > .title {
        font-weight: 600;
        font-size: 16px;
        line-height: 22px;
        color: var(--hex-primary-200);
      }

      .info > .balance {
        font-weight: 500;
        font-size: 12px;
        line-height: 16px;
        color: var(--hex-white);
      }

      .info > .label {
        color: rgba(var(--rgb-white), 0.7);
      }

      .grow {
        flex: 1;
      }

      .info > .max {
        margin-left: 5px;
      }

      .asset {
        display: flex;
        flex-direction: row;
        align-items: center;
      }

      .asset > *:last-child {
        margin-left: 23px;
      }
    `,
  ];

  render() {
    return html`
      <div class="info">
        <span class="title">${this.title}</span>
        <span class="grow"></span>
        <span class="balance label">Your balance: &nbsp</span>
        <span class="balance">${this.balance}</span>
        <ui-button class="max" variant="max" size="micro" capitalize>Max</ui-button>
      </div>
      <div class="asset">
        <ui-asset-selector id=${this.id} .asset=${this.asset}></ui-asset-selector>
        <ui-asset-input id=${this.id} .asset=${this.asset} .amount=${this.amount}></ui-asset-input>
      </div>
    `;
  }
}
