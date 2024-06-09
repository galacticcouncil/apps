import { html } from 'lit';
import { customElement } from 'lit/decorators.js';

import { UIGCElement } from './base/UIGCElement';

import styles from './Backdrop.css';

@customElement('uigc-backdrop')
export class Backdrop extends UIGCElement {
  static styles = [UIGCElement.styles, styles];

  render() {
    return html`
      <div class="backdrop-root">
        <slot></slot>
      </div>
    `;
  }
}
