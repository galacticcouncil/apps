import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { UIGCElement } from './base/UIGCElement';

import styles from './ListItem.css';

@customElement('uigc-list-item')
export class ListItem extends UIGCElement {
  @property({ attribute: false }) item = null;
  @property({ type: Boolean }) disabled = false;

  static styles = [UIGCElement.styles, styles];

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
