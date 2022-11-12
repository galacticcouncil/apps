import { html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { UIGCElement } from './base/UIGCElement';

@customElement('ui-circular-progress')
export class CircularProgress extends UIGCElement {
  @property({ type: String }) width = null;
  @property({ type: String }) height = null;

  static styles = css`
    :host {
      --spinner-width: 3px;
    }

    :host([size='small']) .progress-root {
      width: 14px;
      height: 14px;
    }

    :host(:not([size])) .progress-root,
    :host([size='medium']) .progress-root {
      width: 24px;
      height: 24px;
    }

    .progress-root {
      display: block;
      position: relative;
      border-radius: 9999px;
      -webkit-mask: radial-gradient(
        farthest-side,
        rgba(255, 255, 255, 0) calc(100% - var(--spinner-width)),
        rgba(255, 255, 255, 1) calc(100% - var(--spinner-width) + 1px)
      );
      mask: radial-gradient(
        farthest-side,
        rgba(255, 255, 255, 0) calc(100% - var(--spinner-width)),
        rgba(255, 255, 255, 1) calc(100% - var(--spinner-width) + 1px)
      );
      -webkit-animation: 0.6s linear 0s infinite normal none running animation-rotate;
      animation: 0.6s linear 0s infinite normal none running animation-rotate;
      overflow: hidden;
      background: conic-gradient(
        from 0deg,
        rgb(82, 239, 158) 0deg,
        rgb(82, 239, 158) 45deg,
        rgb(252, 174, 49) 140deg,
        rgb(247, 196, 94) 160deg,
        rgba(105, 105, 119, 0) 220deg,
        rgba(255, 181, 112, 0)
      );
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
  `;

  override async firstUpdated() {
    const progress = this.shadowRoot.querySelector('.progress-root');
    if (this.width && this.height) {
      progress.setAttribute('style', 'width:' + this.width + ';' + 'height:' + this.height);
    }
  }

  render() {
    return html` <span class="progress-root"></span> `;
  }
}
