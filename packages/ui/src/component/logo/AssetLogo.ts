import { html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

import { BaseLogo } from './BaseLogo';
import { MetadataStore } from '../utils';

@customElement('uigc-logo-asset')
export class AssetLogo extends BaseLogo {
  @property({ type: String }) ecosystem: string = null;
  @property({ type: String }) chain: string = null;
  @property({ attribute: false }) asset: string | { [key: string]: string } =
    null;

  @state() src: string = null;

  override async firstUpdated() {
    this.src = await MetadataStore.getInstance().asset(
      this.ecosystem,
      this.chain,
      this.asset,
    );
  }

  render() {
    if (this.src) {
      return html`
        <img loading="lazy" src="${this.src}" alt="${this.asset}" />
      `;
    }
    return html`
      <slot name="placeholder"></slot>
    `;
  }
}
