import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { map } from 'lit/directives/map.js';

import { Asset } from '@galacticcouncil/sdk';

import { Ecosystem } from 'db';
import { getChainKey } from 'utils/chain';

@customElement('gc-asset-id')
export class AssetId extends LitElement {
  @property({ type: Boolean }) showDesc: boolean = false;
  @property({ type: Boolean }) showSymbol: boolean = true;
  @property({ attribute: false }) asset: Asset = null;
  @property({ attribute: false }) assets: Map<string, Asset> = new Map([]);
  @property({ attribute: false }) ecosystem: Ecosystem = Ecosystem.Polkadot;

  static styles = [
    css`
      :host([size='small']) uigc-asset {
        height: 24px;
      }

      :host([size='small']) uigc-asset-id {
        width: 24px;
        height: 24px;
      }
    `,
  ];

  iconTemplate(id: string, icon: string) {
    const asset = this.assets.get(id);
    if (asset.origin) {
      const originChain = getChainKey(asset.origin, this.ecosystem);
      return html`
        <uigc-asset-id
          slot="icon"
          symbol=${icon}
          chain=${originChain}></uigc-asset-id>
      `;
    }
    return html`
      <uigc-asset-id slot="icon" symbol=${icon}></uigc-asset-id>
    `;
  }

  render() {
    const { id, name, icon, symbol, meta, type } = this.asset || {};
    if (meta) {
      const icons = Object.entries(meta);
      return html`
        <uigc-asset
          ?icon=${!this.showSymbol}
          symbol=${symbol}
          desc=${this.showDesc ? name : null}>
          ${map(icons, ([key, value]) => {
            return this.iconTemplate(key, value);
          })}
        </uigc-asset>
      `;
    }

    const altDesc =
      type === 'Bond' && !this.showDesc
        ? name.replace('HDX Bond', '').trim()
        : null;

    return html`
      <uigc-asset
        ?icon=${!this.showSymbol}
        symbol=${symbol}
        desc=${this.showDesc ? name : altDesc}>
        ${this.iconTemplate(id, icon)}
      </uigc-asset>
    `;
  }
}
