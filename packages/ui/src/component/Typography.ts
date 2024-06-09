import { html } from 'lit';
import { customElement } from 'lit/decorators.js';

import { UIGCElement } from './base/UIGCElement';

import styles from './Typography.css';

@customElement('uigc-typography')
export class Typography extends UIGCElement {
  static styles = [UIGCElement.styles, styles];

  render() {
    return html`
      <slot></slot>
    `;
  }
}
