import { html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';

import { UIGCElement } from './base/UIGCElement';
import { CloseableElement } from './base/CloseableElement';

import './Backdrop';

import styles from './Dialog.css';

@customElement('uigc-dialog')
export class Dialog extends CloseableElement {
  static styles = [UIGCElement.styles, styles];

  render() {
    return html`
      <div class="dialog-root">
        <slot></slot>
        ${when(
          this.timeout,
          () => html`
            <uigc-dialog-countdown
              .timeout=${this.timeout}></uigc-dialog-countdown>
            <uigc-progress .duration=${this.timeout}></uigc-progress>
          `,
        )}
      </div>
      <uigc-backdrop active></uigc-backdrop>
    `;
  }
}
