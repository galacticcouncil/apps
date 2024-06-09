import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { UIGCElement } from './base/UIGCElement';

import './AssetInput';

import styles from './AssetInputComposite.css';

@customElement('uigc-asset-cinput')
export class AssetInputComposite extends UIGCElement {
  @property({ type: String }) amount = null;
  @property({ type: String }) amountUsd = null;
  @property({ type: String }) asset = null;
  @property({ type: String }) unit = null;
  @property({ type: Boolean }) disabled = false;

  static styles = [UIGCElement.styles, styles];

  render() {
    return html`
      <div class="ninput-root">
        <div class="title">
          <slot></slot>
        </div>
        <uigc-asset-input
          id=${this.id}
          .asset=${this.asset}
          .amount=${this.amount}
          .amountUsd=${this.amountUsd}
          .unit=${this.unit}
          ?disabled=${this.disabled}></uigc-asset-input>
      </div>
    `;
  }
}
