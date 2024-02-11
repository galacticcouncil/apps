import { html, css } from 'lit';
import { customElement } from 'lit/decorators.js';

import { UIGCElement } from './base/UIGCElement';

@customElement('uigc-button')
export class Button extends UIGCElement {
  static styles = [
    UIGCElement.styles,
    css`
      :host([size='small']) .button-root {
        padding: 12px 15px;
        font-size: 12px;
      }

      :host(:not([size])) .button-root,
      :host([size='medium']) .button-root {
        padding: 16px 36px;
        font-size: 14px;
      }

      :host([size='micro']) .button-root {
        padding: 2px 10px;
        font-size: 12px;
        line-height: 16px;
      }

      :host([fullwidth]) .button-root {
        width: 100%;
      }

      :host([nowrap]) .button-root {
        white-space: nowrap;
      }

      :host([variant='primary']) .button-root:before {
        background: var(--uigc-button__primary-background__before);
      }

      :host([variant='primary']) .button-root {
        color: var(--uigc-button__primary-color);
        background: var(--uigc-button__primary-background);
      }

      :host([variant='primary'][disabled]) .button-root {
        background: var(--uigc-button__primary-background__disabled);
        color: var(--uigc-button__primary-color__disabled);
        border: var(--uigc-button__disabled-border);
      }

      :host([variant='primary']) .button-root:hover {
        background: var(--uigc-button__primary-background__hover);
        transition: 0.2s ease-in-out;
        box-shadow: var(--uigc-button__primary-box-shadow__hover);
        transform: var(--uigc-button__primary-transform__hover);
      }

      :host([variant='secondary']) .button-root {
        color: var(--uigc-button__secondary-color);
        background: var(--uigc-button__secondary-background);
        border: var(--uigc-button__secondary-border);
      }

      :host([variant='secondary'][disabled]) .button-root {
        background: var(--uigc-button__secondary-background__disabled);
        color: var(--uigc-button__secondary-color__disabled);
        border: var(--uigc-button__disabled-border);
      }

      :host([variant='secondary']) .button-root:hover {
        color: var(--uigc-button__secondary-color__hover);
        background: var(--uigc-button__secondary-background__hover);
        border: var(--uigc-button__secondary-border__hover);
        transition: 0.2s ease-in-out;
      }

      :host([variant='error']) .button-root {
        color: var(--uigc-button__error-color);
        background: var(--uigc-button__error-background);
        border: var(--uigc-button__error-border);
      }

      :host([variant='error'][disabled]) .button-root {
        background: var(--uigc-button__error-background__disabled);
        color: var(--uigc-button__error-color__disabled);
        border: var(--uigc-button__disabled-border);
      }

      :host([variant='error']) .button-root:hover {
        color: var(--uigc-button__error-color__hover);
        background: var(--uigc-button__error-background__hover);
        border: var(--uigc-button__error-border__hover);
        transition: 0.2s ease-in-out;
      }

      :host([variant='info']) .button-root:before {
        background: var(--uigc-button__primary-background__before);
      }

      :host([variant='info']) .button-root {
        color: var(--uigc-button__info-color);
        background: var(--uigc-button__info-background);
      }

      :host([variant='info'][disabled]) .button-root {
        background: var(--uigc-button__info-background__disabled);
        color: var(--uigc-button__info-color__disabled);
        border: var(--uigc-button__disabled-border);
      }

      :host([variant='info']) .button-root:hover {
        background: var(--uigc-button__info-background__hover);
        transition: 0.2s ease-in-out;
        box-shadow: var(--uigc-button__info-box-shadow__hover);
        transform: var(--uigc-button__info-transform__hover);
      }

      :host([variant='max']) .button-root {
        color: #fff;
        background: rgba(var(--rgb-white), 0.06);
        font-weight: 600;
        text-transform: var(--uigc-button__max-text-transform);
      }

      :host([variant='max'][disabled]) .button-root {
        opacity: 0.2;
      }

      :host([variant='max']) .button-root:hover {
        background: rgba(var(--rgb-white), 0.15);
        transition: 0.2s ease-in-out;
      }

      .button-root {
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        border-radius: var(--uigc-button-border-radius);
        font-weight: 700;
        font-size: 16px;
        border: none;
        cursor: pointer;
        text-transform: uppercase;
        line-height: 18px;
        transition: 0.2s ease-in-out;
        transform-style: preserve-3d;
      }

      :host([disabled]) .button-root {
        cursor: not-allowed;
        pointer-events: none;
        opacity: var(--uigc-button__disabled-opacity);
      }

      .button-root:hover {
        transition: 0.2s ease-in-out;
      }

      :host([disabled]) .button-root:before {
        content: none;
      }

      .button-root:before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        width: 100%;
        border-radius: var(--uigc-button-border-radius);
        transform: translate3d(0px, 0px, -1px);
        -webkit-transition: 0.2s ease-in-out;
        transition: 0.2s ease-in-out;
      }

      .button-root:hover:before {
        transform: translate3d(5px, 5px, -1px);
      }
    `,
  ];

  render() {
    return html`
      <button type="button" class="button-root">
        <slot name="icon"></slot>
        <slot></slot>
        <slot name="endIcon"></slot>
      </button>
    `;
  }
}
