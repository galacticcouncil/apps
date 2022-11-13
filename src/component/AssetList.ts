import { html, css } from 'lit';
import { customElement } from 'lit/decorators.js';

import { UIGCElement } from './base/UIGCElement';

@customElement('ui-asset-list')
export class AssetList extends UIGCElement {
  static styles = [
    UIGCElement.styles,
    css`
      .list-root {
        padding-top: 20px;
        padding-bottom: 20px;
      }

      .list-header {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        padding: 6px 14px;
        color: var(--hex-neutral-gray-300);
        font-style: normal;
        font-weight: 600;
        font-size: 12px;
        line-height: 90%;
        border-bottom: 1px solid var(--hex-background-gray-800);
      }

      @media (min-width: 768px) {
        .list-header {
          padding: 6px 28px;
        }
      }

      .subheader {
        background-color: rgba(var(--rgb-white), 0.03);
      }

      ::slotted(*) {
        border-bottom: 1px solid var(--hex-background-gray-800);
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
