import { html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { UIGCElement } from './base/UIGCElement';

@customElement('uigc-input')
export class Input extends UIGCElement {
  @property({ type: String }) type = 'text';
  @property({ type: String }) value = null;
  @property({ type: String }) placeholder = null;
  @property({ type: String }) step = null;
  @property({ type: String }) min = null;
  @property({ type: String }) max = null;

  static styles = [
    UIGCElement.styles,
    css`
      :host {
        width: 100%;
      }

      :host([fit]) .input-root {
        height: 100%;
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
        color: var(--uigc-input__placeholder-color);
      }

      ::-moz-placeholder {
        color: var(--uigc-input__placeholder-color);
      }

      ::-ms-placeholder {
        color: var(--uigc-input__placeholder-color);
      }

      ::placeholder {
        color: var(--uigc-input__placeholder-color);
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
        height: 54px;
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        -webkit-box-pack: center;
        justify-content: center;
        box-sizing: border-box;
        padding: 0 14px;
        background: var(--uigc-input-background);
        border-style: solid;
        border-radius: var(--uigc-input-border-radius);
        border-width: var(--uigc-input-border-width);
        border-color: var(--uigc-input-border-color);
      }

      .input-root:focus-within {
        border-color: var(--uigc-input-border-color__focus);
      }

      .input-root[error] {
        border: 1px solid var(--hex-red-300);
      }

      .input-root[error]:focus-within {
        border: 1px solid var(--hex-red-300);
      }

      .input-root:hover {
        background: var(--uigc-input-background__hover);
        transition: 0.2s ease-in-out;
      }
    `,
  ];

  onInputChange(e: any) {
    const input = this.shadowRoot.querySelector('input');
    this.value = e.target.value;
    const options = {
      bubbles: true,
      composed: true,
      detail: { value: this.value, valid: input.reportValidity() },
    };
    this.dispatchEvent(new CustomEvent('input-change', options));
  }

  override async firstUpdated() {
    const input = this.shadowRoot.querySelector('input');

    input.setAttribute('type', this.type);
    input.setAttribute('placeholder', this.placeholder);
    input.setAttribute('step', this.step);
    input.setAttribute('min', this.min);
    input.setAttribute('max', this.max);
  }

  override async updated() {
    const inputRoot = this.shadowRoot.querySelector('.input-root');
    const input = this.shadowRoot.querySelector('input');
    if (input.reportValidity()) {
      inputRoot.removeAttribute('error');
    } else {
      inputRoot.setAttribute('error', '');
    }
  }

  render() {
    return html`
      <div class="input-root">
        <input
          .value=${this.value}
          @input=${(e: any) => this.onInputChange(e)} />
      </div>
    `;
  }
}
