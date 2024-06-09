import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { UIGCElement } from './base/UIGCElement';

import './Popper';
import './icons/Warning';

import styles from './AssetBadge.css';

@customElement('uigc-asset-badge')
export class AssetBadge extends UIGCElement {
  @property({ type: String }) text = null;
  @property({ type: String }) variant = null;

  static styles = [UIGCElement.styles, styles];

  override async updated() {
    const warningLogo = this.shadowRoot.querySelector('uigc-icon-warning');
    if (this.variant === 'danger') {
      warningLogo?.setAttribute('red', '');
    } else {
      warningLogo?.removeAttribute('red');
    }
  }

  render() {
    return html`
      <uigc-popper text=${this.text}>
        <uigc-icon-warning fit></uigc-icon-warning>
      </uigc-popper>
    `;
  }
}
