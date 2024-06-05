import { LitElement, html, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import styles from './ButtonGroup.css';

@customElement('uigc-range-button-group')
export class RangeButtonGroup extends LitElement {
  @property({ type: String }) selected = null;

  static styles = [unsafeCSS(styles)];

  override async updated() {
    const slot = this.shadowRoot.querySelector('slot');
    const slt = slot.assignedElements();
    slt.forEach((item) => {
      const value = item.getAttribute('value');
      if (value == this.selected) {
        item.setAttribute('selected', '');
      } else {
        item.removeAttribute('selected');
      }
    });
  }

  render() {
    return html`
      <div class="toggle-group-root">
        <slot></slot>
      </div>
    `;
  }
}
