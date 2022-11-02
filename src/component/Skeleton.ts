import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { baseStyles } from './styles/base.css';
import { themeStyles } from './styles/theme.css';
import { fontStyles } from './styles/font.css';

@customElement('ui-skeleton')
export class Skeleton extends LitElement {
  @property({ type: String }) width = null;
  @property({ type: String }) height = null;

  static styles = [
    baseStyles,
    themeStyles,
    fontStyles,
    css`
      :host([circle]) span {
        width: 40px;
        height: 40px;
        border-radius: 50%;
      }

      :host([rectangle]) span {
        border-radius: 0;
      }

      :host([progress]) span {
        animation: progress 2s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        background-size: 200px 100%;
        background-image: linear-gradient(to right, #50535a 0%, #656871 20%, #50535a 40%, #50535a 100%);
      }

      :host([pulse]) span {
        animation: pulse 1.5s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        animation-delay: 0.5s;
      }

      span {
        box-sizing: border-box;
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
        0% {
          background-position: -200px 0;
        }
        100% {
          background-position: calc(200px + 100%) 0;
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
    return html` <span> </span> `;
  }
}
