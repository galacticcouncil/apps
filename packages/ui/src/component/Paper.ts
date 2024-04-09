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
        :host:before {
          content: var(--uigc-paper-content);
          border-radius: var(--uigc-app-border-radius);
          position: absolute;
          inset: 0px;

          padding: 1px;

          background: linear-gradient(
            180deg,
            rgba(152, 176, 214, 0.27) 0%,
            rgba(163, 177, 199, 0.15) 66.67%,
            rgba(158, 167, 180, 0.2) 100%
          );

          -webkit-mask: var(--uigc-paper-mask);
          -webkit-mask-composite: xor;
          mask: var(--uigc-paper-mask);
          mask-composite: exclude;
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
