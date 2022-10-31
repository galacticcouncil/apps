import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';

import { themeStyles } from './styles/theme.css';
import { baseStyles } from './styles/base.css';

export enum AlertVariant {
  success = 'success',
  error = 'error',
  progress = 'progress',
  default = '',
}

const VARIANTS: AlertVariant[] = [AlertVariant.success, AlertVariant.error, AlertVariant.progress];

@customElement('ui-alert')
export class Alert extends LitElement {
  static styles = [
    baseStyles,
    themeStyles,
    css`
      :host {
        background: var(--hex-background-gray-1000);
        border-radius: 12px;
        line-height: 1.5;
        display: flex;
        padding: 8px 14px;
        color: rgb(255, 255, 255);
      }

      img {
        margin-right: 12px;
      }

      span.message {
        width: 100%;
        padding: 8px 0;
        display: flex;
        flex-direction: column;

        font-weight: 500;
        font-size: 12px;
        line-height: 16px;
        color: var(--hex-neutral-gray-100);
      }

      .progress {
        display: inline-block;
        color: var(--hex-primary-300);
        -webkit-animation: animation-rotate 1.4s linear infinite;
        animation: animation-rotate 1.4s linear infinite;
      }

      @keyframes animation-rotate {
        0% {
          -webkit-transform: rotate(0deg);
          -moz-transform: rotate(0deg);
          -ms-transform: rotate(0deg);
          transform: rotate(0deg);
        }
        100% {
          -webkit-transform: rotate(360deg);
          -moz-transform: rotate(360deg);
          -ms-transform: rotate(360deg);
          transform: rotate(360deg);
        }
      }
    `,
  ];

  /**
   * The variant applies specific styling when set to `info`, `error`, or `warning`.
   * `variant` attribute is removed when not matching one of the above.
   *
   * @param {String} variant
   */
  @property({ type: String })
  public set variant(variant: AlertVariant) {
    if (variant === this.variant) {
      return;
    }

    const oldValue = this.variant;
    if (VARIANTS.includes(variant)) {
      this.setAttribute('variant', variant);
      this._variant = variant;
    } else {
      this.removeAttribute('variant');
      this._variant = AlertVariant.default;
    }
    this.requestUpdate('variant', oldValue);
  }

  public get variant(): AlertVariant {
    return this._variant;
  }

  private _variant: AlertVariant = AlertVariant.default;

  render() {
    return html`
      ${when(
        this.variant != AlertVariant.default,
        () => html` <img class=${this.variant} src=${'assets/img/icon/' + this.variant + '.svg'} alt="alert" /> `
      )}
      <span class="message">
        <slot></slot>
      </span>
    `;
  }
}
