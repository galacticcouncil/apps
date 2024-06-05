import { html, unsafeCSS, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { baseStyles } from 'styles';
import styles from './Button.css';

@customElement('uigc-range-button')
export class RangeButton extends LitElement {
  @property({ type: String }) value = null;

  static styles = [unsafeCSS(baseStyles), unsafeCSS(styles)];

  onClick(e: CustomEvent) {
    const options = {
      bubbles: true,
      composed: true,
      detail: { value: this.value },
    };
    this.dispatchEvent(new CustomEvent('range-button-clicked', options));
  }

  render() {
    return html`
      <button class="toggle-button-root" @click=${this.onClick}>
        <slot></slot>
      </button>
    `;
  }
}
