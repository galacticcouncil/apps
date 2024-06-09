import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { UIGCElement } from './base/UIGCElement';

import styles from './Input.css';

@customElement('uigc-input')
export class Input extends UIGCElement {
  @property({ type: String }) type = 'text';
  @property({ type: String }) value = null;
  @property({ type: String }) placeholder = null;
  @property({ type: String }) step = null;
  @property({ type: String }) min = null;
  @property({ type: String }) max = null;

  static styles = [UIGCElement.styles, styles];

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
