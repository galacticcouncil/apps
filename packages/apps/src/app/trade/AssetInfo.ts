import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { Asset } from '@galacticcouncil/sdk';

import { i18n } from 'localization';

import styles from './AssetInfo.css';
import { baseStyles } from 'styles';

@customElement('gc-trade-asset-info')
export class TradeAssetInfo extends LitElement {
  @property({ attribute: false }) assets: Map<string, Asset> = new Map([]);
  @property({ type: Object }) assetIn: Asset = null;
  @property({ type: Object }) assetOut: Asset = null;
  @property({ type: String }) chainName: string = null;
  @property({ type: Function }) onCheckAssetDataClick: (asset: Asset) => void =
    null;

  static styles = [baseStyles, styles];

  renderAsset(asset: Asset) {
    if (asset) {
      return html`
        <button
          class="asset"
          type="button"
          @click=${() => this.onCheckAssetDataClick(asset)}>
          <gc-asset-identicon
            .showSymbol=${false}
            .asset=${asset}
            .assets=${this.assets}></gc-asset-identicon>
          <span class="symbol">${asset.symbol}</span>
          <span class="link">${i18n.t('asset.info.checkData')}</span>
        </button>
      `;
    }
  }

  render() {
    return html`
      <uigc-paper>
        <p class="title">
          ${i18n.t('header.assetInfo', {
            name: this.chainName,
          })}
        </p>
        <div class="assets">
          ${this.renderAsset(this.assetIn)} ${this.renderAsset(this.assetOut)}
        </div>
      </uigc-paper>
    `;
  }
}
