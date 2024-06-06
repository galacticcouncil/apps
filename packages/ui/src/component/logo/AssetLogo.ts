import { html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

import { BaseLogo } from './BaseLogo';

const REPO = 'https://raw.githubusercontent.com/galacticcouncil/assets/master';

@customElement('uigc-logo-asset')
export class AssetLogo extends BaseLogo {
  @property({ type: String }) asset: string = null;

  @state() error = false;

  protected firstUpdated() {
    const img = this.shadowRoot.querySelector('img');
    img.addEventListener('error', () => {
      this.error = true;
    });
  }

  render() {
    if (this.error || !this.asset) {
      return html`
        <slot name="placeholder"></slot>
      `;
    }

    return html`
      <img src="${REPO}/assets/${this.asset.toLowerCase()}.svg" />
    `;
  }
}
