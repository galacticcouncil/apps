import { html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

import { BaseLogo } from './BaseLogo';
import { MetadataStore } from '../utils';

@customElement('uigc-logo-chain')
export class ChainLogo extends BaseLogo {
  @property({ type: String }) ecosystem: string = null;
  @property({ type: String }) chain: string = null;

  @state() src: string = null;

  override async firstUpdated() {
    this.src = await MetadataStore.getInstance().chain(
      this.ecosystem,
      this.chain,
    );
  }

  render() {
    if (this.src) {
      return html`
        <img loading="lazy" src="${this.src}" alt="${this.chain}" />
      `;
    }
    return html`
      <slot name="placeholder"></slot>
    `;
  }
}
