import { html, css } from 'lit';
import { customElement } from 'lit/decorators.js';

import { UIGCElement } from './base/UIGCElement';

@customElement('uigc-typography')
export class Typography extends UIGCElement {
  static styles = [
    UIGCElement.styles,
    css`
      :host([variant='title']) {
        font-family: var(--uigc-app-font-secondary);
        font-weight: var(--uigc-typography__title-font-weight);
        font-size: var(--uigc-typography__title-font-size);
        background: var(--uigc-typography__title-background);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }

      :host([variant='title'][error]) {
        background: var(--uigc-typography__title-error-background);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }

      :host([variant='title'][gradient]) {
        background: var(--uigc-typography__title-gradient-background);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }

      :host([variant='section']) {
        font-family: var(--uigc-app-font-secondary);
        font-weight: var(--uigc-typography__section-font-weight);
        font-size: var(--uigc-typography__section-font-size);
        line-height: var(--uigc-typography__section-line-height);
        color: var(--uigc-typography__section-color);
      }

      :host([variant='subsection']) {
        font-weight: var(--uigc-typography__subsection-font-weight);
        font-size: var(--uigc-typography__subsection-font-size);
        line-height: var(--uigc-typography__subsection-line-height);
        color: var(--uigc-typography__subsection-color);
      }
    `,
  ];

  render() {
    return html`
      <slot></slot>
    `;
  }
}
