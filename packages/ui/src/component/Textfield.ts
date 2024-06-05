import { html, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';

import { UIGCElement } from './base/UIGCElement';
import { textMask } from './types/InputConfig';
import { debounce } from 'ts-debounce';
import IMask from 'imask';

import styles from './Textfield.css';

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

  static styles = [UIGCElement.styles, unsafeCSS(styles)];

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
              ?disabled=${this.disabled}
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
