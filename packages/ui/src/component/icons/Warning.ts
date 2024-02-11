import { css, html } from 'lit';
import { customElement } from 'lit/decorators.js';

import { BaseIcon } from './BaseIcon';

@customElement('uigc-icon-warning')
export class WarningIcon extends BaseIcon {
  static styles = [
    css`
      :host {
        --stop-first-color: #ffd53e;
        --stop-first-offset: 0;
        --stop-second-color: #ffec8a;
      }

      :host([red]) {
        --stop-first-color: #ff424d;
        --stop-first-offset: 0.503788;
        --stop-second-color: #ff5555;
      }
    `,
  ];

  render() {
    return html`
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M12 2.875L22.5366 21.125H1.46338L12 2.875ZM11.0101 15.8919H12.9932V17.8751H11.0101V15.8919ZM12.9932 9.875H11.0101V14.5024H12.9932V9.875Z"
          fill="url(#paint0_linear_3_2)"></path>
        <defs>
          <linearGradient
            id="paint0_linear_3_2"
            x1="12"
            y1="3.77624"
            x2="12"
            y2="21.125"
            gradientUnits="userSpaceOnUse">
            <stop
              offset="var(--stop-first-offset)"
              stop-color="var(--stop-first-color)"></stop>
            <stop
              offset="1"
              stop-color="var(--stop-second-color)"
              stop-opacity="0.27"></stop>
          </linearGradient>
        </defs>
      </svg>
    `;
  }
}
