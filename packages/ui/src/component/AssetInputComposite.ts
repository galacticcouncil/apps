import { html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { UIGCElement } from './base/UIGCElement';

import './AssetInput';

@customElement('uigc-asset-cinput')
export class AssetInputComposite extends UIGCElement {
  @property({ type: String }) amount = null;
  @property({ type: String }) amountUsd = null;
  @property({ type: String }) asset = null;
  @property({ type: String }) unit = null;
  @property({ type: Boolean }) disabled = false;

  static styles = [
    UIGCElement.styles,
    css`
      .ninput-root {
        display: flex;
        flex-direction: row;
        background: var(--uigc-field-background);
        border-radius: var(--uigc-field-border-radius);
        border-bottom: var(--uigc-field-border-bottom);
        box-sizing: border-box;
        padding: var(--uigc-field-padding);
        gap: 10px;
      }

      @media (max-width: 480px) {
        .ninput-root {
          margin: var(--uigc-field-margin__sm);
        }
      }

      :host([error]) .ninput-root {
        border: var(--uigc-field__error-border);
        border-width: var(--uigc-field__error-border-width);
        outline: var(--uigc-field__error-outline);
        outline-offset: -1px;
      }

      :host(:not([disabled])) .ninput-root:focus,
      :host(:not([disabled])) .ninput-root:focus-visible,
      :host(:not([disabled])) .ninput-root:focus-within,
      :host(:not([disabled])) .ninput-root:hover {
        border-bottom: var(--uigc-field-border-bottom__hover);
        background: var(--uigc-field-background__hover);
        transition: 0.2s ease-in-out;
      }

      .title {
        display: flex;
        align-items: flex-start;
        flex-direction: column;
        justify-content: center;
      }
    `,
  ];

  render() {
    return html`
      <div class="ninput-root">
        <div class="title">
          <slot></slot>
        </div>
        <uigc-asset-input
          id=${this.id}
          .asset=${this.asset}
          .amount=${this.amount}
          .amountUsd=${this.amountUsd}
          .unit=${this.unit}
          ?disabled=${this.disabled}></uigc-asset-input>
      </div>
    `;
  }
}
