import { html } from 'lit';
import { customElement } from 'lit/decorators.js';

import { UIGCElement } from './base/UIGCElement';

import styles from './IconButton.css';

@customElement('uigc-icon-button')
export class IconButton extends UIGCElement {
  static styles = [UIGCElement.styles, styles];

  render() {
    return html`
      <button class="icon-button-root">
        <slot></slot>
      </button>
    `;
  }
}
