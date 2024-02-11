import { html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { UIGCElement } from './base/UIGCElement';

@customElement('uigc-toggle-button')
export class ToggleButton extends UIGCElement {
  @property({ type: String }) value = null;

  static styles = [
    UIGCElement.styles,
    css`
      :host {
        font-family: var(--uigc-app-font-secondary), sans-serif;
      }

      :host([tab]) {
        width: 100%;
        font-family: var(--uigc-app-font-primary), sans-serif;
      }

      :host([tab]) .toggle-button-root {
        width: 100%;
        height: 30px;
      }

      :host([size='small']) .toggle-button-root {
        width: 30px;
        height: 30px;
      }

      :host([size='medium']) .toggle-button-root {
        width: 40px;
        height: 40px;
      }

      :host(:not([size]):not([tab])) .toggle-button-root,
      :host([size='large']) .toggle-button-root {
        width: 54px;
        height: 54px;
      }

      .toggle-button-root {
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: var(--uigc-toggle-button--root-border-radius);
        transition: all 0.15s ease-in-out;
        background: var(--uigc-toggle-button--root-background);
        color: var(--hex-white);
        font-weight: 700;
        cursor: pointer;
      }

      :host([tab]) .toggle-button-root {
        background: transparent;
      }

      :host([tab]) .toggle-button-root:hover {
        background: var(--uigc-toggle-button--root-background__hover);
      }

      .toggle-button-root:hover {
        background: var(--uigc-toggle-button--root-background__hover);
        transition: 0.2s ease-in-out;
      }

      :host([aria-pressed='true']) .toggle-button-root {
        background: var(--uigc-toggle-button__selected--root-background);
        color: var(--uigc-toggle-button__selected--root-color);
      }

      :host([aria-pressed='true'][tab]) .toggle-button-root {
        background: var(--uigc-toggle-button__selected--tab-background);
        color: var(--uigc-toggle-button__selected--tab-color);
        border-radius: 66px;
      }
    `,
  ];

  onClick(e: CustomEvent) {
    const options = {
      bubbles: true,
      composed: true,
      detail: { value: this.value },
    };
    this.dispatchEvent(new CustomEvent('toggle-button-click', options));
  }

  render() {
    return html`
      <button
        class="toggle-button-root"
        @click=${this.onClick}
        value=${this.value}>
        <slot></slot>
      </button>
    `;
  }
}
