import { LitElement, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';
import { range } from 'lit/directives/range.js';
import { map } from 'lit/directives/map.js';
import {
  virtualize,
  virtualizerRef,
} from '@lit-labs/virtualizer/virtualize.js';

import { Amount, Asset } from '@galacticcouncil/sdk';

import { Ecosystem } from 'db';
import { baseStyles, selectorStyles } from 'styles';
import { exchange, formatAmount, humanizeAmount } from 'utils/amount';

import { AssetSelector } from './types';

import 'element/id';
import { emptySearchIcon } from './icons';

import styles from './SelectAsset.css';

@customElement('gc-select-asset')
export class SelectAsset extends LitElement {
  @property({ attribute: false }) assets: Asset[] = [];
  @property({ attribute: false }) assetsAlt: Asset[] = null;
  @property({ attribute: false }) atokens: Map<string, string> = new Map([]);
  @property({ attribute: false }) balances: Map<string, Amount> = new Map([]);
  @property({ attribute: false }) usdPrice: Map<string, Amount> = new Map([]);
  @property({ attribute: false }) selector: AssetSelector = null;
  @property({ attribute: false }) ecosystem: Ecosystem = Ecosystem.Polkadot;
  @property({ type: Object }) assetIn: Asset = null;
  @property({ type: Object }) assetOut: Asset = null;
  @property({ type: Boolean }) switchAllowed = true;

  @state() query = '';

  static styles = [baseStyles, selectorStyles, styles];

  private getAssets() {
    return new Map(
      this.assets.map((asset: Asset) => {
        return [asset.id, asset];
      }),
    );
  }

  private updateSearch(searchDetail: any) {
    this.query = searchDetail.value;
  }

  private resetSearch() {
    this.query = '';
  }

  private getAssetBalance(asset: Asset) {
    const balance = this.balances.get(asset.id);
    const balanceFormated = balance
      ? formatAmount(balance.amount, balance.decimals)
      : null;
    const balanceUsd = balance
      ? exchange(this.usdPrice, asset, balanceFormated)
      : null;
    return {
      asset: asset,
      balance: balanceFormated,
      balanceUsd: balanceUsd,
    };
  }

  private filterAsset(query: string, asset: Asset) {
    const symbolEq = asset.symbol.toLowerCase().includes(query.toLowerCase());
    const nameEq = asset.name.toLowerCase().includes(query.toLowerCase());
    const isEq = symbolEq || nameEq;
    return isEq;
  }

  private filterAssets(query: string, assets: Asset[]) {
    const tickerOrder = [
      'HDX',
      'DOT',
      'USDC',
      'USDT',
      'IBTC',
      'VDOT',
      'WETH',
      'WBTC',
    ];

    const getTickerIndex = (ticker: string) => {
      const index = tickerOrder.indexOf(ticker.toUpperCase());
      return index === -1 ? Infinity : index;
    };

    return assets
      .filter((a) => this.filterAsset(query, a))
      .map((a) => this.getAssetBalance(a))
      .sort((a, b) => {
        if (Number(b.balanceUsd) === 0 && Number(a.balanceUsd) === 0) {
          if (a.asset.type === 'External' && b.asset.type !== 'External')
            return 1;
          if (a.asset.type !== 'External' && b.asset.type === 'External')
            return -1;

          const tickerIndexA = getTickerIndex(a.asset.symbol);
          const tickerIndexB = getTickerIndex(b.asset.symbol);

          if (tickerIndexA === tickerIndexB) {
            return a.asset.symbol.localeCompare(b.asset.symbol);
          }

          return tickerIndexA - tickerIndexB;
        }

        return Number(b.balanceUsd) - Number(a.balanceUsd);
      });
  }

  private filter(query: string) {
    if (!this.assetsAlt) {
      return this.filterAssets(query, this.assets);
    }

    const secondaryArr = this.assetsAlt.map(({ id }) => id);
    const secondarySet = new Set(secondaryArr);
    const assets = this.assets.filter((a) => !secondarySet.has(a.id));
    const selected = this[this.selector?.id];
    const inPrimary = assets.find((asset) => asset.id === selected?.id);
    if (inPrimary) {
      return this.filterAssets(query, assets);
    }
    return this.filterAssets(query, this.assetsAlt);
  }

  isDisabled(asset: Asset): boolean {
    if (this.selector?.id == 'assetOut') {
      return asset.id === '1' && asset.symbol.toLowerCase() === 'h2o';
    }
    return false;
  }

  isSelected(asset: Asset): boolean {
    if (this.selector?.asset) {
      return this[this.selector.id].id === asset.id;
    }
    return false;
  }

  loadingTemplate() {
    return html`
      <div class="loading">
        <uigc-skeleton circle progress></uigc-skeleton>
        <span class="title">
          <uigc-skeleton
            progress
            rectangle
            width="40px"
            height="16px"></uigc-skeleton>
          <uigc-skeleton
            progress
            rectangle
            width="50px"
            height="8px"></uigc-skeleton>
        </span>
        <span class="grow"></span>
        <uigc-skeleton
          progress
          rectangle
          width="100px"
          height="16px"></uigc-skeleton>
      </div>
    `;
  }

  emptySearchState() {
    return html`
      <div class="emptySection">
        ${emptySearchIcon}

        <span class="emptyTitle">
          <slot name="emptyTitle">
            The asset your are looking for is missing.
          </slot>
        </span>

        <slot slot="footer" name="footer"></slot>
      </div>
    `;
  }

  renderFn(aBalance: any, index: number) {
    if (aBalance === 'footer') {
      return html`
        <slot style="z-index: ${0 - index};" slot="footer" name="footer"></slot>
      `;
    }
    const { asset, balance, balanceUsd } = aBalance;
    const icons = asset.icon?.split('/') || [asset.symbol]; // TODO fix ext icon
    return html`
      <uigc-asset-list-item
        style="z-index: ${0 - index};"
        ?selected=${this.isSelected(asset)}
        ?disabled=${this.isDisabled(asset)}
        .asset=${asset}
        .unit=${icons.length === 1 ? asset.symbol : null}
        .balance=${humanizeAmount(balance)}
        .balanceUsd=${humanizeAmount(balanceUsd, 2)}>
        <gc-asset-identicon
          slot="asset"
          .showDesc=${true}
          .asset=${asset}
          .assets=${this.getAssets()}
          .atokens=${this.atokens}
          .ecosystem=${this.ecosystem}></gc-asset-identicon>
      </uigc-asset-list-item>
    `;
  }

  override async update(changedProperties: Map<string, unknown>) {
    if (changedProperties.has('selector')) {
      const virtualizer = this.shadowRoot.querySelector('.virtual');
      if (virtualizer) {
        virtualizer[virtualizerRef].element(0).scrollIntoView();
        this.resetSearch();
      }
    }
    super.update(changedProperties);
  }

  render() {
    const filtered = this.filter(this.query);
    const selected = filtered.filter(({ asset }) => this.isSelected(asset));
    const disabled = filtered.filter(({ asset }) => this.isDisabled(asset));
    const rest = filtered.filter(
      ({ asset }) => !this.isDisabled(asset) && !this.isSelected(asset),
    );

    const assets =
      filtered.length > 0
        ? () => html`
            <uigc-asset-list class="virtual">
              ${virtualize({
                scroller: true,
                items: [...selected, ...rest, ...disabled, 'footer'],
                renderItem: (asset, index) => this.renderFn(asset, index),
              })}
            </uigc-asset-list>
          `
        : () => this.emptySearchState();

    return html`
      <slot name="header"></slot>
      <uigc-search-bar
        class="search"
        placeholder="Search by name"
        .value=${this.query}
        @search-change=${(e: CustomEvent) =>
          this.updateSearch(e.detail)}></uigc-search-bar>
      ${when(
        this.assets.length > 0,
        assets,
        () =>
          html`
            <uigc-asset-list>
              ${map(range(3), (i) => this.loadingTemplate())}
            </uigc-asset-list>
          `,
      )}
    `;
  }
}
