import { html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';
import { choose } from 'lit/directives/choose.js';

import { UIGCElement } from './base/UIGCElement';

import './icons/Success';
import './icons/Error';
import './CircularProgress';

export enum AlertVariant {
  success = 'success',
  error = 'error',
  progress = 'progress',
  default = '',
}

const VARIANTS: AlertVariant[] = [AlertVariant.success, AlertVariant.error, AlertVariant.progress];

@customElement('ui-alert')
export class Alert extends UIGCElement {
  static styles = [
    UIGCElement.styles,
    css`
      :host {
        background: var(--hex-background-gray-1000);
        border-radius: 12px;
        display: flex;
        align-items: center;
        padding: 8px 14px;
        color: rgb(255, 255, 255);
      }

      .icon {
        margin-right: 12px;
        /* width: 30px;
        height: 30px; */
      }

      ui-circular-progress {
        width: 31px;
        height: 28px;
      }

      div.message {
        width: 100%;
        padding: 8px 0;
        display: flex;
        flex-direction: column;

        font-weight: 500;
        font-size: 12px;
        line-height: 16px;
        color: var(--hex-neutral-gray-100);
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
        () => html`
          ${choose(this.variant, [
            [AlertVariant.success, () => html`<icon-success class="icon"></icon-success>`],
            [AlertVariant.error, () => html`<icon-error class="icon"></icon-error>`],
            [
              AlertVariant.progress,
              () => html`<ui-circular-progress size="medium" class="icon"></ui-circular-progress>`,
            ],
          ])}
        `
      )}
      <div class="message">
        <slot></slot>
      </div>
    `;
  }
}
