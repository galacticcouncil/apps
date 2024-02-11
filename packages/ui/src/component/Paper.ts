import { html, css } from 'lit';
import { customElement } from 'lit/decorators.js';

import { UIGCElement } from './base/UIGCElement';

@customElement('uigc-paper')
export class Paper extends UIGCElement {
  static styles = [
    UIGCElement.styles,
    css`
      :host {
        background: var(--uigc-paper-background);
        box-shadow: var(--uigc-paper-box-shadow);
        position: relative;
        overflow: hidden;
        padding: var(--uigc-paper-padding);
      }

      @media (min-width: 480px) {
        :host {
          border-radius: var(--uigc-app-border-radius);
        }

        :host:before {
          content: var(--uigc-paper-content);
          border-radius: var(--uigc-app-border-radius);
          position: absolute;
          inset: 0px;
          padding: 1px;
          background: linear-gradient(
            rgba(102, 151, 227, 0.35) 0%,
            rgba(68, 109, 174, 0.3) 66.67%,
            rgba(91, 151, 245, 0) 99.99%,
            rgba(158, 167, 180, 0) 100%
          );
          mask: var(--uigc-paper-mask);
          mask-composite: xor;
          -webkit-mask: var(--uigc-paper-mask);
          -webkit-mask-composite: xor;
          pointer-events: none;
        }
      }

      ::slotted(*) {
        width: 100%;
      }
    `,
  ];

  render() {
    return html`
      <slot></slot>
    `;
  }
}
