import { html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';

import { UIGCElement } from './base/UIGCElement';
import { CloseableElement } from './base/closeableElement';

import '../component/Backdrop';

@customElement('ui-dialog')
export class Dialog extends CloseableElement {
  @property({ type: Boolean }) open = true;

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
        background: var(--hex-background-gray-900);
        box-shadow: 0px 38px 46px rgba(0, 0, 0, 0.03);
        box-sizing: border-box;
        border-radius: 16px;
      }

      @media (min-width: 768px) {
        .dialog-root {
          width: 460px;
          height: 454px;
          left: calc(50% - 460px / 2 + 0.5px);
          top: calc(50% - 454px / 2 + 3.5px);
        }
      }

      ui-progress {
        position: absolute;
        width: 100%;
        bottom: 0;
      }
    `,
  ];

  render() {
    return html`
      <div class="dialog-root">
        <slot></slot>
        ${when(this.timeout, () => html` <ui-progress .duration=${this.timeout}></ui-progress> `)}
      </div>
      <ui-backdrop active></ui-backdrop>
    `;
  }
}
