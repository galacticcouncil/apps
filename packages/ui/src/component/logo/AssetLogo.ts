import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { BaseLogo } from './BaseLogo';
import { MetadataStore } from '../utils';

@customElement('uigc-logo-asset')
export class AssetLogo extends BaseLogo {
  @property({ type: String }) ecosystem: string = null;
  @property({ type: String }) chain: string = null;
  @property({ attribute: false }) asset: string | { [key: string]: string } =
    null;

  render() {
    const asset = MetadataStore.getInstance().asset(
      this.ecosystem,
      this.chain,
      this.asset,
    );

    if (asset) {
      return html`
        <img loading="lazy" src="${asset}" alt="${this.asset}" />
      `;
    }
    return html`
      <slot name="placeholder"></slot>
    `;
  }
}
