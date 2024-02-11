import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('uigc-range-button-group')
export class RangeButtonGroup extends LitElement {
  @property({ type: String }) selected = null;

  static styles = [
    css`
      .toggle-group-root {
        display: inline-flex;
        background: rgba(158, 167, 186, 0.06);
        padding: 3px 6px;
        gap: 6px;
      }
    `,
  ];

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
