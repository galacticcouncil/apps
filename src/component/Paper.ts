import { html, css } from 'lit';
import { customElement } from 'lit/decorators.js';

import { UIGCElement } from './base/UIGCElement';

@customElement('ui-paper')
export class Paper extends UIGCElement {
  static styles = [
    UIGCElement.styles,
    css`
      :host {
        background: var(--gradient-paper);
        box-shadow: 0 0 0 1px hsl(0deg 0% 100% / 5%);
        border-radius: 20px;
      }

      ::slotted(*) {
        width: 100%;
      }
    `,
  ];

  render() {
    return html` <slot></slot> `;
  }
}
