import { html, css } from 'lit';
import { customElement } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';

import { UIGCElement } from './base/UIGCElement';
import { CloseableElement } from './base/CloseableElement';

import './Progress';
import './icons/Close';

@customElement('uigc-toast')
export class Toast extends CloseableElement {
  static styles = [
    UIGCElement.styles,
    css`
      :host {
        position: fixed;
        z-index: 1400;
        bottom: 8px;
        right: 8px;
        left: 8px;
      }

      @media (min-width: 768px) {
        :host {
          bottom: 20px;
          right: 20px;
          left: auto;
        }
      }

      :host(:not([open])) {
        display: none;
      }

      :host .root {
        overflow: hidden;
        position: relative;
        height: 60px;
        display: flex;
        flex-direction: row;
        align-items: center;
        box-sizing: border-box;
        border-radius: var(--uigc-toast-border-radius);
        background: var(--uigc-toast-background);
        color: white;
        min-width: 130px;
      }

      .content {
        width: 100%;
      }

      ::slotted(*) {
        padding: 0 14px;
        height: 60px;
      }

      .close {
        position: absolute;
        display: flex;
        justify-content: center;
        align-items: center;
        top: -8px;
        right: -8px;
        width: 24px;
        height: 24px;
        border-radius: var(--uigc-toast--close-border-radius);
        background: var(--uigc-toast--close-background);
        border: var(--uigc-toast--close-border);
      }

      .close uigc-icon-close {
        width: 7px;
      }

      .close:hover {
        background: var(--uigc-toast--close-background__hover);
        transition: 0.2s ease-in-out;
        cursor: pointer;
      }

      uigc-progress {
        position: absolute;
        width: 100%;
        bottom: 0;
      }
    `,
  ];

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
