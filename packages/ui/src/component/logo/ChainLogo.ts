import { html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

import { BaseLogo } from './BaseLogo';

const REPO = 'https://raw.githubusercontent.com/galacticcouncil/assets/master';

@customElement('uigc-logo-chain')
export class ChainLogo extends BaseLogo {
  @property({ type: String }) chain: string = null;

  @state() error = false;

  protected firstUpdated() {
    const img = this.shadowRoot.querySelector('img');
    if (img) {
      img.addEventListener('error', () => {
        this.error = true;
      });
    }
  }

  render() {
    if (this.error || !this.chain) {
      return html`
        <slot name="placeholder"></slot>
      `;
    }

    return html`
      <img src="${REPO}/chains/${this.chain.toLowerCase()}.svg" />
    `;
  }
}
