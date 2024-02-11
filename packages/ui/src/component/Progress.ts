import { html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { UIGCElement } from './base/UIGCElement';

@customElement('uigc-progress')
export class Progress extends UIGCElement {
  @property({ type: Number }) duration = null;

  static styles = [
    UIGCElement.styles,
    css`
      :host {
        overflow: hidden;
      }

      :host([variant='success']) .progress-root {
        background: linear-gradient(
          to bottom,
          var(--uigc-progress__success-background),
          var(--uigc-progress__success-background)
        );
      }

      :host([variant='error']) .progress-root {
        background: linear-gradient(
          to bottom,
          var(--uigc-progress__error-background),
          var(--uigc-progress__error-background)
        );
      }

      :host([variant='progress']) .progress-root {
        background: linear-gradient(
          to bottom,
          var(--uigc-progress-background),
          var(--uigc-progress-background)
        );
      }

      :host .progress-root {
        height: 3px;
        animation: roundtime calc(var(--duration) * 1s) linear forwards;
        transform-origin: left center;
        background: linear-gradient(
          to bottom,
          var(--uigc-progress-background),
          var(--uigc-progress-background)
        );
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
      progress.setAttribute(
        'style',
        '--duration: ' + this.duration / 1000 + ';',
      );
    }
  }

  render() {
    return html`
      <div class="progress-root"></div>
    `;
  }
}
