import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('ui-circular-progress')
export class CircularProgress extends LitElement {
  @property({ type: Boolean }) progress = false;

  static styles = css`
    .progress-indeterminate {
      position: absolute;
      display: inline-block;
      color: var(--color-secondary);
      -webkit-animation: animation-rotate 1.4s linear infinite;
      animation: animation-rotate 1.4s linear infinite;
      top: 50%;
      left: 50%;
      margin-top: -12px;
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
      stroke: var(--color-secondary);
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
      <span class=${this.progress ? 'progress-indeterminate' : 'hidden'} style="width: 24px; height: 24px;">
        <svg viewBox="22 22 44 44">
          <circle class="progress-circle" cx="44" cy="44" r="20.2" fill="none" stroke-width="3.6"></circle>
        </svg>
      </span>
    `;
  }
}
