import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { BaseLogo } from './BaseLogo';
import { MetadataStore } from '../utils';

@customElement('uigc-logo-asset')
export class AssetLogo extends BaseLogo {
  @property({ type: String }) asset: string = null;

  render() {
    const key = this.normalizeKey(this.asset);
    const asset = MetadataStore.getInstance().asset(key);

    if (asset) {
      return html`
        <div>
          <img loading="lazy" src="${asset}" />
        </div>
      `;
    }
    return html`
      <slot name="placeholder"></slot>
    `;
  }
}
