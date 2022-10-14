import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('ui-circular-progress')
export class CircularProgress extends LitElement {
  @property({ type: Boolean }) progress = false;

  static styles = css`
    :host([size='small']) .progress-indeterminate {
      width: 14px;
      height: 14px;
      margin-top: -7px;
    }

    :host(:not([size])) .progress-indeterminate,
    :host([size='medium']) .progress-indeterminate {
      width: 24px;
      height: 24px;
      margin-top: -12px;
    }

    .progress-indeterminate {
      position: absolute;
      display: inline-block;
      color: var(--hex-primary-300);
      -webkit-animation: animation-rotate 1.4s linear infinite;
      animation: animation-rotate 1.4s linear infinite;
      top: 50%;
      left: 50%;
      margin-left: -12px;
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

    .progress-circle {
      stroke-dasharray: 80px, 200px;
      stroke-dashoffset: 0;
      -webkit-animation: animation-stroke 1.4s ease-in-out infinite;
      animation: animation-stroke 1.4s ease-in-out infinite;
    }

    @keyframes animation-stroke {
      0% {
        stroke-dasharray: 1px, 200px;
        stroke-dashoffset: 0;
      }

      50% {
        stroke-dasharray: 100px, 200px;
        stroke-dashoffset: -15px;
      }

      100% {
        stroke-dasharray: 100px, 200px;
        stroke-dashoffset: -125px;
      }
    }

    .hidden {
      display: none;
    }
  `;

  render() {
    return html`
      <span class=${this.progress ? 'progress-indeterminate' : 'hidden'}>
        <svg viewBox="22 22 44 44">
          <linearGradient id="linearColors" x1="0" y1="0" x2="1" y2="1">
            <stop offset="5%" stop-color="#F8C35D"></stop>
            <stop offset="25%" stop-color="#FCAE33"></stop>
            <stop offset="40%" stop-color="#54EF9F"></stop>
            <stop offset="60%" stop-color="#54EF9F"></stop>
          </linearGradient>
          <circle
            class="progress-circle"
            stroke="url(#linearColors)"
            cx="44"
            cy="44"
            r="20.2"
            fill="none"
            stroke-width="6.6"
          ></circle>
        </svg>
      </span>
    `;
  }
}
