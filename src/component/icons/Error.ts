import { html } from 'lit';
import { customElement } from 'lit/decorators.js';

import { BaseIcon } from './BaseIcon';

@customElement('icon-error')
export class ErrorIcon extends BaseIcon {
  render() {
    return html`
      <svg xmlns="http://www.w3.org/2000/svg" width="30" height="29" viewBox="0 0 30 29" fill="none">
        <circle cx="14.9995" cy="14.145" r="14.0112" fill="url(#paint0_linear_13185_9508)" fill-opacity="0.4" />
        <path
          d="M10.3633 19.4098L12.5777 17.1954L20.1911 9.65625"
          stroke="url(#paint1_linear_13185_9508)"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M10.3633 9.65371L12.5777 11.8681L20.1911 19.4072"
          stroke="url(#paint2_linear_13185_9508)"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <defs>
          <linearGradient
            id="paint0_linear_13185_9508"
            x1="14.9995"
            y1="-13.3982"
            x2="14.9995"
            y2="27.1899"
            gradientUnits="userSpaceOnUse"
          >
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
            gradientUnits="userSpaceOnUse"
          >
            <stop stop-color="#FF8A8A" />
            <stop offset="1" stop-color="#DA5D5D" />
          </linearGradient>
          <linearGradient
            id="paint2_linear_13185_9508"
            x1="9.29227"
            y1="23.8836"
            x2="20.6481"
            y2="23.8836"
            gradientUnits="userSpaceOnUse"
          >
            <stop stop-color="#FF8A8A" />
            <stop offset="1" stop-color="#DA5D5D" />
          </linearGradient>
        </defs>
      </svg>
    `;
  }
}
