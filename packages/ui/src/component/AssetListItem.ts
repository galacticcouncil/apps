import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';

import { UIGCElement } from './base/UIGCElement';

import './AssetId';

import styles from './AssetListItem.css';

@customElement('uigc-asset-list-item')
export class AssetListItem extends UIGCElement {
  @property({ type: Object }) asset = null;
  @property({ type: String }) unit = null;
  @property({ type: String }) balance = null;
  @property({ type: String }) balanceUsd = null;
  @property({ type: Boolean }) disabled = false;

  static styles = [UIGCElement.styles, styles];

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
