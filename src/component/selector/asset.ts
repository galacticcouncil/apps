import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';
import { range } from 'lit/directives/range.js';
import { map } from 'lit/directives/map.js';

import { baseStyles } from '../styles/base.css';
import { selectorStyles } from '../styles/selector.css';

import { formatAmount, humanizeAmount, multipleAmounts } from '../../utils/amount';
import { isAssetInAllowed, isAssetOutAllowed } from '../../utils/asset';

import { Amount, AssetDetail, PoolAsset } from '@galacticcouncil/sdk';
import { AssetSelector } from './types';

@customElement('gc-select-asset')
export class SelectAsset extends LitElement {
  @property({ attribute: false }) assets: PoolAsset[] = [];
  @property({ attribute: false }) pairs: Map<string, PoolAsset[]> = new Map([]);
  @property({ attribute: false }) details: Map<string, AssetDetail> = new Map([]);
  @property({ attribute: false }) balances: Map<string, Amount> = new Map([]);
  @property({ attribute: false }) usdPrice: Map<string, Amount> = new Map([]);
  @property({ attribute: false }) selector: AssetSelector = null;
  @property({ type: String }) assetIn = null;
  @property({ type: String }) assetOut = null;
  @property({ type: Boolean }) switchAllowed = true;
  @property({ type: String }) query = '';

  static styles = [baseStyles, selectorStyles];

  updateSearch(searchDetail: any) {
    this.query = searchDetail.value;
  }

  calculateDollarPrice(asset: PoolAsset, amount: string) {
    if (this.usdPrice.size == 0) {
      return null;
    }

    const usdPrice = this.usdPrice.get(asset.id);
    if (usdPrice == null) {
      return Number(amount).toFixed(2);
    }
    return multipleAmounts(amount, usdPrice).toFixed(2);
  }

  filterAssets(query: string) {
    return this.assets
      .filter((a) => {
        const assetDetail = this.details.get(a.id);
        const symbolEq = a.symbol.toLowerCase().includes(query.toLowerCase());
        const nameEq = assetDetail.name.toLowerCase().includes(query.toLowerCase());
        return symbolEq || nameEq;
      })
      .map((a) => {
        const balance = this.balances.get(a.id);
        const balanceFormated = balance ? formatAmount(balance.amount, balance.decimals) : null;
        const balanceUsd = balance ? this.calculateDollarPrice(a, balanceFormated) : null;
        return {
          asset: a,
          balance: balanceFormated,
          balanceUsd: balanceUsd,
        };
      })
      .sort((a, b) => Number(b.balanceUsd) - Number(a.balanceUsd));
  }

  isDisabled(asset: PoolAsset): boolean {
    if (this.selector?.id == 'assetIn') {
      return this.switchAllowed ? !isAssetInAllowed(this.assets, this.pairs, asset.id) : this.assetOut == asset.symbol;
    } else if (this.selector?.id == 'assetOut') {
      return !isAssetOutAllowed(this.assets, this.pairs, asset.id);
    } else {
      return false;
    }
  }

  isSelected(asset: PoolAsset): boolean {
    return this.selector?.asset == asset.symbol;
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
        <uigc-skeleton circle progress></uigc-skeleton>
        <span class="title">
          <uigc-skeleton progress rectangle width="40px" height="16px"></uigc-skeleton>
          <uigc-skeleton progress rectangle width="50px" height="8px"></uigc-skeleton>
        </span>
        <span class="grow"></span>
        <uigc-skeleton progress rectangle width="100px" height="16px"></uigc-skeleton>
      </div>
    `;
  }

  render() {
    return html`
      <slot name="header"></slot>
      <uigc-search-bar
        class="search"
        placeholder="Search by name"
        @search-changed=${(e: CustomEvent) => this.updateSearch(e.detail)}
      ></uigc-search-bar>
      ${when(
        this.assets.length > 0,
        () => html` <uigc-asset-list>
          ${map(this.filterAssets(this.query), ({ asset, balance, balanceUsd }) => {
            return html`
              <uigc-asset-list-item
                slot=${this.getSlot(asset)}
                ?selected=${this.isSelected(asset)}
                ?disabled=${this.isDisabled(asset)}
                .asset=${asset}
                .desc=${this.details.get(asset.id).name}
                .balance=${humanizeAmount(balance)}
                .balanceUsd=${humanizeAmount(balanceUsd)}
              ></uigc-asset-list-item>
            `;
          })}
        </uigc-asset-list>`,
        () => html` <uigc-asset-list> ${map(range(3), (i) => this.loadingTemplate())} </uigc-asset-list> `
      )}
    `;
  }
}
