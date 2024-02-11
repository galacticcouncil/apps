import { html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { UIGCElement } from './base/UIGCElement';

import './icons/Dropdown';

@customElement('uigc-selector')
export class Selector extends UIGCElement {
  @property({ type: String }) item = null;
  @property({ type: String }) title = null;
  @property({ type: Boolean }) readonly = false;

  static styles = [
    UIGCElement.styles,
    css`
      :host {
        border-radius: 12px;
        width: 100%;
      }

      :host(:not([readonly])) .selector-root {
        border-bottom: var(--uigc-field-border-bottom);
      }

      :host(:not([readonly])) .selector-root:focus,
      :host(:not([readonly])) .selector-root:focus-visible,
      :host(:not([readonly])) .selector-root:focus-within,
      :host(:not([readonly])) .selector-root:hover {
        border-bottom: var(--uigc-selector-border-bottom__hover);
        background: var(--uigc-selector-background__hover);
        transition: 0.2s ease-in-out;
      }

      :host([readonly]) button {
        cursor: default;
      }

      button {
        width: 100%;
        display: flex;
        flex-direction: column;
        box-sizing: border-box;
        cursor: pointer;
        background: var(--uigc-field-background);
        border-radius: var(--uigc-field-border-radius);
        padding: var(--uigc-field-padding);
        row-gap: var(--uigc-field-row-gap);
      }

      button > div {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        width: 100%;
        align-items: center;
      }

      .title {
        display: flex;
        align-items: center;
        font-weight: var(--uigc-selector--title-font-weight);
        font-size: var(--uigc-field--title-font-size);
        line-height: var(--uigc-field--title-line-height);
        color: var(--uigc-selector--title-color);
        text-transform: var(--uigc-field--title-text-transform);
      }
    `,
  ];

  onSelectorClick(e: any) {
    const options = {
      bubbles: true,
      composed: true,
      detail: { item: this.item },
    };
    this.dispatchEvent(new CustomEvent('selector-click', options));
  }

  render() {
    return html`
      <div tabindex="0" class="selector-root">
        <button @click=${this.onSelectorClick}>
          <span class="title">${this.title}</span>
          <div>
            <slot></slot>
            <uigc-icon-dropdown alt></uigc-icon-dropdown>
          </div>
        </button>
      </div>
    `;
  }
}
