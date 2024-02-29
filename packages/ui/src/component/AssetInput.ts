import { html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';

import { UIGCElement } from './base/UIGCElement';
import { priceMaskSettings } from './types/InputConfig';
import { debounce } from 'ts-debounce';

import IMask from 'imask';

@customElement('uigc-asset-input')
export class AssetInput extends UIGCElement {
  private _inputHandler = null;
  private _imask = null;

  @property({ type: String }) id = null;
  @property({ type: String }) amount = null;
  @property({ type: String }) amountUsd = null;
  @property({ type: String }) asset = null;
  @property({ type: String }) unit = null;
  @property({ type: String }) error = null;
  @property({ type: Boolean }) disabled = false;

  constructor() {
    super();
    this._inputHandler = debounce(this.onInputChange, 300);
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
        flex-direction: row;
        align-items: center;
        height: var(--uigc-input-height);
        border-radius: var(--uigc-input-border-radius);
        border-width: var(--uigc-input-border-width);
        border-color: var(--uigc-input-border-color);
      }

      :host([error]) .asset-root {
        border: var(--uigc-field__error-border);
        border-width: var(--uigc-field__error-border-width);
        outline: var(--uigc-field__error-outline);
        outline-offset: -1px;
        border-bottom: var(--uigc-field__error-border) !important;
      }

      :host([field]) .asset-root {
        flex-direction: row;
        background: var(--uigc-textfield__field-background);
        border-width: var(--uigc-textfield__field-border-width);
        border-color: var(--uigc-textfield__field-border-color);
        border-style: solid;
        box-sizing: border-box;
        padding: var(--uigc-field-padding);
      }

      :host([disabled]) .asset-root {
        border-width: 0;
      }

      :host(:not([disabled]):not([field])) .asset-root {
        padding: var(--uigc-textfield-padding);
        background: var(--uigc-textfield-background);
        border-style: var(--uigc-textfield-border-style);
      }

      :host(:not([disabled]):not([field])) .asset-root:focus-within {
        border-color: var(--uigc-input-border-color__focus);
      }

      :host(:not([disabled]):not([field])) .asset-root:hover {
        background: var(--uigc-textfield-background__hover);
      }

      :host([field]:not([disabled])) .asset-root:focus,
      :host([field]:not([disabled])) .asset-root:focus-visible,
      :host([field]:not([disabled])) .asset-root:focus-within,
      :host([field]:not([disabled])) .asset-root:hover {
        border-color: var(--uigc-textfield__field-border-color__hover);
        background: var(--uigc-textfield__field-background__hover);
        transition: 0.2s ease-in-out;
      }

      :host([error]:not([disabled])) .asset-root:focus,
      :host([error]:not([disabled])) .asset-root:focus-visible,
      :host([error]:not([disabled])) .asset-root:focus-within,
      :host([error]:not([disabled])) .asset-root:hover {
        background: rgba(255, 75, 75, 0.1);
        transition: 0.2s ease-in-out;
      }

      .asset-wrapper {
        width: 100%;
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
        font-size: var(--uigc-textfield-font-size__sm);
        line-height: 24px;
        text-align: right;
        font-weight: 700;
        padding: 0px;
      }

      .asset-error {
        color: var(--uigc-field__error-color);
        line-height: 16px;
        margin-top: 2px;
        font-size: 12px;
      }

      .asset-unit {
        color: var(--hex-white);
        font-weight: 700;
        font-size: var(--uigc-textfield-font-size__sm);
        line-height: 24px;
      }

      @media (min-width: 520px) {
        .asset-input {
          font-size: var(--uigc-textfield-font-size);
        }

        .asset-unit {
          font-size: var(--uigc-textfield-font-size);
        }
      }

      .usd {
        display: flex;
        flex-direction: row-reverse;
        font-size: 10px;
        line-height: 14px;
        color: var(--hex-neutral-gray-400);
        font-weight: 600;
      }

      #asset-value {
        display: none;
      }
    `,
  ];

  _onInputChange(e) {}

  onInputChange() {
    const unmasked = this._imask.unmaskedValue;
    const masked = this._imask.value;
    const options = {
      bubbles: true,
      composed: true,
      detail: {
        id: this.id,
        asset: this.asset,
        value: unmasked,
        masked: masked,
      },
    };
    this.dispatchEvent(new CustomEvent('asset-input-change', options));
  }

  onWrapperClick(e: any) {
    this.shadowRoot.getElementById('asset').focus();
  }

  override update(changedProperties: Map<string, unknown>) {
    if (changedProperties.has('amount') && this._imask) {
      if (this.amount) {
        this._imask.unmaskedValue = this.amount;
      } else {
        this._imask.unmaskedValue = '';
      }
    }
    super.update(changedProperties);
  }

  override async firstUpdated() {
    super.firstUpdated();
    const input = this.shadowRoot.getElementById('asset');
    this._imask = IMask(input, priceMaskSettings);
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    if (this._imask) {
      this._imask.destroy();
    }
  }

  render() {
    return html`
      <div class="asset-root" @click="${this.onWrapperClick}}">
        <slot name="inputAdornment"></slot>
        <div class="asset-wrapper">
          <span class="asset-field">
            <input
              ?disabled=${!this.asset || this.disabled}
              autocomplete="off"
              type="text"
              id="asset"
              class="asset-input"
              placeholder="0"
              value=${this.asset ? this.amount : null}
              @input=${(e: any) => {
                this._onInputChange(e);
                this._inputHandler();
              }} />
            <span class="asset-unit">${this.unit}</span>
          </span>
          ${when(
            this.amountUsd,
            () =>
              html`
                <span class="usd">≈ ${this.amountUsd} USD</span>
              `,
          )}
        </div>
      </div>
      <p class="asset-error">${this.error}</p>
    `;
  }
}
