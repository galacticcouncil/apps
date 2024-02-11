import { html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';

import { UIGCElement } from './base/UIGCElement';

import './AssetId';

@customElement('uigc-asset')
export class Asset extends UIGCElement {
  @property({ type: String }) symbol = null;
  @property({ type: String }) desc = null;
  @property({ type: Boolean, reflect: true }) multi = false;

  static styles = [
    UIGCElement.styles,
    css`
      :host {
        display: flex;
        flex-direction: row;
        align-items: center;
        background-color: transparent;
        height: 32px;
        border-radius: 8px;
        cursor: pointer;
      }

      span.code {
        font-weight: 700;
        font-size: 16px;
        line-height: 100%;
        color: var(--hex-white);
      }

      span.desc {
        font-weight: 500;
        font-size: 12px;
        line-height: 14px;
        color: var(--hex-neutral-gray-400);
        white-space: nowrap;
      }

      span.title {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: flex-start;
        padding: 5px 0px;
        margin-left: 6px;
      }

      ::slotted(*) {
        width: 30px;
        height: 30px;
      }

      ::slotted(*:not(:first-child)) {
        margin-left: -3px;
      }

      :host([multi]) ::slotted(*) {
        width: 26px;
        height: 26px;
      }

      :host([icon]) span.title {
        display: none;
      }
    `,
  ];

  override async updated() {
    const iconSlot: HTMLSlotElement = this.shadowRoot.querySelector('slot[name=icon]');
    const icons = iconSlot.assignedElements();

    if (icons.length > 1) {
      this.multi = true;
    } else {
      this.multi = false;
    }
  }

  render() {
    return html` <slot name="icon"></slot>
      <span class="title">
        <span class="code">${this.symbol}</span>
        ${when(this.desc, () => html` <span class="desc">${this.desc}</span> `)}
      </span>
      <slot></slot>`;
  }
}
