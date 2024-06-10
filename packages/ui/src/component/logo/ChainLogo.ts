import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { BaseLogo } from './BaseLogo';
import { MetadataStore } from '../utils';

@customElement('uigc-logo-chain')
export class ChainLogo extends BaseLogo {
  @property({ type: String }) chain: string = null;

  render() {
    const key = this.normalizeKey(this.chain);
    const chain = MetadataStore.getInstance().chain(key);

    if (chain) {
      return html`
        <div>
          <img loading="lazy" src="${chain}" />
        </div>
      `;
    }
    return html`
      <slot name="placeholder"></slot>
    `;
  }
}
