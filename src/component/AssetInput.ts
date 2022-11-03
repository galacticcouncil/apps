import { html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { UIGCElement } from './base/UIGCElement';
import { debounce } from 'ts-debounce';

@customElement('ui-asset-input')
export class AssetInput extends UIGCElement {
  @property({ type: String }) id = null;
  @property({ type: String }) amount = null;
  @property({ type: String }) amountUsd = '0';
  @property({ type: String }) asset = null;

  private _inputHandler = null;

  constructor() {
    super();
    this._inputHandler = debounce(this.onInputChanged, 300);
  }

  static styles = [
    UIGCElement.styles,
    css`
      :host {
        width: 100%;
      }

      /* Remove arrows - Chrome, Safari, Edge, Opera */
      input::-webkit-outer-spin-button,
      input::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
      }

      /* Remove arrows - Firefox */
      input[type='number'] {
        -moz-appearance: textfield;
      }

      input:placeholder-shown + .asset-unit {
        color: #c7c7cd;
      }

      /* Placeholder color */
      ::-webkit-input-placeholder {
        color: #c7c7cd;
      }

      ::-moz-placeholder {
        color: #c7c7cd;
      }

      ::-ms-placeholder {
        color: #c7c7cd;
      }

      ::placeholder {
        color: #c7c7cd;
      }

      .asset-root {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        -webkit-box-pack: center;
        justify-content: center;
        padding: 0 14px;
        height: 54px;
        background: rgba(var(--rgb-primary-100), 0.06);
        border-radius: 9px;
        border: 1px solid rgba(var(--rgb-white), 0.12);
      }

      .asset-root:focus-within {
        border: 1px solid var(--hex-primary-300);
      }

      .asset-root:hover {
        background: rgba(var(--rgb-white), 0.12);
      }

      .asset-field {
        width: 100%;
        display: flex;
        position: relative;
        -webkit-box-align: center;
        align-items: center;
        gap: 4px;
      }

      .asset-input {
        width: 100%;
        background: none;
        border: none;
        color: var(--hex-white);
        font-size: 16px;
        line-height: 24px;
        text-align: right;
        font-weight: 700;
        padding: 0px;
      }

      .asset-unit {
        color: var(--hex-white);
        font-weight: 700;
        font-size: 16px;
        line-height: 24px;
      }

      .usd {
        font-size: 10px;
        line-height: 14px;
        color: var(--hex-neutral-gray-400);
        font-weight: 600;
      }
    `,
  ];

  onInputChange(e: any) {
    this.amount = e.target.value;
  }

  onInputChanged() {
    const options = {
      bubbles: true,
      composed: true,
      detail: { id: this.id, asset: this.asset, value: this.amount },
    };
    this.dispatchEvent(new CustomEvent('asset-input-changed', options));
  }

  onWrapperClick(e: any) {
    this.shadowRoot.getElementById('asset').focus();
  }

  render() {
    return html`<div class="asset-root" @click=${this.onWrapperClick}>
      <span class="asset-field">
        <input
          ?disabled=${!this.asset}
          id="asset"
          type="number"
          class="asset-input"
          placeholder="0"
          .value=${this.asset ? this.amount : null}
          @input=${(e: any) => {
            this.onInputChange(e);
            this._inputHandler();
          }}
        />
        <span class="asset-unit">${this.asset}</span>
      </span>
      <span class="usd">≈ ${this.amountUsd} USD</span>
    </div> `;
  }
}
