import { html } from 'lit';
import { customElement } from 'lit/decorators.js';

import { BaseIcon } from './BaseIcon';

@customElement('uigc-icon-chart')
export class ChartIcon extends BaseIcon {
  bsxTemplate() {
    return html`
      <svg
        bsx
        xmlns="http://www.w3.org/2000/svg"
        width="15"
        height="16"
        viewBox="0 0 15 16"
        fill="none">
        <script xmlns="" />
        <script xmlns="" />
        <rect x="6" width="3" height="16" rx="1.5" fill="#b3ff8f" />
        <rect
          y="8"
          width="3"
          height="8"
          rx="1.5"
          fill="rgba(0, 138, 105, 0.7)" />
        <rect
          x="12"
          y="4"
          width="3"
          height="12"
          rx="1.5"
          fill="rgb(0, 138, 105)" />
      </svg>
    `;
  }

  hdxTemplate() {
    return html`
      <svg
        hdx
        xmlns="http://www.w3.org/2000/svg"
        width="15"
        height="16"
        viewBox="0 0 15 16"
        fill="none">
        <script xmlns="" />
        <script xmlns="" />
        <rect x="6" width="3" height="16" rx="1.5" fill="#FC408C" />
        <rect y="8" width="3" height="8" rx="1.5" fill="#EFB0FF" />
        <rect x="12" y="4" width="3" height="12" rx="1.5" fill="#EFB0FF" />
      </svg>
    `;
  }

  render() {
    return html`
      ${this.bsxTemplate()} ${this.hdxTemplate()}
    `;
  }
}
