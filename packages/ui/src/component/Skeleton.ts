import { html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { UIGCElement } from './base/UIGCElement';

@customElement('uigc-skeleton')
export class Skeleton extends UIGCElement {
  @property({ type: String }) width = null;
  @property({ type: String }) height = null;

  static styles = [
    UIGCElement.styles,
    css`
      :host([circle]) span {
        width: 40px;
        height: 40px;
        border-radius: 50%;
      }

      :host([rectangle]) span {
        border-radius: var(--uigc-skeleton-border-radius);
      }

      :host([progress]) span {
        line-height: 1;
        z-index: 1;
      }

      :host([progress]) span::after {
        content: ' ';
        display: block;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 100%;
        background-repeat: no-repeat;
        background-image: linear-gradient(
          90deg,
          rgba(var(--rgb-white), 0.12),
          rgba(var(--rgb-white), 0.24),
          rgba(var(--rgb-white), 0.12)
        );
        transform: translateX(-100%);
        animation: progress 1.5s ease-in-out infinite;
        animation-delay: 0.5s;
      }

      :host([pulse]) span {
        animation: pulse 1.5s ease-in-out infinite;
        animation-delay: 0.5s;
      }

      span {
        box-sizing: border-box;
        background-color: rgba(var(--rgb-white), 0.12);
        outline: none;
        overflow: hidden;
        position: relative;
        border-radius: 100px;
        width: 100%;
        height: 20px;
        display: block;
        will-change: transform;
      }

      @keyframes progress {
        100% {
          transform: translateX(100%);
        }
      }

      @keyframes pulse {
        0% {
          opacity: 1;
        }
        50% {
          opacity: 0.4;
        }
        100% {
          opacity: 1;
        }
      }
    `,
  ];

  override async firstUpdated() {
    const span = this.shadowRoot.querySelector('span');
    span.style.width = this.width;
    span.style.height = this.height;
  }

  render() {
    return html`
      <span></span>
    `;
  }
}
