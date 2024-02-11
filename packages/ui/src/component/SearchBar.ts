import { html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { UIGCElement } from './base/UIGCElement';

import './icons/Magnifier';

@customElement('uigc-search-bar')
export class SearchBar extends UIGCElement {
  @property({ type: String }) value = null;
  @property({ type: String }) placeholder = null;

  static styles = [
    UIGCElement.styles,
    css`
      :host {
        width: 100%;
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

      .search-root {
        width: 100%;
        display: flex;
        align-items: center;
        -webkit-box-pack: center;
        justify-content: center;
        box-sizing: border-box;
        padding: 0 14px;
        height: 54px;
        background: var(--uigc-input-background);
        border-style: solid;
        border-radius: var(--uigc-input-border-radius);
        border-width: var(--uigc-input-border-width);
        border-color: var(--uigc-input-border-color);
      }

      .search-root > uigc-icon-magnifier {
        margin-right: 8px;
        width: 22px;
      }

      .search-root:focus-within {
        border-color: var(--uigc-input-border-color__focus);
      }

      .search-root:hover {
        background: var(--uigc-input-background__hover);
        transition: 0.2s ease-in-out;
      }
    `,
  ];

  onInputChange(e: any) {
    this.value = e.target.value;
    const options = {
      bubbles: true,
      composed: true,
      detail: { value: this.value },
    };
    this.dispatchEvent(new CustomEvent('search-change', options));
  }

  override async firstUpdated() {
    const input = this.shadowRoot.querySelector('input');
    input.setAttribute('placeholder', this.placeholder);
  }

  render() {
    return html`
      <div class="search-root">
        <uigc-icon-magnifier></uigc-icon-magnifier>
        <input
          type="text"
          .value="${this.value}"
          @input=${this.onInputChange} />
      </div>
    `;
  }
}
