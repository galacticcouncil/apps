import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { UIGCElement } from './base/UIGCElement';

import './icons/Dropdown';

import styles from './Selector.css';

@customElement('uigc-selector')
export class Selector extends UIGCElement {
  @property({ type: String }) item = null;
  @property({ type: String }) title = null;
  @property({ type: Boolean }) readonly = false;

  static styles = [UIGCElement.styles, styles];

  onSelectorClick(e: any) {
    const options = {
      bubbles: true,
      composed: true,
      detail: { item: this.item },
    };
    this.dispatchEvent(new CustomEvent('selector-click', options));
  }

  render() {
    return html`
      <div tabindex="0" class="selector-root">
        <button @click=${this.onSelectorClick}>
          <span class="title">${this.title}</span>
          <div>
            <slot></slot>
            <uigc-icon-dropdown alt></uigc-icon-dropdown>
          </div>
        </button>
      </div>
    `;
  }
}
