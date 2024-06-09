import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';

import { UIGCElement } from './base/UIGCElement';

import './icons/Dropdown';

import styles from './AssetSelector.css';

@customElement('uigc-asset-selector')
export class AssetSelector extends UIGCElement {
  @property({ type: String }) id = null;
  @property({ type: String }) asset = null;

  static styles = [UIGCElement.styles, styles];

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
