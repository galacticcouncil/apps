import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { UIGCElement } from './base/UIGCElement';

import './logo/AssetLogo';
import './logo/ChainLogo';
import './logo/PlaceholderLogo';

import styles from './AssetId.css';

@customElement('uigc-asset-id')
export class AssetId extends UIGCElement {
  @property({ type: String }) ecosystem: string = null;
  @property({ type: String }) chain: string = null;
  @property({ type: String }) chainOrigin: string = null;
  @property({ type: String }) decoration: 'atoken' | 'atoken-pool' = null;
  @property({ attribute: false }) asset: string | { [key: string]: string } =
    null;

  static styles = styles;

  override async updated() {
    const logoChain = this.shadowRoot.querySelector('uigc-logo-chain');
    if (this.chainOrigin) {
      logoChain.setAttribute('chain', this.chainOrigin);
    } else {
      logoChain.removeAttribute('chain');
    }

    const logoAsset = this.shadowRoot.querySelector('uigc-logo-asset');
    if (this.decoration) {
      logoAsset.setAttribute('decoration', this.decoration);
    } else {
      logoAsset.removeAttribute('decoration');
    }
  }

  render() {
    return html`
      <uigc-logo-asset
        fit
        ecosystem=${this.ecosystem}
        .chain=${this.chain}
        .asset=${this.asset}>
        <uigc-logo-placeholder fit slot="placeholder"></uigc-logo-placeholder>
      </uigc-logo-asset>
      <uigc-logo-chain fit ecosystem=${this.ecosystem}>
        <uigc-logo-placeholder fit slot="placeholder"></uigc-logo-placeholder>
      </uigc-logo-chain>
      <slot name="badge"></slot>
    `;
  }
}
