import { html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';

import { UIGCElement } from './base/UIGCElement';

import './icons/Dropdown';

@customElement('uigc-chain-selector')
export class ChainSelector extends UIGCElement {
  @property({ type: String }) title = null;
  @property({ type: String }) chain = null;
  @property({ type: String }) chainKey = null;

  static styles = [
    UIGCElement.styles,
    css`
      :host {
        border-radius: 12px;
        width: 100%;
      }

      button {
        width: 100%;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        padding: 12px 12px 12px 18px;
        border-radius: var(--uigc-chain-selector-border-radius);
        cursor: pointer;
        background: var(--uigc-chain-selector-background);
        border: var(--uigc-chain-selector-border);
      }

      button .title {
        display: flex;
        align-items: center;
        color: var(--uigc-chain-selector--title-color);
        font-weight: var(--uigc-chain-selector--title-font-weight);
        font-size: var(--uigc-asset-transfer--title-font-size);
        line-height: var(--uigc-asset-transfer--title-line-height);
        text-transform: var(--uigc-asset-transfer--title-text-transform);
      }

      button .chain {
        display: flex;
        flex-direction: column;
        gap: 14px;
      }

      button:focus,
      button:focus-visible,
      button:focus-within,
      button:hover {
        background: var(--uigc-chain-selector-background__hover);
        border: var(--uigc-chain-selector-border);
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
    `,
  ];

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
