import { html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { UIGCElement } from './base/UIGCElement';

@customElement('uigc-list-item')
export class ListItem extends UIGCElement {
  @property({ attribute: false }) item = null;
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

  onItemClick(e: any) {
    const options = {
      bubbles: true,
      composed: true,
      detail: { item: this.item },
    };
    this.dispatchEvent(new CustomEvent('list-item-click', options));
  }

  render() {
    return html`
      <button @click=${this.onItemClick} ?disabled=${this.disabled}>
        <slot></slot>
      </button>
    `;
  }
}
