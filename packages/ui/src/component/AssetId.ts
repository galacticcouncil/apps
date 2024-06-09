import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { UIGCElement } from './base/UIGCElement';

import './logo/AssetLogo';
import './logo/ChainLogo';
import './logo/PlaceholderLogo';

import styles from './AssetId.css';

@customElement('uigc-asset-id')
export class AssetId extends UIGCElement {
  @property({ type: String }) symbol = null;
  @property({ type: String }) chain = null;

  static styles = styles;

  override async updated() {
    const logoChain = this.shadowRoot.querySelector('uigc-logo-chain');
    if (this.chain) {
      logoChain.setAttribute('chain', this.chain);
    } else {
      logoChain.removeAttribute('chain');
    }
  }

  render() {
    return html`
      <uigc-logo-asset fit .asset=${this.symbol}>
        <uigc-logo-placeholder fit slot="placeholder"></uigc-logo-placeholder>
      </uigc-logo-asset>
      <uigc-logo-chain fit>
        <uigc-logo-placeholder fit slot="placeholder"></uigc-logo-placeholder>
      </uigc-logo-chain>
      <slot name="badge"></slot>
    `;
  }
}
