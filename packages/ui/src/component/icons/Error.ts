import { html } from 'lit';
import { customElement } from 'lit/decorators.js';

import { BaseIcon } from './BaseIcon';

@customElement('uigc-icon-error')
export class ErrorIcon extends BaseIcon {
  bsxTemplate() {
    return html`
      <svg
        bsx
        xmlns="http://www.w3.org/2000/svg"
        width="30"
        height="29"
        viewBox="0 0 30 29"
        fill="none">
        <circle
          cx="14.9995"
          cy="14.145"
          r="14.0112"
          fill="url(#paint0_linear_13185_9508)"
          fill-opacity="0.4" />
        <path
          d="M10.3633 19.4098L12.5777 17.1954L20.1911 9.65625"
          stroke="url(#paint1_linear_13185_9508)"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round" />
        <path
          d="M10.3633 9.65371L12.5777 11.8681L20.1911 19.4072"
          stroke="url(#paint2_linear_13185_9508)"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round" />
        <defs>
          <linearGradient
            id="paint0_linear_13185_9508"
            x1="14.9995"
            y1="-13.3982"
            x2="14.9995"
            y2="27.1899"
            gradientUnits="userSpaceOnUse">
            <stop offset="0.0560296" stop-color="#FF4F4F" stop-opacity="0" />
            <stop offset="0.35885" stop-color="#FF4F4F" stop-opacity="0.29" />
            <stop offset="0.438769" stop-color="#FF6868" stop-opacity="0.27" />
            <stop offset="1" stop-color="#FF6868" />
          </linearGradient>
          <linearGradient
            id="paint1_linear_13185_9508"
            x1="9.29227"
            y1="5.17989"
            x2="20.6481"
            y2="5.17989"
            gradientUnits="userSpaceOnUse">
            <stop stop-color="#FF8A8A" />
            <stop offset="1" stop-color="#DA5D5D" />
          </linearGradient>
          <linearGradient
            id="paint2_linear_13185_9508"
            x1="9.29227"
            y1="23.8836"
            x2="20.6481"
            y2="23.8836"
            gradientUnits="userSpaceOnUse">
            <stop stop-color="#FF8A8A" />
            <stop offset="1" stop-color="#DA5D5D" />
          </linearGradient>
        </defs>
      </svg>
    `;
  }

  hdxTemplate() {
    return html`
      <svg
        hdx
        xmlns="http://www.w3.org/2000/svg"
        width="28"
        height="29"
        viewBox="0 0 28 29"
        fill="none">
        <rect x="3.99219" y="4.07471" width="4" height="4" fill="#FF4B4B" />
        <rect x="7.99219" y="8.07495" width="4" height="4" fill="#FF4B4B" />
        <rect x="11.9961" y="12.0747" width="4" height="4" fill="#FF4B4B" />
        <rect x="15.9922" y="16.0747" width="4" height="4" fill="#FF4B4B" />
        <rect x="19.9922" y="20.0747" width="4" height="4" fill="#FF4B4B" />
        <rect
          x="23.9922"
          y="4.07471"
          width="4"
          height="4"
          transform="rotate(90 23.9922 4.07471)"
          fill="#FF4B4B" />
        <rect
          x="19.9922"
          y="8.07495"
          width="4"
          height="4"
          transform="rotate(90 19.9922 8.07495)"
          fill="#FF4B4B" />
        <rect
          x="15.9961"
          y="12.0747"
          width="4"
          height="4"
          transform="rotate(90 15.9961 12.0747)"
          fill="#FF4B4B" />
        <rect
          x="11.9961"
          y="16.0747"
          width="4"
          height="4"
          transform="rotate(90 11.9961 16.0747)"
          fill="#FF4B4B" />
        <rect
          x="7.99219"
          y="20.0747"
          width="4"
          height="4"
          transform="rotate(90 7.99219 20.0747)"
          fill="#FF4B4B" />
      </svg>
    `;
  }

  render() {
    return html`
      ${this.bsxTemplate()} ${this.hdxTemplate()}
    `;
  }
}
