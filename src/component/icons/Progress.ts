import { html, css, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('icon-progress')
export class ProgressIcon extends LitElement {
  static styles = [
    css`
      :host {
        display: flex;
      }

      .progress {
        display: inline-block;
        color: var(--hex-primary-300);
        -webkit-animation: animation-rotate 1.4s linear infinite;
        animation: animation-rotate 1.4s linear infinite;
      }

      @keyframes animation-rotate {
        0% {
          -webkit-transform: rotate(0deg);
          -moz-transform: rotate(0deg);
          -ms-transform: rotate(0deg);
          transform: rotate(0deg);
        }
        100% {
          -webkit-transform: rotate(360deg);
          -moz-transform: rotate(360deg);
          -ms-transform: rotate(360deg);
          transform: rotate(360deg);
        }
      }
    `,
  ];

  render() {
    return html`
      <svg class="progress" xmlns="http://www.w3.org/2000/svg" width="29" height="29" viewBox="0 0 29 29" fill="none">
        <path
          d="M20.6052 23.6752C18.9116 24.771 16.9584 25.3994 14.9436 25.4967C12.9288 25.594 10.9242 25.1567 9.13292 24.2292C7.34169 23.3016 5.82763 21.9169 4.74431 20.2153C3.661 18.5138 3.04697 16.556 2.96452 14.5405C2.88206 12.5251 3.3341 10.5237 4.2748 8.73932C5.21549 6.95496 6.61137 5.45113 8.32084 4.38037C10.0303 3.30961 11.9926 2.71001 14.0086 2.64239C16.0246 2.57477 18.0226 3.04153 19.8 3.99533"
          stroke="url(#paint0_angular_13228_4479)"
          stroke-width="3.6551"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <defs>
          <radialGradient
            id="paint0_angular_13228_4479"
            cx="0"
            cy="0"
            r="1"
            gradientUnits="userSpaceOnUse"
            gradientTransform="translate(13.4389 12.5377) rotate(99.0718) scale(13.1411)"
          >
            <stop offset="0.105163" stop-color="#F8C35D" />
            <stop offset="0.150751" stop-color="#FCAE33" />
            <stop offset="0.41257" stop-color="#54EF9F" />
            <stop offset="0.622807" stop-color="#54EF9F" />
            <stop offset="0.835374" stop-color="#686876" stop-opacity="0" />
            <stop offset="0.909407" stop-color="#FFB571" stop-opacity="0" />
          </radialGradient>
        </defs>
      </svg>
    `;
  }
}
