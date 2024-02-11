import { html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';

import { UIGCElement } from './base/UIGCElement';
import { textMask } from './types/InputConfig';
import { debounce } from 'ts-debounce';
import IMask from 'imask';

@customElement('uigc-textfield')
export class Textfield extends UIGCElement {
  private _inputHandler = null;
  private _imask = null;

  @property({ type: String }) id = null;
  @property({ type: String }) value = null;
  @property({ type: String }) desc = null;
  @property({ type: String }) placeholder = null;
  @property({ type: String }) error = null;
  @property({ type: Number }) min = null;
  @property({ type: Number }) max = null;
  @property({ type: Boolean }) number = false;
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

      .textfield-root {
        display: flex;
        flex-direction: row;
        align-items: center;
        height: 54px;
        border-radius: var(--uigc-input-border-radius);
        border-width: var(--uigc-input-border-width);
        border-color: var(--uigc-input-border-color);
      }

      :host([error]) .textfield-root {
        border: var(--uigc-field__error-border);
        border-width: var(--uigc-field__error-border-width);
        outline: var(--uigc-field__error-outline);
        outline-offset: -1px;
        border-bottom: var(--uigc-field__error-border) !important;
      }

      :host([field]) .textfield-root {
        flex-direction: row;
        background: var(--uigc-textfield__field-background);
        border-width: var(--uigc-textfield__field-border-width);
        border-color: var(--uigc-textfield__field-border-color);
        border-style: solid;
        box-sizing: border-box;
        padding: var(--uigc-field-padding);
      }

      :host([disabled]) .textfield-root {
        border-width: 0;
      }

      :host(:not([disabled]):not([field])) .textfield-root {
        padding: var(--uigc-textfield-padding);
        background: var(--uigc-textfield-background);
        border-style: var(--uigc-textfield-border-style);
      }

      :host(:not([disabled]):not([field])) .textfield-root:focus-within {
        border-color: var(--uigc-input-border-color__focus);
      }

      :host(:not([disabled]):not([field])) .textfield-root:hover {
        background: var(--uigc-textfield-background__hover);
      }

      :host([field]:not([disabled])) .textfield-root:focus,
      :host([field]:not([disabled])) .textfield-root:focus-visible,
      :host([field]:not([disabled])) .textfield-root:focus-within,
      :host([field]:not([disabled])) .textfield-root:hover {
        border-color: var(--uigc-textfield__field-border-color__hover);
        background: var(--uigc-textfield__field-background__hover);
        transition: 0.2s ease-in-out;
      }

      :host([error]:not([disabled])) .textfield-root:focus,
      :host([error]:not([disabled])) .textfield-root:focus-visible,
      :host([error]:not([disabled])) .textfield-root:focus-within,
      :host([error]:not([disabled])) .textfield-root:hover {
        background: rgba(255, 75, 75, 0.1);
        transition: 0.2s ease-in-out;
      }

      .textfield-wrapper {
        width: 100%;
      }

      .textfield-field {
        width: 100%;
        display: flex;
        position: relative;
        -webkit-box-align: center;
        align-items: center;
        gap: 4px;
      }

      .textfield-error {
        color: var(--uigc-field__error-color);
        line-height: 16px;
        margin-top: 2px;
        font-size: 12px;
      }

      .textfield {
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

      @media (min-width: 520px) {
        .textfield {
          font-size: var(--uigc-textfield-font-size);
        }
      }

      .desc {
        display: flex;
        flex-direction: row-reverse;
        font-size: 10px;
        line-height: 14px;
        color: var(--hex-neutral-gray-400);
        font-weight: 600;
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
      detail: { value: unmasked, masked: masked },
    };
    this.dispatchEvent(new CustomEvent('input-change', options));
  }

  onWrapperClick(e: any) {
    this.shadowRoot.getElementById('textField').focus();
  }

  override update(changedProperties: Map<string, unknown>) {
    if (changedProperties.has('value') && this._imask) {
      if (this.value) {
        this._imask.unmaskedValue = this.value;
      } else {
        this._imask.unmaskedValue = '';
      }
    }
    super.update(changedProperties);
  }

  override async firstUpdated() {
    super.firstUpdated();
    const input = this.shadowRoot.getElementById('textField');
    const maskOpts = this.number
      ? {
          mask: Number,
          min: this.min,
          max: this.max,
          radix: '.',
        }
      : { mask: textMask };

    this._imask = IMask(input, maskOpts);
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    if (this._imask) {
      this._imask.destroy();
    }
  }

  render() {
    return html`
      <div class="textfield-root" @click="${this.onWrapperClick}}">
        <slot name="inputAdornment"></slot>
        <div class="textfield-wrapper">
          <span class="textfield-field">
            <input
              type="text"
              class="textfield"
              id="textField"
              placeholder=${this.placeholder}
              value=${this.value}
              @input=${(e: any) => {
                this._onInputChange(e);
                this._inputHandler();
              }} />
            <slot name="endAdornment"></slot>
          </span>
          ${when(
            this.desc,
            () =>
              html`
                <span class="desc">${this.desc}</span>
              `,
          )}
        </div>
      </div>
      <p class="textfield-error">${this.error}</p>
    `;
  }
}
