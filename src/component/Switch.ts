import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { baseStyles } from './styles/base.css';
import { themeStyles } from './styles/theme.css';
import { fontStyles } from './styles/font.css';

@customElement('ui-switch')
export class Switch extends LitElement {
  @property({ type: String }) value = null;

  static styles = [
    baseStyles,
    themeStyles,
    fontStyles,
    css`
      :host([size='small']) .switch-root {
        width: 46px;
        height: 24px;
      }

      :host([size='small']) .switch-thumb {
        width: 20px;
        height: 20px;
        border-width: 1px;
      }

      :host(:not([size])) .switch-root,
      :host([size='medium']) .switch-root {
        width: 70px;
        height: 38px;
      }

      :host(:not([size])) .switch-thumb,
      :host([size='medium']) .switch-thumb {
        width: 34px;
        height: 34px;
        border-width: 1px;
      }

      .switch-root {
        position: relative;
        border-radius: 45px;
        border: 1px solid var(--hex-background-gray-700);
        background: var(--hex-dark-gray);
        cursor: pointer;
      }

      .switch-root:hover > span.switch-thumb {
        border-color: var(--hex-primary-300);
      }

      .switch-thumb {
        position: absolute;
        border-radius: 50%;
        top: 1px;
        left: 1px;
        border-color: var(--hex-dark-gray);
        background: var(--hex-neutral-gray-400);
        border-style: solid;
      }

      :host([checked]) .switch-root {
        background: var(--hex-dark-green);
        border: 1px solid var(--hex-primary-300);
      }

      :host([checked]) .switch-thumb {
        left: initial;
        right: 1px;
        background: var(--hex-primary-500);
        border-color: var(--hex-dark-green);
      }

      :host([disabled]) .switch-root {
        pointer-events: none;
      }

      :host([disabled]) .switch-thumb {
        background: var(--hex-background-gray-800);
      }
    `,
  ];

  render() {
    return html`
      <div class="switch-root">
        <span class="switch-thumb"></span>
      </div>
    `;
  }
}
