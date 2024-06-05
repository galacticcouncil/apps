import { html, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { UIGCElement } from './base/UIGCElement';

import './icons/Switch';
import './icons/Arrow';

import styles from './AssetSwitch.css';

@customElement('uigc-asset-switch')
export class AssetSwitch extends UIGCElement {
  @property({ type: String }) message = null;

  static styles = [UIGCElement.styles, unsafeCSS(styles)];

  onSwitchClick(e: any) {
    const options = {
      bubbles: true,
      composed: true,
    };
    this.dispatchEvent(new CustomEvent('asset-switch-click', options));
  }

  render() {
    return html`
      <div
        class="switch-root"
        @click=${this.onSwitchClick}
        title=${this.message}>
        <uigc-icon-switch fit></uigc-icon-switch>
        <uigc-icon-arrow></uigc-icon-arrow>
      </div>
    `;
  }
}
