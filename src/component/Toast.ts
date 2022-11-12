import { html, css } from 'lit';
import { customElement } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';

import { UIGCElement } from './base/UIGCElement';
import { CloseableElement } from './base/closeableElement';

import './Progress';
import './icons/Close';

@customElement('ui-toast')
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
        border-radius: 14px;
        background: var(--hex-background-gray-1000);
        color: white;
        min-width: 130px;
      }

      .content {
        width: 100%;
      }

      slot[name='alert']::slotted(*) {
        padding: 0;
      }

      ::slotted(*) {
        padding: 0 14px;
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
        border-radius: 50%;
        background: var(--hex-background-gray-800);
      }

      .close icon-close {
        width: 7px;
      }

      .close:hover {
        background: rgba(var(--rgb-background-gray-800), 0.5);
        cursor: pointer;
      }

      ui-progress {
        position: absolute;
        width: 100%;
        bottom: 0;
      }
    `,
  ];

  onClose(e: Event) {
    e.stopPropagation();
    const applyDefault = this.dispatchEvent(
      new CustomEvent('toast-closed', {
        composed: true,
        bubbles: true,
        cancelable: true,
        detail: { id: this.id },
      })
    );
    if (applyDefault) {
      this.close();
    }
  }

  render() {
    return html`
      <div class="root">
        <div class="content" role="alert">
          <slot name="alert"></slot>
          <slot></slot>
        </div>
        ${when(this.timeout, () => html` <ui-progress .duration=${this.timeout}></ui-progress> `)}
      </div>
      <button class="close" @click=${this.onClose}>
        <icon-close></icon-close>
      </button>
    `;
  }
}
