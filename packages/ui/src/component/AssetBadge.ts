import { html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { UIGCElement } from './base/UIGCElement';

import './Popper';
import './icons/Warning';

@customElement('uigc-asset-badge')
export class AssetBadge extends UIGCElement {
  @property({ type: String }) text = null;
  @property({ type: String }) variant = null;

  static styles = [
    UIGCElement.styles,
    css`
      uigc-icon-warning {
        display: flex;
        position: absolute;
        width: 50%;
        height: 50%;
        z-index: 1;
        right: -10%;
        bottom: -10%;
        filter: drop-shadow(0 0 4px rgba(0, 0, 0, 0.85));
      }
    `,
  ];

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
