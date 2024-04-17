import { html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { UIGCElement } from './base/UIGCElement';

import './icons/Switch';
import './icons/Arrow';

@customElement('uigc-asset-switch')
export class AssetSwitch extends UIGCElement {
  @property({ type: String }) message = null;

  static styles = [
    UIGCElement.styles,
    css`
      :host([basic]) uigc-icon-arrow {
        display: block;
      }

      :host(:not([basic])) uigc-icon-switch {
        display: flex;
      }

      :host([disabled]) .switch-root:hover > uigc-icon-switch,
      :host([disabled]) .switch-root:hover > uigc-icon-arrow {
        cursor: unset;
        transform: none;
      }

      .switch-root {
        width: 34px;
        height: 34px;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      uigc-icon-switch,
      uigc-icon-arrow {
        display: none;
        transition: var(--uigc-asset-switch-transition);
      }

      .switch-root:hover > uigc-icon-switch,
      .switch-root:hover > uigc-icon-arrow {
        cursor: pointer;
        transform: var(--uigc-asset-switch-transform);
      }
    `,
  ];

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
