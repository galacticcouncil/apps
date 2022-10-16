import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';

import { themeStyles } from './styles/theme.css';
import { baseStyles } from './styles/base.css';

const KNOWN_ASSETS = new Map(
  Object.entries({
    aUSD: 'Acala USD',
    BSX: 'Basilisk',
    KSM: 'Kusama',
    PHA: 'Phala',
  })
);

@customElement('ui-asset-selector')
export class AssetSelector extends LitElement {
  @property({ type: String }) id = null;
  @property({ type: String }) asset = null;

  static styles = [
    baseStyles,
    themeStyles,
    css`
      :host {
        border-radius: 12px;
      }

      button {
        display: flex;
        flex-direction: row;
        align-items: center;
        padding: 0 6px;
        gap: 6px;
        background-color: transparent;
        width: 147px;
        height: 52px;
        border-radius: 8px;
        cursor: pointer;
      }

      button:hover {
        background: rgba(var(--rgb-white), 0.06);
      }

      .select {
        display: flex;
        padding: 0 6px;
        gap: 6px;
      }

      .select span {
        font-weight: 700;
        font-size: 16px;
        line-height: 100%;
        color: var(--hex-white);
      }

      .select img {
        margin-top: 3px;
      }
    `,
  ];

  onSelectorClick(e: any) {
    const options = {
      bubbles: true,
      composed: true,
      detail: { id: this.id, asset: this.asset },
    };
    this.dispatchEvent(new CustomEvent('asset-selector-clicked', options));
  }

  render() {
    return html` <button @click=${this.onSelectorClick}>
      ${when(
        this.asset,
        () => html` <ui-asset .asset=${this.asset}>
          <img src="assets/img/icon/dropdown.svg" alt="dropdown" />
        </ui-asset>`,
        () => html` <span class="select">
          <span> Select token </span>
          <img src="assets/img/icon/dropdown.svg" alt="dropdown" />
        </span>`
      )}
    </button>`;
  }
}
