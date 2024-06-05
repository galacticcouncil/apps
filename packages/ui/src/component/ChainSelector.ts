import { html, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';

import { UIGCElement } from './base/UIGCElement';

import './icons/Dropdown';

import styles from './ChainSelector.css';

@customElement('uigc-chain-selector')
export class ChainSelector extends UIGCElement {
  @property({ type: String }) title = null;
  @property({ type: String }) chain = null;
  @property({ type: String }) chainKey = null;

  static styles = [UIGCElement.styles, unsafeCSS(styles)];

  onSelectorClick(e: any) {
    const options = {
      bubbles: true,
      composed: true,
      detail: { chain: this.chainKey },
    };
    this.dispatchEvent(new CustomEvent('chain-selector-click', options));
  }

  render() {
    return html`
      <button @click=${this.onSelectorClick}>
        <span class="chain">
          <span class="title">${this.title}</span>
          ${when(
            this.chain,
            () =>
              html`
                <uigc-chain
                  .name=${this.chain}
                  .key=${this.chainKey}></uigc-chain>
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
