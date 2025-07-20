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

import { Ecosystem } from 'db';
import { isExternalAssetWhitelisted } from 'utils/asset';

import styles from './AssetIdenticon.css';
import { MetadataStore } from '@galacticcouncil/ui';

const ATOKEN_DECORATION_BLACKLIST = [
  '69', // GDOT
  '420', // GETH
];

@customElement('gc-asset-identicon')
export class AssetIdenticon extends LitElement {
  @property({ type: Boolean }) showDesc: boolean = false;
  @property({ type: Boolean }) showSymbol: boolean = true;
  @property({ attribute: false }) asset: Asset = null;
  @property({ attribute: false }) assets: Map<string, Asset> = new Map([]);
  @property({ attribute: false }) atokens: Map<string, string> = new Map([]);
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

  iconTemplate(id: string, isATokenPool: boolean = false) {
    const asset = this.assets.get(id);

    const ethereumNetworkEntry = findNestedKey(asset.location, 'ethereum');

    const underlyingAssetId = this.atokens.get(asset.id);
    const isAToken =
      !!underlyingAssetId && !ATOKEN_DECORATION_BLACKLIST.includes(asset.id);

    const decoration = (() => {
      if (isATokenPool) return 'atoken-pool';
      if (isAToken) return 'atoken';
      return null;
    })();

    if (ethereumNetworkEntry) {
      const { ethereum } = ethereumNetworkEntry;
      const ethereumChain = findNestedKey(ethereum, 'chainId');
      const ethereumAsset = findNestedKey(asset.location, 'key');

      const ethereumAssetId = ethereumAsset
        ? ethereumAsset.key
        : '0x0000000000000000000000000000000000000000';

      return html`
        <uigc-asset-id
          slot="icon"
          ecosystem=${'ethereum'}
          chain=${ethereumChain.chainId}
          chainOrigin=${ethereumChain.chainId}
          .decoration=${decoration}
          .asset=${ethereumAssetId}>
          ${this.iconBadgeTemplate(asset)}
        </uigc-asset-id>
      `;
    }

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
          .decoration=${decoration}
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
        .decoration=${decoration}
        .asset=${underlyingAssetId || id}>
        ${this.iconBadgeTemplate(asset)}
      </uigc-asset-id>
    `;
  }

  render() {
    const { id, name, symbol, type } = this.asset || {};

    const underlyingAssetId = this.atokens.get(this.asset.id);
    const asset =
      underlyingAssetId && !ATOKEN_DECORATION_BLACKLIST.includes(id)
        ? this.assets.get(underlyingAssetId)
        : this.asset;

    const isAToken = !!underlyingAssetId;
    const isATokenPool = isAToken && asset.type === 'StableSwap';

    const meta = asset?.meta ? asset?.meta : this.asset?.meta;

    if (meta) {
      const icons = Object.entries(meta);
      return html`
        <uigc-asset
          ?icon=${!this.showSymbol}
          symbol=${symbol}
          desc=${this.showDesc ? name : null}
          .isATokenPool=${isATokenPool}>
          ${map(icons, ([key]) => {
            return this.iconTemplate(key, isATokenPool);
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
