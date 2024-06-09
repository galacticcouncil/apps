import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { UIGCElement } from './base/UIGCElement';

import './logo/ChainLogo';
import './logo/PlaceholderLogo';

import styles from './Chain.css';

@customElement('uigc-chain')
export class Chain extends UIGCElement {
  @property({ type: String }) name = null;
  @property({ type: String }) key = null;

  static styles = [UIGCElement.styles, styles];

  render() {
    return html`
      <uigc-logo-chain fit chain=${this.key}>
        <uigc-logo-placeholder fit slot="placeholder"></uigc-logo-placeholder>
      </uigc-logo-chain>
      <span class="title">${this.name}</span>
      <slot></slot>
    `;
  }
}
