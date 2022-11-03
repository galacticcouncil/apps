import { html, css } from 'lit';
import { customElement } from 'lit/decorators.js';

import { UIGCElement } from './base/UIGCElement';

@customElement('ui-button')
export class Button extends UIGCElement {
  static styles = [
    UIGCElement.styles,
    css`
      :host([size='small']) .button-root {
        padding: 12px 15px;
        font-size: 12px;
      }

      :host(:not([size])) .button-root,
      :host([size='medium']) .button-root {
        padding: 16px 36px;
        font-size: 14px;
      }

      :host([size='micro']) .button-root {
        padding: 2px 10px;
        font-size: 12px;
        line-height: 16px;
      }

      :host([fullwidth]) .button-root {
        width: 100%;
      }

      :host([disabled]) {
        opacity: 0.2;
        pointer-events: none;
      }

      :host([variant='primary']) .button-root {
        color: var(--hex-background-gray-800);
        background: var(--hex-primary-400);
      }

      :host([variant='primary']) .button-root:hover {
        background: var(--hex-primary-300);
        transition: 0.2s ease-in-out;
      }

      :host([variant='secondary']) .button-root {
        background: rgba(var(--rgb-primary-450), 0.12);
        color: var(--hex-primary-400);
      }

      :host([variant='secondary']) .button-root:hover {
        background: var(--hex-primary-300);
        background: rgba(var(--rgb-primary-450), 0.3);
      }

      :host([variant='transparent']) .button-root {
        color: var(--hex-white);
        background: transparent;
      }

      :host([variant='transparent']) .button-root:hover {
        background: var(--hex-background-gray-700);
        transition: 0.2s ease-in-out;
      }

      :host([variant='max']) .button-root {
        color: #fff;
        background: rgba(var(--rgb-white), 0.06);
        font-weight: 600;
        text-transform: none;
      }

      :host([variant='max']) .button-root:hover {
        background: rgba(var(--rgb-white), 0.15);
      }

      .button-root {
        border-radius: 35px;
        font-weight: 700;
        font-size: 16px;
        border: none;
        cursor: pointer;
        text-transform: uppercase;
        line-height: 18px;
      }
    `,
  ];

  render() {
    return html`
      <button type="button" class="button-root">
        <slot name="icon"></slot>
        <slot></slot>
      </button>
    `;
  }
}
