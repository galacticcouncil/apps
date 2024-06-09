import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';
import { choose } from 'lit/directives/choose.js';

import { UIGCElement } from './base/UIGCElement';

import './icons/Success';
import './icons/Error';
import './CircularProgress';

import styles from './Alert.css';

export enum AlertVariant {
  success = 'success',
  error = 'error',
  progress = 'progress',
  default = '',
}

const VARIANTS: AlertVariant[] = [
  AlertVariant.success,
  AlertVariant.error,
  AlertVariant.progress,
];

@customElement('uigc-alert')
export class Alert extends UIGCElement {
  static styles = [UIGCElement.styles, styles];

  /**
   * The variant applies specific styling when set to `success`, `error`, or `progress`.
   * `Variant` attribute is removed when not matching one of the above.
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
            [
              AlertVariant.success,
              () =>
                html`
                  <uigc-icon-success class="icon"></uigc-icon-success>
                `,
            ],
            [
              AlertVariant.error,
              () =>
                html`
                  <uigc-icon-error class="icon"></uigc-icon-error>
                `,
            ],
            [
              AlertVariant.progress,
              () =>
                html`
                  <uigc-circular-progress
                    size="medium"
                    class="icon"></uigc-circular-progress>
                `,
            ],
          ])}
        `,
      )}
      <div class="message">
        <slot></slot>
      </div>
    `;
  }
}
