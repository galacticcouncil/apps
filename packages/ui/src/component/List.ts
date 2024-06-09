import { html } from 'lit';
import { customElement } from 'lit/decorators.js';

import { UIGCElement } from './base/UIGCElement';

import styles from './List.css';

@customElement('uigc-list')
export class List extends UIGCElement {
  static styles = [UIGCElement.styles, styles];

  render() {
    return html`
      <div class="list-root">
        <div class="list-header">
          <slot name="header"></slot>
        </div>
        <slot name="selected"></slot>
        <slot></slot>
        <slot name="disabled"></slot>
      </div>
    `;
  }
}
