import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';

import { UIGCElement } from './base/UIGCElement';
import { priceMaskSettings } from './types/InputConfig';
import { debounce } from 'ts-debounce';

import IMask from 'imask';

import styles from './AssetInput.css';

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
  @property({ type: Boolean }) isActive = false;

  constructor() {
    super();
    this._inputHandler = debounce(this.onInputChange, 300);
  }

  static styles = [UIGCElement.styles, styles];

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
      if (this.isActive) {
        this.amount ? (this._imask.unmaskedValue = this.amount) : null; // null means intentional no-op; leave user input alone ¯\_(ツ)_/¯
      } else {
        this._imask.unmaskedValue = this.amount ?? '';
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
      <div class="asset-root" @click=${this.onWrapperClick}>
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
