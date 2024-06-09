import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';

import * as i18n from 'i18next';

import {
  DatabaseController,
  TradeConfig,
  TradeConfigCursor,
  TRADE_CONFIG,
} from 'db';
import { baseStyles } from 'styles';

import styles from './Settings.css';

const SLIPPAGE_OPTS = ['0.1', '0.5', '1', '3'];

@customElement('gc-bonds-settings')
export class BondsSettings extends LitElement {
  protected tradeConfig = new DatabaseController<TradeConfig>(
    this,
    TradeConfigCursor,
  );

  static styles = [baseStyles, styles];

  private onChange(value: any, propName: any) {
    const config = this.tradeConfig.state;
    const currentValue = config[propName];
    if (currentValue == value) {
      return;
    }

    if (value) {
      TradeConfigCursor.resetIn([propName], value);
    } else {
      const defaultValue = TRADE_CONFIG[propName];
      this[propName] = defaultValue;
      TradeConfigCursor.resetIn([propName], defaultValue);
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

  formSlippageTemplate() {
    const { slippage } = this.tradeConfig.state;
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
        <div class="desc">${i18n.t('settings.slippageInfo2')}</div>
      </div>
    `;
  }

  render() {
    return html`
      <slot name="header"></slot>
      <div class="content">${this.formSlippageTemplate()}</div>
    `;
  }
}
