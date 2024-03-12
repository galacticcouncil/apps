import { html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { UIGCElement } from './base/UIGCElement';

import './logo/ChainLogo';
import './logo/PlaceholderLogo';

@customElement('uigc-chain')
export class Chain extends UIGCElement {
  @property({ type: String }) name = null;
  @property({ type: String }) key = null;

  static styles = [
    UIGCElement.styles,
    css`
      :host {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 6px;
        background-color: transparent;
        cursor: pointer;
      }

      span.title {
        font-weight: 700;
        font-size: 16px;
        padding: 5px 0px;
        color: var(--hex-white);
      }

      uigc-logo-chain,
      uigc-logo-placeholder {
        width: 34px;
        height: 34px;
      }
    `,
  ];

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
