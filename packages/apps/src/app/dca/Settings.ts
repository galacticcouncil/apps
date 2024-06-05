import { LitElement, html, unsafeCSS } from 'lit';
import { customElement } from 'lit/decorators.js';

import * as i18n from 'i18next';

import { DatabaseController, DcaConfig, DcaConfigCursor, DCA_CONFIG } from 'db';
import { baseStyles } from 'styles';

import styles from './Settings.css';

const SLIPPAGE_OPTS = ['1', '1.5', '3', '5'];

@customElement('gc-dca-settings')
export class DcaSettings extends LitElement {
  protected dcaConfig = new DatabaseController<DcaConfig>(
    this,
    DcaConfigCursor,
  );

  static styles = [unsafeCSS(baseStyles), unsafeCSS(styles)];

  private onChange(value: any, propName: any) {
    const config = this.dcaConfig.state;
    const currentValue = config[propName];
    if (currentValue == value) {
      return;
    }

    if (value) {
      DcaConfigCursor.resetIn([propName], value);
    } else {
      const defaultValue = DCA_CONFIG[propName];
      this[propName] = defaultValue;
      DcaConfigCursor.resetIn([propName], defaultValue);
    }
  }

  onSlippageChange({ detail: { value } }) {
    this.onChange(value, 'slippage');
    const options = {
      bubbles: true,
      composed: true,
    };
    this.dispatchEvent(new CustomEvent('settings-change', options));
  }

  onMaxRetriesChange({ detail: { value } }) {
    if (value !== '') {
      this.onChange(value, 'maxRetries');
    }
    const options = {
      bubbles: true,
      composed: true,
    };
    this.dispatchEvent(new CustomEvent('settings-change', options));
  }

  formSlippageTemplate() {
    const { slippage, maxRetries } = this.dcaConfig.state;
    const slippageOpts = new Set(SLIPPAGE_OPTS);
    const custom = slippageOpts.has(slippage) ? null : slippage;

    return html`
      <div class="settings">
        <uigc-toggle-button-group
          value=${slippage}
          label=${i18n.t('settings.slippage')}
          @toggle-button-click=${(e: CustomEvent) => this.onSlippageChange(e)}
          @input-change=${(e: CustomEvent) => this.onSlippageChange(e)}>
          ${SLIPPAGE_OPTS.map(
            (s: string) =>
              html`
                <uigc-toggle-button value=${s}>${s}%</uigc-toggle-button>
              `,
          )}
          <uigc-textfield field number .min=${0} .max=${100} .value=${custom}>
            <span class="endAdornment" slot="endAdornment">%</span>
          </uigc-textfield>
        </uigc-toggle-button-group>
        <div class="desc">${i18n.t('settings.slippageInfo1')}</div>
        <uigc-textfield
          field
          number
          .min=${0}
          .max=${10}
          .placeholder=${maxRetries}
          .value=${maxRetries}
          @input-change=${(e: CustomEvent) => this.onMaxRetriesChange(e)}>
          <span class="adornment" slot="inputAdornment">
            ${i18n.t('settings.maxRetries')}
          </span>
        </uigc-textfield>
      </div>
    `;
  }

  render() {
    return html`
      <slot name="header"></slot>
      ${this.formSlippageTemplate()}
    `;
  }
}
