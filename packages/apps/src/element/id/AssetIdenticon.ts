import { LitElement, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { map } from 'lit/directives/map.js';

import { i18n } from 'localization';

import {
  findNestedKey,
  Asset,
  BASILISK_PARACHAIN_ID,
  HYDRADX_PARACHAIN_ID,
  SYSTEM_ASSET_ID,
} from '@galacticcouncil/sdk';

import { ChainCursor, Ecosystem } from 'db';
import {
  getATokenUnderlyingAssetId,
  isAToken,
  isExternalAssetWhitelisted,
} from 'utils/asset';

import styles from './AssetIdenticon.css';
import { MetadataStore } from '@galacticcouncil/ui';

@customElement('gc-asset-identicon')
export class AssetIdenticon extends LitElement {
  @property({ type: Boolean }) showDesc: boolean = false;
  @property({ type: Boolean }) showSymbol: boolean = true;
  @property({ attribute: false }) asset: Asset = null;
  @property({ attribute: false }) assets: Map<string, Asset> = new Map([]);
  @property({ attribute: false }) ecosystem: Ecosystem = Ecosystem.Polkadot;

  static styles = styles;

  @state() whitelist: string[] = [];

  override async firstUpdated() {
    this.whitelist = await MetadataStore.getInstance().externalWhitelist();
  }

  iconBadgeTemplate(asset: Asset) {
    if (asset.type !== 'External') return;

    const variant = isExternalAssetWhitelisted(this.whitelist, asset)
      ? 'warning'
      : 'danger';
    const text = i18n.t(`asset.external.badge.${variant}`);

    return html`
      <uigc-asset-badge
        slot="badge"
        text=${text}
        variant=${variant}></uigc-asset-badge>
    `;
  }

  iconTemplate(id: string) {
    const asset = this.assets.get(id);

    const ethereumNetworkEntry = findNestedKey(asset.location, 'ethereum');
    if (ethereumNetworkEntry) {
      const { ethereum } = ethereumNetworkEntry;
      const ethereumChain = findNestedKey(ethereum, 'chainId');
      const ethereumAsset = findNestedKey(asset.location, 'key');
      return html`
        <uigc-asset-id
          slot="icon"
          ecosystem=${'ethereum'}
          chain=${ethereumChain.chainId}
          chainOrigin=${ethereumChain.chainId}
          .asset=${ethereumAsset.key}>
          ${this.iconBadgeTemplate(asset)}
        </uigc-asset-id>
      `;
    }

    const underlyingAssetId = getATokenUnderlyingAssetId(
      asset,
      ChainCursor.deref().isTestnet,
    );

    const chain =
      this.ecosystem === Ecosystem.Polkadot
        ? HYDRADX_PARACHAIN_ID
        : BASILISK_PARACHAIN_ID;
    const parachainEntry = findNestedKey(asset.location, 'parachain');
    if (parachainEntry) {
      return html`
        <uigc-asset-id
          slot="icon"
          ecosystem=${this.ecosystem.toLowerCase()}
          chain=${chain}
          chainOrigin=${parachainEntry.parachain}
          .isAToken=${!!underlyingAssetId}
          .asset=${id}>
          ${this.iconBadgeTemplate(asset)}
        </uigc-asset-id>
      `;
    }

    return html`
      <uigc-asset-id
        slot="icon"
        ecosystem=${this.ecosystem.toLowerCase()}
        chain=${chain}
        .isAToken=${!!underlyingAssetId}
        .asset=${underlyingAssetId || id}>
        ${this.iconBadgeTemplate(asset)}
      </uigc-asset-id>
    `;
  }

  render() {
    const { id, name, symbol, meta, type } = this.asset || {};
    if (meta) {
      const icons = Object.entries(meta);
      return html`
        <uigc-asset
          ?icon=${!this.showSymbol}
          symbol=${symbol}
          desc=${this.showDesc ? name : null}>
          ${map(icons, ([key]) => {
            return this.iconTemplate(key);
          })}
        </uigc-asset>
      `;
    }

    if (type === 'Bond') {
      return html`
        <uigc-asset
          ?icon=${!this.showSymbol}
          symbol=${symbol}
          desc=${this.showDesc ? name : name.replace('HDX Bond', '').trim()}>
          ${this.iconTemplate(SYSTEM_ASSET_ID)}
        </uigc-asset>
      `;
    }

    return html`
      <uigc-asset
        ?icon=${!this.showSymbol}
        symbol=${symbol}
        desc=${this.showDesc ? name : null}>
        ${this.iconTemplate(id)}
      </uigc-asset>
    `;
  }
}
