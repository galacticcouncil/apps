import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { UIGCElement } from './base/UIGCElement';

import styles from './ToggleButton.css';

@customElement('uigc-toggle-button')
export class ToggleButton extends UIGCElement {
  @property({ type: String }) value = null;

  static styles = [UIGCElement.styles, styles];

  onClick(e: CustomEvent) {
    const options = {
      bubbles: true,
      composed: true,
      detail: { value: this.value },
    };
    this.dispatchEvent(new CustomEvent('toggle-button-click', options));
  }

  render() {
    return html`
      <button
        class="toggle-button-root"
        @click=${this.onClick}
        value=${this.value}>
        <slot></slot>
      </button>
    `;
  }
}
