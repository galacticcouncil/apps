import { html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { UIGCElement } from './base/UIGCElement';

@customElement('ui-progress')
export class Progress extends UIGCElement {
  @property({ type: Number }) duration = null;

  static styles = [
    UIGCElement.styles,
    css`
      :host {
        overflow: hidden;
      }

      :host .progress-root {
        height: 3px;
        animation: roundtime calc(var(--duration) * 1s) linear forwards;
        transform-origin: left center;
        background: linear-gradient(to bottom, var(--hex-primary-500), var(--hex-primary-500));
      }

      @keyframes roundtime {
        to {
          transform: scaleX(0);
        }
      }
    `,
  ];

  override async firstUpdated() {
    const progress = this.shadowRoot.querySelector('.progress-root');
    if (this.duration) {
      progress.setAttribute('style', '--duration: ' + this.duration / 1000 + ';');
    }
  }

  render() {
    return html` <div class="progress-root"></div> `;
  }
}
