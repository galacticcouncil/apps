import { html, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { UIGCElement } from './base/UIGCElement';

import './AssetInputComposite';
import './icons/Crosshair';

import styles from './AssetXRate.css';

@customElement('uigc-asset-x-rate')
export class AssetXRate extends UIGCElement {
  @property({ type: String }) title = null;
  @property({ type: String }) amount = null;
  @property({ type: String }) amountUsd = null;
  @property({ type: String }) asset = null;
  @property({ type: String }) unit = null;

  static styles = [UIGCElement.styles, unsafeCSS(styles)];

  render() {
    return html`
      <uigc-asset-cinput
        .asset=${this.asset}
        .amount=${this.amount}
        .amountUsd=${this.amountUsd}
        .unit=${this.unit}>
        <div class="title">
          <uigc-icon-crosshair></uigc-icon-crosshair>
          <span>${this.title}</span>
        </div>
        <slot name="button"></slot>
      </uigc-asset-cinput>
    `;
  }
}
