import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';
import { range } from 'lit/directives/range.js';
import { map } from 'lit/directives/map.js';

import * as i18n from 'i18next';

import { humanizeAmount } from '../../utils/amount';

import { baseStyles } from '../base.css';

@customElement('gc-xcm-app-token')
export class SelectToken extends LitElement {
  @property({ attribute: false }) assets: string[] = [];
  @property({ attribute: false }) balances: Map<string, string> = new Map([]);
  @property({ type: String }) asset = null;
  @property({ type: String }) query = '';

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
        min-height: 84px;
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

      uigc-asset-list {
        padding-top: 20px;
        overflow-y: auto;
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

  updateSearch(searchDetail: any) {
    this.query = searchDetail.value;
  }

  onBackClick(e: any) {
    const options = {
      bubbles: true,
      composed: true,
    };
    this.dispatchEvent(new CustomEvent('back-clicked', options));
  }

  filterAssets(query: string) {
    return this.assets.filter((a) => a.toLowerCase().includes(query.toLowerCase()));
  }

  isSelected(asset: string): boolean {
    return this.asset == asset;
  }

  getSlot(asset: string): string {
    if (this.isSelected(asset)) {
      return 'selected';
    } else {
      return null;
    }
  }

  loadingTemplate() {
    return html`
      <div class="loading">
        <uigc-skeleton circle progress></uigc-skeleton>
        <span class="title">
          <uigc-skeleton progress rectangle width="40px" height="16px"></uigc-skeleton>
          <uigc-skeleton progress rectangle width="50px" height="8px"></uigc-skeleton>
        </span>
      </div>
    `;
  }

  render() {
    return html`
      <div class="header">
        <uigc-icon-button class="back" @click=${this.onBackClick}> <uigc-icon-back></uigc-icon-back> </uigc-icon-button>
        <uigc-typography variant="section">${i18n.t('xcm.selectAsset')}</uigc-typography>
        <span></span>
      </div>
      <uigc-search-bar
        class="search"
        placeholder="${i18n.t('xcm.searchByName')}"
        @search-changed=${(e: CustomEvent) => this.updateSearch(e.detail)}
      ></uigc-search-bar>
      ${when(
        this.assets.length > 0,
        () => html` <uigc-asset-list>
          ${map(this.filterAssets(this.query), (asset: string) => {
            const balance = this.balances.get(asset) || null;
            return html`
              <uigc-asset-list-item
                slot=${this.getSlot(asset)}
                ?selected=${this.isSelected(asset)}
                .asset=${{ symbol: asset }}
                .balance=${humanizeAmount(balance)}
              ></uigc-asset-list-item>
            `;
          })}
        </uigc-asset-list>`,
        () => html` <uigc-asset-list> ${map(range(3), (i) => this.loadingTemplate())} </uigc-asset-list> `
      )}
    `;
  }
}
