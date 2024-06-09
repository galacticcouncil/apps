import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';

import { UIGCElement } from './base/UIGCElement';

import styles from './ToggleButtonGroup.css';

@customElement('uigc-toggle-button-group')
export class ToggleButtonGroup extends UIGCElement {
  @property({ type: String }) value = null;
  @property({ type: String }) label = null;

  static styles = [UIGCElement.styles, styles];

  override async updated() {
    const slot = this.shadowRoot.querySelector('slot');
    const slt = slot.assignedElements();
    slt.forEach((item) => {
      const value = item.getAttribute('value');
      if (value == this.value) {
        item.setAttribute('aria-pressed', 'true');
      } else {
        item.setAttribute('aria-pressed', 'false');
      }
    });
  }

  render() {
    return html`
      <div class="toggle-group-root">
        ${when(
          this.label,
          () =>
            html`
              <span class="label">${this.label}</span>
            `,
        )}
        <div>
          <slot></slot>
        </div>
      </div>
    `;
  }
}
