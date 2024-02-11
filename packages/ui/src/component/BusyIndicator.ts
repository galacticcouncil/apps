import { html, css } from 'lit';
import { customElement } from 'lit/decorators.js';

import { UIGCElement } from './base/UIGCElement';

@customElement('uigc-busy-indicator')
export class BusyIndicator extends UIGCElement {
  static styles = [
    UIGCElement.styles,
    css`
      :host {
        color: var(--hex-white);
      }

      :host([size='small']) .busy-indicator-root {
        min-width: 1.5rem;
        min-height: 0.5rem;
      }

      :host([size='small']) .busy-indicator-circle {
        width: 0.5rem;
        height: 0.5rem;
      }

      :host(:not([size])) .busy-indicator-root,
      :host([size='medium']) .busy-indicator-root {
        min-width: 3rem;
        min-height: 1rem;
      }

      :host(:not([size])) .busy-indicator-circle,
      :host([size='medium']) .busy-indicator-circle {
        width: 1rem;
        height: 1rem;
      }

      :host([size='large']) .busy-indicator-root {
        min-width: 6rem;
        min-height: 2rem;
      }

      :host([size='large']) .busy-indicator-circle {
        width: 2rem;
        height: 2rem;
      }

      ::slotted(span) {
        color: var(--hex-white);
      }

      .busy-indicator-root {
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;
        background-color: inherit;
      }

      .busy-indicator-busy-area {
        position: absolute;
        z-index: 99;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: inherit;
        flex-direction: column;
      }

      .busy-indicator-circles-wrapper {
        line-height: 0;
      }

      .busy-indicator-circle {
        display: inline-block;
        background-color: currentColor;
        border-radius: var(--uigc-busy-indicator--circle-border-radius);
      }

      .busy-indicator-circle::before {
        content: '';
        width: 100%;
        height: 100%;
        border-radius: 100%;
      }

      .circle-animation-0 {
        animation: grow 1.6s infinite cubic-bezier(0.32, 0.06, 0.85, 1.11);
      }

      .circle-animation-1 {
        animation: grow 1.6s infinite cubic-bezier(0.32, 0.06, 0.85, 1.11);
        animation-delay: 200ms;
      }

      .circle-animation-2 {
        animation: grow 1.6s infinite cubic-bezier(0.32, 0.06, 0.85, 1.11);
        animation-delay: 400ms;
      }

      @keyframes grow {
        0%,
        50%,
        100% {
          -webkit-transform: scale(0.5);
          -moz-transform: scale(0.5);
          transform: scale(0.5);
        }
        25% {
          -webkit-transform: scale(1);
          -moz-transform: scale(1);
          transform: scale(1);
        }
      }
    `,
  ];

  render() {
    return html`
      <div class="busy-indicator-root">
        <div
          class="busy-indicator-busy-area"
          tabindex="0"
          role="progressbar"
          aria-valuemin="0"
          aria-valuemax="100"
          aria-valuetext="Busy"
          title="Please wait">
          <div class="busy-indicator-circles-wrapper">
            <div class="busy-indicator-circle circle-animation-0"></div>
            <div class="busy-indicator-circle circle-animation-1"></div>
            <div class="busy-indicator-circle circle-animation-2"></div>
          </div>
          <slot></slot>
        </div>
      </div>
    `;
  }
}
