import { html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { UIGCElement } from './base/UIGCElement';

@customElement('uigc-switch')
export class Switch extends UIGCElement {
  @property({ type: Boolean, reflect: true }) checked = false;
  @property({ type: Boolean, reflect: true }) highlight = false;

  static styles = [
    UIGCElement.styles,
    css`
      :host {
        --hue: 0;
        --deg: 0deg;
      }

      .switch-root {
        width: 46px;
        height: 24px;
      }

      .switch-thumb {
        width: 20px;
        height: 20px;
        border-width: 1px;
      }

      .switch-root {
        position: relative;
        border: var(--uigc-switch--root-border);
        border-radius: var(--uigc-switch--root-border-radius);
        background: var(--uigc-switch--root-background);
        cursor: pointer;
      }

      .switch-root:hover > span.switch-thumb {
        border-color: var(--uigc-switch--thumb-border-color__hover);
      }

      .switch-thumb {
        position: absolute;
        border-radius: var(--uigc-switch--root-border-radius);
        top: 1px;
        left: 1px;
        border-color: var(--uigc-switch--thumb-border-color);
        background: var(--uigc-switch--thumb-background);
        border-style: solid;
      }

      :host([checked]) .switch-root {
        background: var(--uigc-switch__checked--root-background);
        border: var(--uigc-switch__checked--root-border);
      }

      :host([checked]) .switch-thumb {
        left: initial;
        right: 1px;
        background: var(--uigc-switch__checked--thumb-background);
        border-color: var(--uigc-switch__checked--thumb-border-color);
      }

      @keyframes rotate {
        100% {
          transform: rotate(1turn);
        }
      }

      .switch-glow {
        display: none;
        width: calc(100% + 2px);
        height: calc(100% + 2px);
      }

      :host([highlight]:not([checked])) .switch-glow {
        display: block;
        position: absolute;
        top: -1px;
        left: -1px;
        overflow: hidden;
        border-radius: var(--uigc-switch--root-border-radius);
        box-shadow: 0px 0px 10px 4px rgba(7, 151, 255, 0.49);
      }

      :host([highlight]:not([checked])) .switch-glow::before {
        content: '';
        position: absolute;
        left: -50%;
        top: -50%;
        width: 200%;
        height: 200%;
        background-color: var(--uigc-switch--root-border);
        background-repeat: no-repeat;
        background-position: 0 0;
        background-image: conic-gradient(transparent, #57b3eb, #70c9ff 80%);
        animation: rotate 3s linear infinite;
      }

      :host([highlight]:not([checked])) .switch-glow::after {
        content: '';
        position: absolute;
        left: 1px;
        top: 1px;
        width: calc(100% - 2px);
        height: calc(100% - 2px);
        background: var(--uigc-switch--root-background);
        border-radius: var(--uigc-switch--root-border-radius);
      }

      :host([disabled]) .switch-root {
        pointer-events: none;
      }

      :host([disabled]) .switch-thumb {
        background: var(--hex-background-gray-800);
      }
    `,
  ];

  override async updated() {
    const switchRoot = this.shadowRoot.querySelector('.switch-root');
    if (this.checked) {
      switchRoot.removeAttribute('checked');
    } else {
      switchRoot.setAttribute('checked', '');
    }

    if (this.highlight) {
      switchRoot.removeAttribute('highlight');
    } else {
      switchRoot.setAttribute('highlight', '');
    }
  }

  render() {
    return html`
      <div class="switch-root">
        <span class="switch-glow"></span>
        <span class="switch-thumb"></span>
      </div>
    `;
  }
}
