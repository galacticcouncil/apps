import { html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';

import { UIGCElement } from './base/UIGCElement';

import './AssetInput';
import './AssetSelector';

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

  static styles = [
    UIGCElement.styles,
    css`
      .asset-root {
        display: grid;
        margin: none;
        background: var(--uigc-field-background);
        border-radius: var(--uigc-field-border-radius);
        box-sizing: border-box;
        padding: var(--uigc-field-padding);
        row-gap: var(--uigc-field-row-gap);
      }

      :host([dense]) .asset {
        height: unset;
      }

      :host(:not([readonly])) .asset-root {
        border-bottom: var(--uigc-field-border-bottom);
      }

      :host([error]) .asset-root {
        border: var(--uigc-asset-transfer__error-border);
        border-width: var(--uigc-asset-transfer__error-border-width);
        outline: var(--uigc-asset-transfer__error-outline);
        outline-offset: -1px;
        border-bottom: var(--uigc-asset-transfer__error-border) !important;
      }

      :host(:not([readonly])) .asset-root:focus,
      :host(:not([readonly])) .asset-root:focus-visible,
      :host(:not([readonly])) .asset-root:focus-within,
      :host(:not([readonly])) .asset-root:hover {
        border-bottom: var(--uigc-field-border-bottom__hover);
        background: var(--uigc-field-background__hover);
        transition: 0.2s ease-in-out;
      }

      :host([error]:not([readonly])) .asset-root:focus,
      :host([error]:not([readonly])) .asset-root:focus-visible,
      :host([error]:not([readonly])) .asset-root:focus-within,
      :host([error]:not([readonly])) .asset-root:hover {
        background: var(--uigc-asset-transfer__error-backgroud__hover);
        transition: 0.2s ease-in-out;
      }

      .asset-root > :nth-child(1) {
        grid-area: 1 / 1 / 2 / 2;
      }

      .asset-root > :nth-child(2) {
        padding-top: 0;
        grid-area: 1 / 2 / 2 / 3;
      }

      .asset-root > :nth-child(3) {
        grid-area: 2 / 1 / 3 / 3;
      }

      @media (max-width: 480px) {
        .asset-root {
          margin: var(--uigc-field-margin__sm);
        }
      }

      .asset-error {
        color: var(--uigc-field__error-color);
        line-height: 16px;
        margin-top: 2px;
        font-size: 12px;
      }

      :host uigc-asset-input[bsx] {
        display: var(--uigc-bsx-display);
      }

      :host uigc-asset-input[hdx] {
        display: var(--uigc-hdx-display);
      }

      :host p[hdx] {
        display: var(--uigc-hdx-display);
      }

      .title {
        display: flex;
        align-items: center;
        font-weight: 600;
        font-size: var(--uigc-field--title-font-size);
        line-height: var(--uigc-field--title-line-height);
        color: var(--uigc-field--title-color);
        text-transform: var(--uigc-field--title-text-transform);
      }

      .asset {
        height: 54px;
        display: flex;
        flex-direction: row;
        align-items: center;
      }

      .asset_ro {
        padding: 5px;
      }

      .asset > *:last-child {
        margin-left: 18px;
      }

      @media (min-width: 768px) {
        .asset > *:last-child {
          margin-left: 23px;
        }
      }
    `,
  ];

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
