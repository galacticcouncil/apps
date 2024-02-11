import { html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';

import { UIGCElement } from './base/UIGCElement';

import './icons/Close';

@customElement('uigc-drawer')
export class Drawer extends UIGCElement {
  @property({ type: Boolean, reflect: true }) open = false;

  static styles = [
    UIGCElement.styles,
    css`
      .drawer {
        position: fixed;
        display: flex;
        flex-direction: column;
        z-index: 1401;
        width: 100%;
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
        background: var(--uigc-drawer-background);
        box-shadow: var(--uigc-drawer-box-shadow);
      }

      @media (min-width: 768px) {
        .drawer {
          width: 400px;
          border-radius: var(--uigc-drawer-border-radius);
          margin: 10px;
        }
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
        width: 100%;
        padding: 0 8px;
        box-sizing: border-box;
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
      }),
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
          <uigc-icon-button @click=${() => this.shouldClose()}>
            <uigc-icon-close></uigc-icon-close>
          </uigc-icon-button>
        </div>
        <div class="content">
          <slot></slot>
        </div>
      </div>
    `;
  }
}
