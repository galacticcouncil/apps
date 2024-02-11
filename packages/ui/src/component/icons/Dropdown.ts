import { html, css } from 'lit';
import { customElement } from 'lit/decorators.js';

import { BaseIcon } from './BaseIcon';

@customElement('uigc-icon-dropdown')
export class DropdownIcon extends BaseIcon {
  static styles = [
    BaseIcon.styles,
    css`
      :host([alt]) svg[bsx] path {
        stroke: rgb(120, 126, 130);
      }

      :host([alt]) svg[hdx] path {
        stroke: rgba(114, 131, 165, 0.6);
      }
    `,
  ];

  bsxTemplate() {
    return html`
      <svg
        bsx
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none">
        <path
          d="M7.99414 10.5L11.9994 13.5L16.0046 10.5"
          stroke="#fff"
          stroke-width="2"
          stroke-linecap="square" />
      </svg>
    `;
  }

  hdxTemplate() {
    return html`
      <svg
        hdx
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none">
        <path
          d="M7.99414 10.5L11.9994 13.5L16.0046 10.5"
          stroke="#fff"
          stroke-width="2"
          stroke-linecap="square" />
      </svg>
    `;
  }

  render() {
    return html`
      ${this.bsxTemplate()} ${this.hdxTemplate()}
    `;
  }
}
