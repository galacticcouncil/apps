import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';
import { range } from 'lit/directives/range.js';
import { map } from 'lit/directives/map.js';

import { baseStyles } from '../base.css';
import { formatAmount } from '../../utils/amount';

import '../../component/AssetList';
import '../../component/AssetListItem';
import '../../component/IconButton';
import '../../component/SearchBar';
import '../../component/Skeleton';

import '../../component/icons/Back';

import { Amount, PoolAsset } from '@galacticcouncil/sdk';
import { AssetSelector } from './types';

@customElement('app-select-token')
export class SelectToken extends LitElement {
  @property({ attribute: false }) assets: PoolAsset[] = [];
  @property({ attribute: false }) pairs: Map<string, PoolAsset[]> = new Map([]);
  @property({ attribute: false }) balances: Map<string, Amount> = new Map([]);
  @property({ type: String }) assetIn = null;
  @property({ type: String }) assetOut = null;
  @property({ attribute: false }) selector: AssetSelector = null;
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
    return this.assets.filter((a) => a.symbol.toLowerCase().includes(query.toLowerCase()));
  }

  isDisabled(asset: PoolAsset): boolean {
    if (this.selector.id == 'assetIn') {
      return this.assetOut == asset.symbol;
    } else if (this.selector.id == 'assetOut') {
      return this.assetIn == asset.symbol;
    } else {
      return false;
    }
  }

  isSelected(asset: PoolAsset): boolean {
    return this.selector.asset == asset.symbol;
  }

  getSlot(asset: PoolAsset): string {
    if (this.isSelected(asset)) {
      return 'selected';
    } else if (this.isDisabled(asset)) {
      return 'disabled';
    } else {
      return null;
    }
  }

  loadingTemplate() {
    return html`
      <div class="loading">
        <ui-skeleton circle progress></ui-skeleton>
        <span class="title">
          <ui-skeleton progress width="40px" height="16px"></ui-skeleton>
          <ui-skeleton progress width="50px" height="8px"></ui-skeleton>
        </span>
        <span class="grow"></span>
        <ui-skeleton progress width="100px" height="16px"></ui-skeleton>
      </div>
    `;
  }

  render() {
    return html`
      <div class="header">
        <ui-icon-button class="back" @click=${this.onBackClick}> <icon-back></icon-back> </ui-icon-button>
        <span>Select token</span>
        <span></span>
      </div>
      <ui-search-bar
        class="search"
        placeholder="Search by name"
        @search-changed=${(e: CustomEvent) => this.updateSearch(e.detail)}
      ></ui-search-bar>
      ${when(
        this.assets.length > 0,
        () => html` <ui-asset-list>
          ${map(this.filterAssets(this.query), (asset: PoolAsset) => {
            const balance = this.balances.get(asset.id);
            const balanceFormated = balance ? formatAmount(balance.amount, balance.decimals) : null;
            return html`
              <ui-asset-list-item
                slot=${this.getSlot(asset)}
                ?disabled=${this.isDisabled(asset)}
                ?selected=${this.isSelected(asset)}
                .asset=${asset}
                .balance=${balanceFormated}
              ></ui-asset-list-item>
            `;
          })}
        </ui-asset-list>`,
        () => html` <ui-asset-list> ${map(range(3), (i) => this.loadingTemplate())} </ui-asset-list> `
      )}
    `;
  }
}
