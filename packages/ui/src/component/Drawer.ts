import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';

import { UIGCElement } from './base/UIGCElement';

import './icons/Close';

import styles from './Drawer.css';

@customElement('uigc-drawer')
export class Drawer extends UIGCElement {
  @property({ type: Boolean, reflect: true }) open = false;

  static styles = [UIGCElement.styles, styles];

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
