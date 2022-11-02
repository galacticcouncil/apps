import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { baseStyles } from './styles/base.css';
import { themeStyles } from './styles/theme.css';
import { fontStyles } from './styles/font.css';

import './Asset';

@customElement('ui-asset-list-item')
export class AssetListItem extends LitElement {
  @property({ attribute: false }) asset = null;
  @property({ type: String }) balance = null;
  @property({ type: Boolean }) disabled = false;

  static styles = [
    baseStyles,
    themeStyles,
    fontStyles,
    css`
      :host([disabled]) {
        opacity: 0.6;
        pointer-events: none;
      }

      :host([selected]) {
        background-color: rgba(var(--rgb-primary-450), 0.12);
        pointer-events: none;
      }

      button {
        display: flex;
        flex-direction: row;
        align-items: center;
        padding: 22px 14px;
        gap: 6px;
        background-color: transparent;
        width: 100%;
        height: 56px;
        cursor: pointer;
      }

      @media (min-width: 768px) {
        button {
          padding: 22px 28px;
        }
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
    return html` <button @click=${this.onAssetClick} ?disabled=${this.disabled}>
      <ui-asset .asset=${this.asset.symbol}></ui-asset>
      <span class="grow"></span>
      <span class="balance">${this.balance || 0} ${this.asset.symbol}</span>
    </button>`;
  }
}
