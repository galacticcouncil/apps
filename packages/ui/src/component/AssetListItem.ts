import { html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';

import { UIGCElement } from './base/UIGCElement';

import './AssetId';

@customElement('uigc-asset-list-item')
export class AssetListItem extends UIGCElement {
  @property({ type: Object }) asset = null;
  @property({ type: String }) unit = null;
  @property({ type: String }) balance = null;
  @property({ type: String }) balanceUsd = null;
  @property({ type: Boolean }) disabled = false;

  static styles = [
    UIGCElement.styles,
    css`
      :host([disabled]) {
        opacity: 0.6;
        pointer-events: none;
      }

      :host([selected]) {
        background-color: var(--uigc-list-item__selected-background);
      }

      .secondary {
        display: flex;
        flex-direction: column;
        text-align: right;
      }

      .secondary span {
        font-weight: 500;
        font-size: 14px;
        line-height: 12px;
        color: var(--hex-white);
      }

      .secondary span.desc {
        font-weight: var(--uigc-list-item--secondary-desc-font-weight);
        font-size: 12px;
        line-height: 140%;
        color: var(--uigc-list-item--secondary-color);
      }

      button {
        display: flex;
        flex-direction: row;
        align-items: center;
        padding: 22px 14px;
        gap: 6px;
        background-color: transparent;
        background: var(--uigc-list-item--button-background);
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
    `,
  ];

  onAssetClick(e: any) {
    const options = {
      bubbles: true,
      composed: true,
      detail: { ...this.asset },
    };
    this.dispatchEvent(new CustomEvent('asset-click', options));
  }

  render() {
    return html`
      <button @click=${this.onAssetClick} ?disabled=${this.disabled}>
        <slot name="asset"></slot>
        <div class="grow"></div>
        <div class="secondary">
          <span>${this.balance || 0} ${this.unit}</span>
          ${when(
            this.balanceUsd,
            () =>
              html`
                <span class="desc">≈ ${this.balanceUsd} USD</span>
              `,
          )}
        </div>
      </button>
    `;
  }
}
