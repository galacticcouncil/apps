import { html, css } from 'lit';
import { customElement } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';

import { UIGCElement } from './base/UIGCElement';
import { CloseableElement } from './base/CloseableElement';

import './Backdrop';

@customElement('uigc-dialog')
export class Dialog extends CloseableElement {
  static styles = [
    UIGCElement.styles,
    css`
      .dialog-root {
        height: 100%;
        outline: 0px;
        display: flex;
        flex-direction: column;
        -webkit-box-pack: center;
        justify-content: center;
        -webkit-box-align: center;
        align-items: center;
        position: absolute;
        top: 0;
        z-index: 1202;
        overflow: hidden;
        padding: 0px 30px 30px;
        background: var(--uigc-dialog-background);
        box-shadow: var(--uigc-dialog-box-shadow);
        border-radius: var(--uigc-dialog-border-radius);
        box-sizing: border-box;
      }

      @media (min-width: 768px) {
        .dialog-root {
          width: 460px;
          height: 454px;
          left: calc(50% - 460px / 2 + 0.5px);
          top: calc(50% - 454px / 2 + 3.5px);
        }
      }

      uigc-progress {
        position: absolute;
        width: 100%;
        bottom: 0;
      }

      uigc-dialog-countdown {
        position: absolute;
        bottom: 14px;
      }
    `,
  ];

  render() {
    return html`
      <div class="dialog-root">
        <slot></slot>
        ${when(
          this.timeout,
          () => html`
            <uigc-dialog-countdown
              .timeout=${this.timeout}></uigc-dialog-countdown>
            <uigc-progress .duration=${this.timeout}></uigc-progress>
          `,
        )}
      </div>
      <uigc-backdrop active></uigc-backdrop>
    `;
  }
}
