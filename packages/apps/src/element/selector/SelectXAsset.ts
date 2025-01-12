import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';
import { range } from 'lit/directives/range.js';
import { map } from 'lit/directives/map.js';
import {
  virtualize,
  virtualizerRef,
} from '@lit-labs/virtualizer/virtualize.js';

import { Asset as RegAsset } from '@galacticcouncil/sdk';
import { AnyChain, Asset, AssetAmount } from '@galacticcouncil/xcm-core';

import { Ecosystem } from 'db';
import { baseStyles, selectorStyles } from 'styles';

import { humanizeAmount } from 'utils/amount';
import { getChainAssetId, getChainEcosystem, getChainId } from 'utils/chain';

import 'element/id';

@customElement('gc-select-xasset')
export class SelectXAsset extends LitElement {
  @property({ attribute: false }) registry: Map<string, RegAsset> = new Map([]);
  @property({ attribute: false }) registryChain: AnyChain = null;
  @property({ attribute: false }) ecosystem: Ecosystem = Ecosystem.Polkadot;
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

  private resetSearch() {
    this.query = '';
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

  renderFn(asset: Asset, index: number) {
    const balance = this.balances.get(asset.key) || null;
    const displayBalance = balance ? humanizeAmount(balance.toDecimal()) : '-';
    return html`
      <uigc-asset-list-item
        style="z-index: ${0 - index};"
        ?selected=${this.isSelected(asset)}
        .asset=${{ symbol: asset.key }}
        .unit=${balance ? asset.originSymbol : null}
        .balance=${displayBalance}>
        ${this.formAssetTemplate(asset)}
      </uigc-asset-list-item>
    `;
  }

  override async update(changedProperties: Map<string, unknown>) {
    if (changedProperties.has('asset')) {
      const virtualizer = this.shadowRoot.querySelector('.virtual');
      if (virtualizer) {
        virtualizer[virtualizerRef].element(0).scrollIntoView();
        this.resetSearch();
      }
    }
    super.update(changedProperties);
  }

  formAssetTemplate(asset: Asset) {
    const registryId = this.registryChain.getBalanceAssetId(asset);
    const registryAsset = this.registry.get(registryId.toString());

    if (this.chain.isEvmChain() || this.chain.isSolana()) {
      return html`
        <uigc-asset slot="asset" symbol=${asset.originSymbol}>
          <uigc-asset-id
            slot="icon"
            ecosystem=${getChainEcosystem(this.chain)}
            chain=${getChainId(this.chain)}
            chainOrigin=${getChainId(this.chain)}
            .asset=${getChainAssetId(this.chain, asset)}></uigc-asset-id>
        </uigc-asset>
      `;
    }

    return html`
      <gc-asset-identicon
        slot="asset"
        .showDesc=${true}
        .asset=${registryAsset}
        .assets=${this.registry}
        .ecosystem=${this.ecosystem}></gc-asset-identicon>
    `;
  }

  render() {
    const filtered = this.filterAssets(this.query);
    const selected = filtered.filter((asset) => this.isSelected(asset));
    const rest = filtered.filter((asset) => !this.isSelected(asset));

    const assets =
      filtered.length > 0
        ? () => html`
            <uigc-asset-list class="virtual">
              ${virtualize({
                scroller: true,
                items: [...selected, ...rest],
                renderItem: (asset, index) => this.renderFn(asset, index),
              })}
            </uigc-asset-list>
          `
        : () => html``;

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
              ${map(range(3), () => this.loadingTemplate())}
            </uigc-asset-list>
          `,
      )}
    `;
  }
}
