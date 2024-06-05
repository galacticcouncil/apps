import { html, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { UIGCElement } from './base/UIGCElement';

import styles from './Button.css';

@customElement('uigc-button')
export class Button extends UIGCElement {
  @property({ type: Boolean }) disabled = false;

  static styles = [UIGCElement.styles, unsafeCSS(styles)];

  render() {
    return html`
      <button ?disabled=${this.disabled} class="button-root">
        <slot name="icon"></slot>
        <slot></slot>
        <slot name="endIcon"></slot>
      </button>
    `;
  }
}
