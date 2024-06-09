import { html } from 'lit';
import { customElement } from 'lit/decorators.js';

import { UIGCElement } from './base/UIGCElement';

import styles from './Paper.css';

@customElement('uigc-paper')
export class Paper extends UIGCElement {
  static styles = [UIGCElement.styles, styles];

  render() {
    return html`
      <slot></slot>
    `;
  }
}
