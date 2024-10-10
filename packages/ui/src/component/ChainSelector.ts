import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';

import { UIGCElement } from './base/UIGCElement';

import './icons/Dropdown';

import styles from './ChainSelector.css';

@customElement('uigc-chain-selector')
export class ChainSelector extends UIGCElement {
  @property({ type: String }) title = null;
  @property({ type: String }) chain = null;

  static styles = [UIGCElement.styles, styles];

  onSelectorClick(e: any) {
    const options = {
      bubbles: true,
      composed: true,
      detail: { chain: this.chain },
    };
    this.dispatchEvent(new CustomEvent('chain-selector-click', options));
  }
  render() {
    return html`
      <button @click=${this.onSelectorClick}>
        <span class="title">${this.title}</span>
        <span class="chain">
          ${when(
            this.chain,
            () => html`
              <slot name="chain"></slot>
            `,
            () => html`
              <span class="select">
                <span>Select chain</span>
              </span>
            `,
          )}
        </span>
        <uigc-icon-dropdown></uigc-icon-dropdown>
      </button>
    `;
  }
}
