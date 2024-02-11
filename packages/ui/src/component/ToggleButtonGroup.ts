import { html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';

import { UIGCElement } from './base/UIGCElement';

@customElement('uigc-toggle-button-group')
export class ToggleButtonGroup extends UIGCElement {
  @property({ type: String }) value = null;
  @property({ type: String }) label = null;

  static styles = [
    UIGCElement.styles,
    css`
      :host(:not([variant])) .toggle-group-root div {
        gap: 8px;
        padding: 8px 10px;
      }

      :host([variant='dense']) .toggle-group-root div {
        gap: 4px;
        padding: 4px 5px;
      }

      .toggle-group-root div {
        display: flex;
      }

      .toggle-group-root {
        background: var(--uigc-toggle-button-group--root-background);
        border-radius: var(--uigc-toggle-button-group--root-border-radius);
        display: flex;
        flex-direction: column;
      }

      .label {
        color: #878c9e;
        font-size: 13px;
        font-style: normal;
        font-weight: 500;
        line-height: 100%;
        text-transform: uppercase;
        padding: 8px 0 0 10px;
      }
    `,
  ];

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
