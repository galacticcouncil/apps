import { html, css } from 'lit';
import { customElement } from 'lit/decorators.js';

import { UIGCElement } from './base/UIGCElement';

@customElement('uigc-icon-button')
export class IconButton extends UIGCElement {
  static styles = [
    UIGCElement.styles,
    css`
      :host([size='small']) .icon-button-root {
        width: 24px;
        height: 24px;
      }

      :host(:not([size])) .icon-button-root,
      :host([size='medium']) .icon-button-root {
        width: 34px;
        height: 34px;
      }

      :host([size='large']) .icon-button-root {
        width: 44px;
        height: 44px;
      }

      :host([basic]) .icon-button-root {
        border: none;
      }

      .icon-button-root {
        display: flex;
        justify-content: center;
        align-items: center;
        border: var(--uigc-icon-button-border);
        border-radius: var(--uigc-icon-button-border-radius);
        background: var(--uigc-icon-button-background);
      }

      .icon-button-root:hover {
        background: var(--uigc-icon-button-background__hover);
        border: var(--uigc-icon-button-border__hover);
        cursor: pointer;
        transition: 0.2s ease-in-out;
      }
    `,
  ];

  render() {
    return html`
      <button class="icon-button-root">
        <slot></slot>
      </button>
    `;
  }
}
