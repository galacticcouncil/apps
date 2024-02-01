import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';

import * as i18n from 'i18next';

import { baseStyles } from '../styles/base.css';
import {
  tradeSettingsCursor,
  TradeConfig,
  DEFAULT_TRADE_CONFIG,
} from '../../db';
import { DatabaseController } from '../../db.ctrl';

const SLIPPAGE_OPTS = ['0.1', '0.5', '1', '3'];
const SLIPPAGE_TWAP_OPTS = ['0.5', '1', '3', '5'];

@customElement('gc-trade-settings')
export class TradeSettings extends LitElement {
  protected settings = new DatabaseController<TradeConfig>(
    this,
    tradeSettingsCursor,
  );

  static styles = [
    baseStyles,
    css`
      :host {
        display: flex;
        flex-direction: column;
        height: 100%;
      }

      .content {
        overflow-y: auto;
      }

      .section {
        height: 40px;
        background: var(--uigc-app-bg-section);
        font-weight: 500;
        font-size: 14px;
        line-height: 19px;
        color: #acb2b5;
        padding: 0 14px;
        box-sizing: border-box;
        align-items: center;
        display: flex;
        top: 0px;
        position: sticky;
      }

      @media (min-width: 768px) {
        .section {
          padding: 0 28px;
        }
      }

      .settings {
        display: flex;
        flex-direction: column;
        padding: 14px;
        gap: 14px;
        box-sizing: border-box;
      }

      @media (min-width: 768px) {
        .settings {
          padding: 14px 28px 28px 28px;
        }
      }

      .settings .row {
        display: flex;
        align-items: center;
        height: 30px;
        position: relative;
        justify-content: space-between;
      }

      .settings .label {
        font-weight: 500;
        font-size: 16px;
        line-height: 22px;
        color: var(--hex-white);
      }

      .settings .desc {
        font-style: normal;
        font-weight: 400;
        font-size: 14px;
        line-height: 150%;
        color: var(--uigc-app-font-color__alternative);
      }

      .settings .slippage-input {
        margin-left: 8px;
        text-align: right;
      }

      .actions {
        display: flex;
        padding: 22px 28px;
        box-sizing: border-box;
        justify-content: space-between;
      }

      .adornment {
        white-space: nowrap;
        font-weight: 500;
        font-size: 14px;
        line-height: 14px;
        color: #ffffff;
      }

      .endAdornment {
        white-space: nowrap;
        font-weight: 500;
        font-size: 18px;
        line-height: 14px;
        color: #ffffff;
      }
    `,
  ];

  private onChange(value: any, propName: any) {
    const settings = this.settings.state;
    const currentValue = settings[propName];
    if (currentValue == value) {
      return;
    }

    if (value) {
      tradeSettingsCursor.resetIn([propName], value);
    } else {
      const defaultValue = DEFAULT_TRADE_CONFIG[propName];
      this[propName] = defaultValue;
      tradeSettingsCursor.resetIn([propName], defaultValue);
    }
  }

  onSlippageChange({ detail: { value } }) {
    this.onChange(value, 'slippage');
    const options = {
      bubbles: true,
      composed: true,
    };
    this.dispatchEvent(new CustomEvent('slippage-change', options));
  }

  onSlippageTwapChange({ detail: { value } }) {
    this.onChange(value, 'slippageTwap');
    const options = {
      bubbles: true,
      composed: true,
    };
    this.dispatchEvent(new CustomEvent('slippage-change', options));
  }

  formSlippageTemplate() {
    const { slippage } = this.settings.state;
    const slippageOpts = new Set(SLIPPAGE_OPTS);
    const custom = slippageOpts.has(slippage) ? null : slippage;

    return html` <div class="settings">
      <uigc-toggle-button-group
        value=${slippage}
        @toggle-button-click=${(e: CustomEvent) => this.onSlippageChange(e)}
        @input-change=${(e: CustomEvent) => this.onSlippageChange(e)}
      >
        ${SLIPPAGE_OPTS.map(
          (s: string) =>
            html` <uigc-toggle-button value=${s}>${s}%</uigc-toggle-button> `,
        )}
        <uigc-textfield field number .min=${0} .max=${100} .value=${custom}>
          <span class="endAdornment" slot="endAdornment">%</span>
        </uigc-textfield>
      </uigc-toggle-button-group>
      <div class="desc">${i18n.t('trade.settings.slippageInfo1')}</div>
      <div class="desc">${i18n.t('trade.settings.slippageInfo2')}</div>
    </div>`;
  }

  formSlippageTwapTemplate() {
    const { slippageTwap } = this.settings.state;
    const slippageOpts = new Set(SLIPPAGE_TWAP_OPTS);
    const custom = slippageOpts.has(slippageTwap) ? null : slippageTwap;

    return html` <div class="settings">
      <uigc-toggle-button-group
        value=${slippageTwap}
        @toggle-button-click=${(e: CustomEvent) => this.onSlippageTwapChange(e)}
        @input-change=${(e: CustomEvent) => this.onSlippageTwapChange(e)}
      >
        ${SLIPPAGE_TWAP_OPTS.map(
          (s: string) =>
            html` <uigc-toggle-button value=${s}>${s}%</uigc-toggle-button> `,
        )}
        <uigc-textfield field number .min=${0} .max=${100} .value=${custom}>
          <span class="endAdornment" slot="endAdornment">%</span>
        </uigc-textfield>
      </uigc-toggle-button-group>
    </div>`;
  }

  render() {
    return html`
      <slot name="header"></slot>
      <div class="content">
        <div class="section">${i18n.t('trade.settings.single')}</div>
        ${this.formSlippageTemplate()}
        <div class="section">${i18n.t('trade.settings.twap')}</div>
        ${this.formSlippageTwapTemplate()}
      </div>
    `;
  }
}
