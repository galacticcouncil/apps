import { html } from 'lit';
import { customElement } from 'lit/decorators.js';

import { BaseIcon } from './BaseIcon';

import styles from './Arrow.css';

@customElement('uigc-icon-arrow')
export class ArrowIcon extends BaseIcon {
  static styles = [BaseIcon.styles, styles];

  bsxTemplate() {
    return html`
      <svg
        bsx
        width="43"
        height="43"
        viewBox="0 0 43 43"
        fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <path
          d="M21.4851 14.4797L21.4849 28.1054M21.4849 28.1054L16.2259 22.8464M21.4849 28.1054L26.7286 22.8617"
          stroke="#8AFFCB"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"></path>
      </svg>
    `;
  }

  hdxTemplate() {
    return html`
      <svg
        hdx
        xmlns="http://www.w3.org/2000/svg"
        width="43"
        height="43"
        viewBox="0 0 43 43"
        fill="none">
        <rect
          x="14.125"
          y="23.0273"
          width="2.94973"
          height="2.94973"
          fill="#57B3EB" />
        <rect
          x="17.0781"
          y="25.9769"
          width="2.94973"
          height="2.94973"
          fill="#57B3EB" />
        <rect
          x="20.0234"
          y="28.9268"
          width="2.94973"
          height="2.94973"
          fill="#57B3EB" />
        <rect
          x="28.875"
          y="23.0273"
          width="2.94973"
          height="2.94973"
          transform="rotate(90 28.875 23.0273)"
          fill="#57B3EB" />
        <rect
          x="25.9219"
          y="25.9769"
          width="2.94973"
          height="2.94973"
          transform="rotate(90 25.9219 25.9769)"
          fill="#57B3EB" />
        <rect
          x="22.9766"
          y="28.9268"
          width="2.94973"
          height="2.94973"
          transform="rotate(90 22.9766 28.9268)"
          fill="#57B3EB" />
        <rect
          x="22.9766"
          y="23.1234"
          width="2.94973"
          height="2.94973"
          transform="rotate(90 22.9766 23.1234)"
          fill="#57B3EB" />
        <rect
          x="22.9766"
          y="19.1235"
          width="2.94973"
          height="2.94973"
          transform="rotate(90 22.9766 19.1235)"
          fill="#57B3EB" />
        <rect
          x="22.9766"
          y="15.1235"
          width="2.94973"
          height="2.94973"
          transform="rotate(90 22.9766 15.1235)"
          fill="#57B3EB" />
        <rect
          x="22.9766"
          y="11.1235"
          width="2.94973"
          height="2.94973"
          transform="rotate(90 22.9766 11.1235)"
          fill="#57B3EB" />
        <rect
          x="22.9766"
          y="26.0734"
          width="2.94973"
          height="2.94973"
          transform="rotate(90 22.9766 26.0734)"
          fill="#57B3EB" />
      </svg>
    `;
  }

  render() {
    return html`
      ${this.bsxTemplate()} ${this.hdxTemplate()}
    `;
  }
}
