import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';

import { themeStyles } from './styles/theme.css';
import { baseStyles } from './styles/base.css';

@customElement('ui-asset-switch')
export class AssetSwitch extends LitElement {
  static styles = [
    baseStyles,
    themeStyles,
    css`
      .switch-root {
        width: 43px;
        height: 43px;
        display: flex;
        justify-content: center;
        align-items: center;
        transition: all 0.3s ease-in-out 0s;
      }

      .switch-root:hover {
        cursor: pointer;
        transform: rotate(180deg);
      }
    `,
  ];

  onSwitchClick(e: any) {
    const options = {
      bubbles: true,
      composed: true,
    };
    this.dispatchEvent(new CustomEvent('asset-switch-clicked', options));
  }

  render() {
    return html`
      <div class="switch-root" @click=${this.onSwitchClick}>
        <img src="assets/img/icon/switch.svg" alt="switch" />
      </div>
    `;
  }
}
