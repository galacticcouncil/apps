import { html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';

import { UIGCElement } from './base/UIGCElement';

import './icons/Dropdown';

@customElement('uigc-asset-selector')
export class AssetSelector extends UIGCElement {
  @property({ type: String }) id = null;
  @property({ type: String }) asset = null;

  static styles = [
    UIGCElement.styles,
    css`
      :host {
        border-radius: 12px;
      }

      button {
        display: flex;
        flex-direction: row;
        align-items: center;
        padding: 5px;
        gap: 6px;
        background-color: transparent;
        border-radius: var(--uigc-asset-selector-border-radius);
        height: 42px;
        cursor: pointer;
      }

      button:hover {
        background: rgba(var(--rgb-white), 0.06);
        transition: 0.2s ease-in-out;
      }

      .select {
        display: flex;
        align-items: center;
        padding: 0 6px;
        gap: 6px;
      }

      .select span {
        font-weight: 700;
        font-size: 16px;
        line-height: 100%;
        color: var(--hex-white);
        white-space: nowrap;
      }

      .select uigc-icon-dropdown {
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
    this.dispatchEvent(new CustomEvent('asset-selector-click', options));
  }

  render() {
    return html`
      <button @click=${this.onSelectorClick}>
        ${when(
          this.asset,
          () => html`
            <slot name="asset"></slot>
            <uigc-icon-dropdown></uigc-icon-dropdown>
          `,
          () => html`
            <span class="select">
              <span>Select asset</span>
              <uigc-icon-dropdown></uigc-icon-dropdown>
            </span>
          `,
        )}
      </button>
    `;
  }
}
