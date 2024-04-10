import { html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { UIGCElement } from './base/UIGCElement';

@customElement('uigc-asset-list')
export class AssetList extends UIGCElement {
  @property({ type: Boolean }) newAssetBtn = false;

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

      .btn {
        padding: 8px 0;
        justify-content: center;
      }

      .text {
        font-size: 14px;
        color: #85d1ff;
        cursor: pointer;
        font-weight: 500;

        display: flex;
        justify-content: center;
        align-items: center;
        gap: 4px;
      }

      .text:hover {
        color: #ecedef;
        path {
          stroke: #ecedef;
        }
      }
    `,
  ];

  protected onNewAssetClick() {
    const options = {
      bubbles: true,
      composed: true,
    };
    this.dispatchEvent(new CustomEvent('gc:newAsset', options));
  }

  renderNewAssetButton() {
    if (this.newAssetBtn) {
      return html`
        <div class="list-header btn">
          <div class="text" @click=${this.onNewAssetClick}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="11"
              height="10"
              viewBox="0 0 11 10"
              fill="none">
              <path
                d="M5.49999 1.33398V5.00074M5.49999 8.66749V5.00074M5.49999 5.00074H1.83333M5.49999 5.00074H9.16666"
                stroke="#85D1FF"
                stroke-width="1.71429"
                stroke-linecap="square" />
            </svg>

            Add new asset
          </div>
        </div>
      `;
    }
  }

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
        ${this.renderNewAssetButton()}
      </div>
    `;
  }
}
