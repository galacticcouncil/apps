import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { themeStyles } from './styles/theme.css';
import { baseStyles } from './styles/base.css';

@customElement('ui-toggle-button-group')
export class ToggleButtonGroup extends LitElement {
  @property({ type: String }) selected = null;

  static styles = [
    baseStyles,
    themeStyles,
    css`
      .toggle-group-root {
        background: rgba(var(--rgb-black), 0.25);
        border-radius: 11px;
        display: flex;
        gap: 8px;
        padding: 8px 10px;
      }
    `,
  ];

  async updated() {
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
