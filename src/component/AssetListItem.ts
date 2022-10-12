import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { themeStyles } from './styles/theme.css';
import { baseStyles } from './styles/base.css';

import './Asset';

@customElement('ui-asset-list-item')
export class AssetListItem extends LitElement {
  @property({ attribute: false }) asset = null;
  @property({ type: String }) balance = null;

  static styles = [
    baseStyles,
    themeStyles,
    css`
      button {
        display: flex;
        flex-direction: row;
        align-items: center;
        padding: 22px 28px;
        gap: 6px;
        background-color: transparent;
        width: 100%;
        height: 56px;
        cursor: pointer;
      }

      button:hover {
        background: rgba(var(--rgb-white), 0.06);
      }

      button span.balance {
        font-weight: 500;
        font-size: 14px;
        line-height: 18px;
        color: var(--hex-white);
      }
    `,
  ];

  onAssetClick(e: any) {
    const options = {
      bubbles: true,
      composed: true,
      detail: { ...this.asset },
    };
    this.dispatchEvent(new CustomEvent('asset-clicked', options));
  }

  render() {
    return html` <button @click=${this.onAssetClick}>
      <ui-asset .asset=${this.asset.symbol}></ui-asset>
      <span class="grow"></span>
      <span class="balance">${this.balance || 0} ${this.asset.symbol}</span>
    </button>`;
  }
}
