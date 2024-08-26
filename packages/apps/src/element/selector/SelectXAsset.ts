import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';
import { range } from 'lit/directives/range.js';
import { map } from 'lit/directives/map.js';

import { AnyChain, Asset, AssetAmount } from '@galacticcouncil/xcm-core';

import { baseStyles, selectorStyles } from 'styles';

import { humanizeAmount } from 'utils/amount';
import { getChainAssetId, getChainEcosystem, getChainId } from 'utils/chain';

@customElement('gc-select-xasset')
export class SelectXAsset extends LitElement {
  @property({ attribute: false }) assets: Asset[] = [];
  @property({ attribute: false }) balances: Map<string, AssetAmount> = new Map(
    [],
  );
  @property({ attribute: false }) asset: Asset = null;
  @property({ attribute: false }) chain: AnyChain = null;
  @property({ type: String }) query = '';

  static styles = [baseStyles, selectorStyles];

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
    return this.assets.filter((a) =>
      a.originSymbol.toLowerCase().includes(query.toLowerCase()),
    );
  }

  isSelected(asset: Asset): boolean {
    return this.asset == asset;
  }

  getSlot(asset: Asset): string {
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
      </div>
    `;
  }

  render() {
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
        () => html`
          <uigc-asset-list>
            ${map(this.filterAssets(this.query), (asset: Asset) => {
              const balance = this.balances.get(asset.key) || null;
              const displayBalance = balance
                ? humanizeAmount(balance.toDecimal())
                : '-';
              return html`
                <uigc-asset-list-item
                  slot=${this.getSlot(asset)}
                  ?selected=${this.isSelected(asset)}
                  .asset=${{ symbol: asset.key }}
                  .unit=${balance ? asset.originSymbol : null}
                  .balance=${displayBalance}>
                  <uigc-asset slot="asset" symbol=${asset.originSymbol}>
                    <uigc-asset-id
                      slot="icon"
                      .ecosystem=${getChainEcosystem(this.chain)}
                      .chain=${getChainId(this.chain)}
                      .asset=${getChainAssetId(
                        this.chain,
                        asset,
                      )}></uigc-asset-id>
                  </uigc-asset>
                </uigc-asset-list-item>
              `;
            })}
          </uigc-asset-list>
        `,
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
