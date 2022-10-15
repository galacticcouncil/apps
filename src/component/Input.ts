import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { themeStyles } from './styles/theme.css';
import { baseStyles } from './styles/base.css';

@customElement('ui-input')
export class Input extends LitElement {
  @property({ type: String }) type = 'text';
  @property({ type: String }) value = null;
  @property({ type: String }) placeholder = null;
  @property({ type: String }) min = null;
  @property({ type: String }) max = null;

  static styles = [
    baseStyles,
    themeStyles,
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

      /* Placeholder color */
      ::-webkit-input-placeholder {
        color: rgba(var(--rgb-primary-100), 0.4);
      }

      ::-moz-placeholder {
        color: rgba(var(--rgb-primary-100), 0.4);
      }

      ::-ms-placeholder {
        color: rgba(var(--rgb-primary-100), 0.4);
      }

      ::placeholder {
        color: rgba(var(--rgb-primary-100), 0.4);
      }

      input {
        width: 100%;
        background: none;
        border: none;
        color: var(--hex-white);
        font-weight: 500;
        font-size: 14px;
        line-height: 100%;
        padding: 0px;
        box-sizing: border-box;
      }

      .input-root {
        width: 100%;
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
        box-sizing: border-box;
      }

      .input-root:focus-within {
        border: 1px solid var(--hex-primary-300);
      }

      .input-root[error] {
        border: 1px solid var(--hex-red-300);
      }

      .input-root[error]:focus-within {
        border: 1px solid var(--hex-red-300);
      }

      .input-root:hover {
        background: rgba(var(--rgb-white), 0.12);
      }
    `,
  ];

  async firstUpdated() {
    const input = this.shadowRoot.querySelector('input');
    input.setAttribute('type', this.type);
    input.setAttribute('placeholder', this.placeholder);
    input.setAttribute('min', this.min);
    input.setAttribute('max', this.max);
  }

  async updated() {
    const inputRoot = this.shadowRoot.querySelector('.input-root');
    const input = this.shadowRoot.querySelector('input');
    if (input.reportValidity()) {
      inputRoot.removeAttribute('error');
    } else {
      inputRoot.setAttribute('error', '');
    }
  }

  onInputChange(e: any) {
    const input = this.shadowRoot.querySelector('input');
    this.value = e.target.value;
    const options = {
      bubbles: true,
      composed: true,
      detail: { value: this.value, valid: input.reportValidity() },
    };
    this.dispatchEvent(new CustomEvent('input-changed', options));
  }

  render() {
    return html`
      <div class="input-root">
        <input .value=${this.value} @input=${(e: any) => this.onInputChange(e)} />
      </div>
    `;
  }
}
