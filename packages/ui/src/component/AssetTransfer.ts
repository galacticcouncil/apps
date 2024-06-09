import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';

import { UIGCElement } from './base/UIGCElement';

import './AssetInput';
import './AssetSelector';

import styles from './AssetTransfer.css';

@customElement('uigc-asset-transfer')
export class AssetTransfer extends UIGCElement {
  @property({ type: String }) id = null;
  @property({ type: String }) title = null;
  @property({ type: String }) amount = null;
  @property({ type: String }) amountUsd = null;
  @property({ type: String }) asset = null;
  @property({ type: String }) unit = null;
  @property({ type: String }) error = null;
  @property({ type: Boolean }) selectable = true;
  @property({ type: Boolean }) readonly = false;

  static styles = [UIGCElement.styles, styles];

  render() {
    return html`
      <div tabindex="0" class="asset-root">
        <span class="title">${this.title}</span>
        <slot name="balance"></slot>
        <div class="asset">
          ${when(
            this.selectable,
            () =>
              html`
                <uigc-asset-selector id=${this.id} .asset=${this.asset}>
                  <slot name="asset" slot="asset"></slot>
                </uigc-asset-selector>
              `,
            () =>
              html`
                <slot class="asset_ro" name="asset"></slot>
              `,
          )}
          <uigc-asset-input
            hdx
            id=${this.id}
            .asset=${this.asset}
            .amount=${this.amount}
            .amountUsd=${this.amountUsd}
            .unit=${this.unit}
            ?disabled=${this.readonly}></uigc-asset-input>
          <uigc-asset-input
            bsx
            id=${this.id}
            .asset=${this.asset}
            .amount=${this.amount}
            .amountUsd=${this.amountUsd}
            .unit=${this.unit}
            ?error=${this.error}
            .error=${this.error}
            ?disabled=${this.readonly}></uigc-asset-input>
        </div>
      </div>
      <p hdx class="asset-error">${this.error}</p>
    `;
  }
}
