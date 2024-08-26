import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { BaseLogo } from './BaseLogo';
import { MetadataStore } from '../utils';

@customElement('uigc-logo-chain')
export class ChainLogo extends BaseLogo {
  @property({ type: String }) ecosystem: string = null;
  @property({ type: String }) chain: string = null;

  render() {
    const chain = MetadataStore.getInstance().chain(this.ecosystem, this.chain);

    if (chain) {
      return html`
        <img loading="lazy" src="${chain}" alt="${this.chain}" />
      `;
    }
    return html`
      <slot name="placeholder"></slot>
    `;
  }
}
