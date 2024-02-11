import { html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';

import { UIGCElement } from './base/UIGCElement';

import './icons/Identity';
import './icons/Paste';
import './icons/Close';
import './IconButton';

@customElement('uigc-address-input')
export class AddressInput extends UIGCElement {
  @property({ type: String }) title = null;
  @property({ type: String }) address = null;
  @property({ type: String }) id = null;
  @property({ type: String }) error = null;

  static styles = [
    UIGCElement.styles,
    css`
      .address-root {
        display: grid;
        background: var(--uigc-field-background);
        border-radius: var(--uigc-field-border-radius);
        border-bottom: var(--uigc-field-border-bottom);
        box-sizing: border-box;
        padding: var(--uigc-field-padding);
        row-gap: var(--uigc-field-row-gap);
      }

      :host([error]) .address-root {
        border: var(--uigc-field__error-border);
        border-width: var(--uigc-field__error-border-width);
        outline: var(--uigc-field__error-outline);
        outline-offset: -1px;
      }

      .address-root:focus,
      .address-root:focus-visible,
      .address-root:focus-within,
      .address-root:hover {
        border-bottom: var(--uigc-field-border-bottom__hover);
        background: var(--uigc-address-input-background__hover);
        transition: 0.2s ease-in-out;
      }

      :host([error]) .address-root:focus,
      :host([error]) .address-root:focus-visible,
      :host([error]) .address-root:focus-within,
      :host([error]) .address-root:hover {
        background: rgba(255, 75, 75, 0.1);
        transition: 0.2s ease-in-out;
      }

      /* Placeholder color */
      ::-webkit-input-placeholder {
        color: var(--uigc-address-input__placeholder-color);
      }

      ::-moz-placeholder {
        color: var(--uigc-address-input__placeholder-color);
      }

      ::-ms-placeholder {
        color: var(--uigc-address-input__placeholder-colorr);
      }

      ::placeholder {
        color: var(--uigc-address-input__placeholder-color);
      }

      .title {
        display: flex;
        align-items: center;
        color: var(--uigc-chain-selector--title-color);
        font-weight: var(--uigc-chain-selector--title-font-weight);
        font-size: var(--uigc-field--title-font-size);
        line-height: var(--uigc-field--title-line-height);
        text-transform: var(--uigc-field--title-text-transform);
      }

      .address {
        display: flex;
        flex-direction: row;
        align-items: center;
      }

      .address-error {
        color: var(--uigc-field__error-color);
        line-height: 16px;
        margin-top: 2px;
        font-size: 12px;
      }

      .input-root {
        width: 100%;
        display: flex;
        flex-direction: column;
        -webkit-box-pack: center;
        justify-content: center;
        box-sizing: border-box;
        padding: 0 14px;
        min-height: 50px;
      }

      .input-root p {
        font-weight: 500;
        color: rgb(133, 209, 255);
        font-size: 12px;
        line-height: 16px;
        text-align: left;
        overflow-wrap: break-word;
        word-break: break-word;
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

      uigc-icon-paste {
        cursor: pointer;
      }

      ::slotted([slot='id']) {
        min-width: 32px;
        height: 32px;
        border-radius: 9999px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: var(--uigc-app-bg-id);
      }
    `,
  ];

  onInputClear() {
    this.address = null;
    const options = {
      bubbles: true,
      composed: true,
      detail: { address: null },
    };
    this.dispatchEvent(new CustomEvent('address-input-change', options));
  }

  onInputChange(e: any) {
    this.address = e.target.value;
    const options = {
      bubbles: true,
      composed: true,
      detail: { address: this.address },
    };
    this.dispatchEvent(new CustomEvent('address-input-change', options));
  }

  async onPasteClick() {
    this.address = await navigator.clipboard.readText();
    const options = {
      bubbles: true,
      composed: true,
      detail: { address: this.address },
    };
    this.dispatchEvent(new CustomEvent('address-input-change', options));
  }

  override async updated() {
    const defaultIdIcon: Element =
      this.shadowRoot.querySelector('uigc-icon-id');
    const slotId: HTMLSlotElement =
      this.shadowRoot.querySelector<HTMLSlotElement>('slot[name=id]');
    const slotNodes = slotId.assignedNodes();

    if (slotNodes.length > 0) {
      defaultIdIcon.setAttribute('style', 'display: none');
    } else {
      defaultIdIcon.setAttribute('style', 'display: block');
    }
  }

  render() {
    return html`
      <div tabindex="0" class="address-root">
        <span class="title">${this.title}</span>
        <div class="address">
          <uigc-icon-id></uigc-icon-id>
          <slot name="id"></slot>
          <div class="input-root">
            <input
              type="text"
              .value=${this.address}
              placeholder="Paste recipient address here"
              @input=${(e: any) => this.onInputChange(e)} />
          </div>
          ${when(
            this.address,
            () => html`
              <uigc-icon-button size="small">
                <uigc-icon-close
                  @click=${() => this.onInputClear()}></uigc-icon-close>
              </uigc-icon-button>
            `,
            () =>
              html`
                <uigc-icon-paste
                  @click=${() => this.onPasteClick()}></uigc-icon-paste>
              `,
          )}
        </div>
      </div>
      <p class="address-error">${this.error}</p>
    `;
  }
}
