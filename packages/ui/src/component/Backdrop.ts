import { html, css } from 'lit';
import { customElement } from 'lit/decorators.js';

import { UIGCElement } from './base/UIGCElement';

@customElement('uigc-backdrop')
export class Backdrop extends UIGCElement {
  static styles = [
    UIGCElement.styles,
    css`
      .backdrop-root {
        position: fixed;
        top: -100px;
        right: 0;
        bottom: 0;
        left: 0;
        background: var(--uigc-backdrop-background);
        z-index: 1201;
        opacity: 0;
        visibility: hidden;
        -webkit-transition: opacity 1s, visibility 1s;
        transition: opacity 1s, visibility 1s;
        backdrop-filter: blur(7px);
      }

      :host([active]) .backdrop-root {
        opacity: 1;
        visibility: visible;
      }
    `,
  ];

  render() {
    return html`
      <div class="backdrop-root">
        <slot></slot>
      </div>
    `;
  }
}
