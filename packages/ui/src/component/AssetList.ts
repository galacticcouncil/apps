import { html, css } from 'lit';
import { customElement } from 'lit/decorators.js';

import { UIGCElement } from './base/UIGCElement';

@customElement('uigc-asset-list')
export class AssetList extends UIGCElement {
  static styles = [
    UIGCElement.styles,
    css`
      .list-root {
        height: 100%;
        overflow-y: auto;
      }

      .list-header {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        padding: 0 14px;
        color: var(--uigc-list--header-color);
        background: var(--uigc-list--header-background);
        font-style: normal;
        font-weight: 600;
        font-size: 12px;
        line-height: 90%;
        border-bottom: var(--uigc-list-border-bottom);
        position: sticky;
        height: 24px;
        top: 0;
        z-index: 2;
      }

      @media (min-width: 768px) {
        .list-header {
          padding: 0 28px;
        }
      }

      .subheader {
        background: var(--uigc-list--header-background);
        position: sticky;
        top: 25px;
        z-index: 2;
      }

      ::slotted(*) {
        border-bottom: var(--uigc-list-border-bottom);
        display: block;
      }
    `,
  ];

  render() {
    return html`
      <div class="list-root">
        <div class="list-header">
          <span>ASSET</span>
          <span>BALANCE</span>
        </div>
        <slot name="selected"></slot>
        <slot></slot>
        <div class="list-header subheader">
          <span>ASSETS WITHOUT PAIR/POOL</span>
        </div>
        <slot name="disabled"></slot>
      </div>
    `;
  }
}
