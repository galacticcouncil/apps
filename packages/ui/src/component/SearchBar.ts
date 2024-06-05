import { html, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { UIGCElement } from './base/UIGCElement';

import './icons/Magnifier';

import styles from './SearchBar.css';

@customElement('uigc-search-bar')
export class SearchBar extends UIGCElement {
  @property({ type: String }) value = null;
  @property({ type: String }) placeholder = null;

  static styles = [UIGCElement.styles, unsafeCSS(styles)];

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
