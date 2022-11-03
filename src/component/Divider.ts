import { html, css } from 'lit';
import { customElement } from 'lit/decorators.js';

import { UIGCElement } from './base/UIGCElement';

@customElement('ui-divider')
export class Divider extends UIGCElement {
  static styles = [
    UIGCElement.styles,
    css`
      .divider-root {
        background: rgba(var(--rgb-primary-450), 0.12);
        height: 1px;
        width: 100%;
      }
    `,
  ];

  render() {
    return html` <div class="divider-root"></div> `;
  }
}
