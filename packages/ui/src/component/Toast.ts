import { html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';

import { UIGCElement } from './base/UIGCElement';
import { CloseableElement } from './base/CloseableElement';

import './Progress';
import './icons/Close';

import styles from './Toast.css';

@customElement('uigc-toast')
export class Toast extends CloseableElement {
  static styles = [UIGCElement.styles, styles];

  onClose(e: Event) {
    e.stopPropagation();
    const applyDefault = this.dispatchEvent(
      new CustomEvent('toast-close', {
        composed: true,
        bubbles: true,
        cancelable: true,
        detail: { id: this.id },
      }),
    );
    if (applyDefault) {
      this.close();
    }
  }

  override async firstUpdated() {
    const slot = this.shadowRoot.querySelector('slot');
    const slt = slot.assignedElements();
    slt.forEach((item) => {
      const variant = item.getAttribute('variant');
      const prog = this.shadowRoot.querySelector('uigc-progress');
      if (prog) {
        prog.setAttribute('variant', variant);
      }
    });
  }

  render() {
    return html`
      <div class="root">
        <div class="content" role="alert">
          <slot></slot>
        </div>
        ${when(
          this.timeout,
          () =>
            html`
              <uigc-progress .duration=${this.timeout}></uigc-progress>
            `,
        )}
      </div>
      <button class="close" @click=${this.onClose}>
        <uigc-icon-close></uigc-icon-close>
      </button>
    `;
  }
}
