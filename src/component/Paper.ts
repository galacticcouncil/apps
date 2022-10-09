import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';

import { themeStyles } from './styles/theme.css';
import { baseStyles } from './styles/base.css';

@customElement('ui-paper')
export class Paper extends LitElement {
  static styles = [
    baseStyles,
    themeStyles,
    css`
      :host {
        background: var(--gradient-paper);
        box-shadow: 0 0 0 1px hsl(0deg 0% 100% / 5%);
        border-radius: 20px;
      }

      ::slotted(*) {
        width: 100%;
      }
    `,
  ];

  render() {
    return html` <slot></slot> `;
  }
}
