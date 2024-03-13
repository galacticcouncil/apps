import { html, css, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { baseStyles } from 'styles/base.css';

@customElement('uigc-range-button')
export class RangeButton extends LitElement {
  @property({ type: String }) value = null;

  static styles = [
    baseStyles,
    css`
      :host {
        font-family: var(--uigc-app-font-primary), sans-serif;
      }

      .toggle-button-root {
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: var(--uigc-toggle-button--root-border-radius);
        transition: all 0.15s ease-in-out;
        background: transparent;
        color: var(--hex-white);
        font-weight: 700;
        text-transform: uppercase;
        cursor: pointer;
      }

      .toggle-button-root:hover {
        background: rgba(84, 99, 128, 0.35);
        transition: 0.2s ease-in-out;
      }

      :host([selected]) .toggle-button-root {
        background: var(--uigc-chart-toggle__selected);
        color: var(--uigc-chart-color);
      }
    `,
  ];

  onClick(e: CustomEvent) {
    const options = {
      bubbles: true,
      composed: true,
      detail: { value: this.value },
    };
    this.dispatchEvent(new CustomEvent('range-button-clicked', options));
  }

  render() {
    return html`
      <button class="toggle-button-root" @click=${this.onClick}>
        <slot></slot>
      </button>
    `;
  }
}
