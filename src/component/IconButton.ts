import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';

import { themeStyles } from './styles/theme.css';
import { baseStyles } from './styles/base.css';

@customElement('ui-icon-button')
export class IconButton extends LitElement {
  static styles = [
    baseStyles,
    themeStyles,
    css`
      :host([size='small']) .icon-button-root {
        width: 24px;
        height: 24px;
      }

      :host(:not([size])) .icon-button-root,
      :host([size='medium']) .icon-button-root {
        width: 40px;
        height: 40px;
      }

      :host([size='large']) .icon-button-root {
        width: 50px;
        height: 50px;
      }

      .icon-button-root {
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 50%;
        background: rgba(var(--rgb-white), 0.06);
        transition: all 0.3s ease-in-out 0s;
      }

      .icon-button-root:hover {
        background: rgba(var(--rgb-white), 0.2);
        cursor: pointer;
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
