import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';

import { themeStyles } from './styles/theme.css';
import { baseStyles } from './styles/base.css';

@customElement('ui-drawer')
export class Drawer extends LitElement {
  @property({ type: Boolean, reflect: true }) open = false;

  static styles = [
    baseStyles,
    themeStyles,
    css`
      .drawer {
        position: fixed;
        display: flex;
        flex-direction: column;
        z-index: 1401;
        width: 400px;
        top: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(255, 255, 255, 1);
        -webkit-transform: translateX(105%);
        -moz-transform: translateX(105%);
        -ms-transform: translateX(105%);
        -o-transform: translateX(105%);
        transform: translateX(105%);
        -webkit-transition: -webkit-transform 0.5s ease-out;
        -moz-transition: transform 0.5s ease-out;
        -o-transition: transform 0.5s ease-out;
        transition: transform 0.5s ease-out;
        align-items: center;
        background: var(--hex-background-gray-900);
        box-shadow: 0px 0px 61px rgba(0, 0, 0, 0.36);
        border-radius: 16px;
        margin: 10px;
        padding: 8px;
      }

      ::slotted(*) {
        width: 100%;
        box-sizing: border-box;
      }

      .header {
        display: flex;
        justify-content: center;
        padding: 22px 28px;
        box-sizing: border-box;
        align-items: center;
        line-height: 40px;
        font-style: normal;
        font-weight: 500;
        font-size: 16px;
        color: var(--hex-neutral-gray-100);
        width: 100%;
      }

      .content {
        overflow-y: auto;
      }

      .open {
        -moz-transform: translateX(0);
        -ms-transform: translateX(0);
        -o-transform: translateX(0);
        -webkit-transform: translateX(0);
        transform: translateX(0);
      }
    `,
  ];

  private shouldClose(): void {
    const applyDefault = this.dispatchEvent(
      new CustomEvent('drawer-close', {
        bubbles: true,
        composed: true,
        cancelable: true,
      })
    );
    if (applyDefault) {
      this.close();
    }
  }

  public close(): void {
    this.open = false;
  }

  render() {
    const classes = {
      drawer: true,
      open: this.open,
    };
    return html`
      <div class=${classMap(classes)}>
        <div class="header">
          <slot name="title"></slot>
          <span class="grow"></span>
          <ui-icon-button @click=${() => this.shouldClose()}>
            <img src="assets/img/icon/close.svg" alt="close" />
          </ui-icon-button>
        </div>
        <div class="content">
          <slot></slot>
        </div>
      </div>
    `;
  }
}
