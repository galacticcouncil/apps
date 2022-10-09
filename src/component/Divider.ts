import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';

import { themeStyles } from './styles/theme.css';
import { baseStyles } from './styles/base.css';

@customElement('ui-divider')
export class Divider extends LitElement {
  static styles = [
    baseStyles,
    themeStyles,
    css`
      .divider-root {
        background: rgba(var(--rgb-primary-450), 0.12);
        height: 1px;
        width: 100%;
      }
    `,
  ];

  render() {
    return html` <div class="divider-root"></div> `;
  }
}
