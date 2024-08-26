import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { map } from 'lit/directives/map.js';

import { i18n } from 'localization';

import {
  Asset,
  BASILISK_PARACHAIN_ID,
  HYDRADX_PARACHAIN_ID,
  SYSTEM_ASSET_ID,
} from '@galacticcouncil/sdk';

import { Ecosystem } from 'db';
import { isExternalAssetWhitelisted } from 'utils/asset';

import styles from './AssetIdenticon.css';

@customElement('gc-asset-identicon')
export class AssetIdenticon extends LitElement {
  @property({ type: Boolean }) showDesc: boolean = false;
  @property({ type: Boolean }) showSymbol: boolean = true;
  @property({ attribute: false }) asset: Asset = null;
  @property({ attribute: false }) assets: Map<string, Asset> = new Map([]);
  @property({ attribute: false }) ecosystem: Ecosystem = Ecosystem.Polkadot;

  static styles = styles;

  iconBadgeTemplate(asset: Asset) {
    if (asset.type !== 'External') return;

    const variant = isExternalAssetWhitelisted(asset) ? 'warning' : 'danger';
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
    const chain =
      this.ecosystem === Ecosystem.Polkadot
        ? HYDRADX_PARACHAIN_ID
        : BASILISK_PARACHAIN_ID;

    if (asset.origin) {
      return html`
        <uigc-asset-id
          slot="icon"
          ecosystem=${this.ecosystem.toLowerCase()}
          chain=${chain}
          chainOrigin=${asset.origin}
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
        .asset=${id}>
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
