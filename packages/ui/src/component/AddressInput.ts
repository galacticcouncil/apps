import { html, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';

import { UIGCElement } from './base/UIGCElement';

import './icons/Identity';
import './icons/Paste';
import './icons/Close';
import './IconButton';

import styles from './AddressInput.css';

@customElement('uigc-address-input')
export class AddressInput extends UIGCElement {
  @property({ type: String }) title = null;
  @property({ type: String }) address = null;
  @property({ type: String }) id = null;
  @property({ type: String }) error = null;

  static styles = [UIGCElement.styles, unsafeCSS(styles)];

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
