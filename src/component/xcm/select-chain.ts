import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';
import { range } from 'lit/directives/range.js';
import { map } from 'lit/directives/map.js';

import { baseStyles } from '../base.css';
import { formatAmount } from '../../utils/amount';

import { Amount, PoolAsset } from '@galacticcouncil/sdk';

@customElement('gc-xcm-app-chain')
export class SelectToken extends LitElement {
  @property({ attribute: false }) assets: string[] = [];
  @property({ type: String }) origin = null;
  @property({ type: String }) destination = null;

  static styles = [
    baseStyles,
    css`
      :host {
        display: flex;
        flex-direction: column;
        height: 100%;
      }

      .header {
        display: flex;
        justify-content: center;
        padding: 22px 28px;
        box-sizing: border-box;
        align-items: center;
        line-height: 40px;
      }

      .header span {
        color: var(--hex-neutral-gray-100);
        font-weight: 500;
        font-size: 16px;
      }

      .header .back {
        position: absolute;
        left: 20px;
      }

      .search {
        padding: 0 14px;
        box-sizing: border-box;
      }

      @media (min-width: 768px) {
        .search {
          padding: 0 28px;
        }
      }

      .loading {
        align-items: center;
        display: flex;
        padding: 8px 28px;
        gap: 6px;
        border-bottom: 1px solid var(--hex-background-gray-800);
      }

      .loading > span.title {
        display: flex;
        flex-direction: column;
        gap: 4px;
      }
    `,
  ];

  onBackClick(e: any) {
    const options = {
      bubbles: true,
      composed: true,
    };
    this.dispatchEvent(new CustomEvent('back-clicked', options));
  }

  // isSelected(asset: PoolAsset): boolean {
  //   return this.selector.asset == asset.symbol;
  // }

  // getSlot(asset: PoolAsset): string {
  //   if (this.isSelected(asset)) {
  //     return 'selected';
  //   } else if (this.isDisabled(asset)) {
  //     return 'disabled';
  //   } else {
  //     return null;
  //   }
  // }

  loadingTemplate() {
    return html`
      <div class="loading">
        <uigc-skeleton circle progress></uigc-skeleton>
        <span class="title">
          <uigc-skeleton progress width="40px" height="16px"></uigc-skeleton>
          <uigc-skeleton progress width="50px" height="8px"></uigc-skeleton>
        </span>
        <span class="grow"></span>
        <uigc-skeleton progress width="100px" height="16px"></uigc-skeleton>
      </div>
    `;
  }

  render() {
    return html`
      <div class="header">
        <uigc-icon-button class="back" @click=${this.onBackClick}> <uigc-icon-back></uigc-icon-back> </uigc-icon-button>
        <span>Select chain</span>
        <span></span>
      </div>
      ${when(
        this.assets.length > 0,
        () => html` <uigc-asset-list> </uigc-asset-list>`,
        () => html` <uigc-asset-list> ${map(range(3), (i) => this.loadingTemplate())} </uigc-asset-list> `
      )}
    `;
  }
}
