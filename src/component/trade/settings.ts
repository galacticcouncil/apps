import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';

import * as i18n from 'i18next';

import { baseStyles } from '../styles/base.css';
import {
  tradeSettingsCursor,
  DEFAULT_TRADE_CONFIG,
  TradeConfig,
} from '../../db';
import { DatabaseController } from '../../db.ctrl';

import { debounce } from 'ts-debounce';
import IMask from 'imask';

const SLIPPAGE_OPTS = ['0.1', '0.5', '1', '3'];

@customElement('gc-trade-settings')
export class TradeSettings extends LitElement {
  protected settings = new DatabaseController<TradeConfig>(
    this,
    tradeSettingsCursor,
  );
  private _slippageHandler = null;
  private _slippageMask = null;

  @state() slippage: String = null;
  @state() customSlippage: String = null;

  constructor() {
    super();
    this.init();
    this.initSlippage();
    this._slippageHandler = debounce(this.onSlippageChange, 300);
  }

  private init() {
    const { slippage } = this.settings.state;
    this.slippage = slippage;
  }

  private initSlippage() {
    const slippageOpts = new Set(SLIPPAGE_OPTS);
    const slippage = this.slippage as string;
    if (!slippageOpts.has(slippage)) {
      this.customSlippage = slippage;
    }
  }

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

  onSlippageChange() {
    const value = this.customSlippage
      ? this._slippageMask.unmaskedValue
      : this.slippage;
    this.onChange(value, 'slippage');

    const options = {
      bubbles: true,
      composed: true,
    };
    this.dispatchEvent(new CustomEvent('slippage-changed', options));
  }

  onBackClick(e: any) {
    const options = {
      bubbles: true,
      composed: true,
    };
    this.dispatchEvent(new CustomEvent('back-clicked', options));
  }

  override update(changedProperties: Map<string, unknown>) {
    if (changedProperties.has('customSlippage') && this._slippageMask) {
      if (this.customSlippage) {
        this._slippageMask.unmaskedValue = this.customSlippage;
      } else {
        this._slippageMask.unmaskedValue = '';
      }
    }
    super.update(changedProperties);
  }

  override async firstUpdated() {
    const slippageInput = this.shadowRoot.getElementById('slippage');
    this._slippageMask = IMask(slippageInput, {
      mask: Number,
      scale: 1,
      signed: false,
      padFractionalZeros: false,
      normalizeZeros: true,
      radix: '.',
      mapToRadix: ['.'],
      min: 0,
      max: 100,
    });
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    if (this._slippageMask) {
      this._slippageMask.destroy();
    }
  }

  formSlippageTemplate() {
    return html` <div class="settings">
      <div class="row">
        <span class="label">${i18n.t('trade.settings.autoSlippage')}</span>
        <uigc-switch size="small" disabled></uigc-switch>
      </div>
      <uigc-toggle-button-group
        value=${this.slippage}
        @toggle-button-clicked=${(e: CustomEvent) => {
          this.slippage = e.detail.value;
          this.customSlippage = null;
          this._slippageHandler();
        }}
        @input-changed=${(e: CustomEvent) => {
          this.slippage = e.detail.value;
          this.customSlippage = e.detail.value;
          this._slippageHandler();
        }}
      >
        ${SLIPPAGE_OPTS.map(
          (s: string) =>
            html` <uigc-toggle-button value=${s}>${s}%</uigc-toggle-button> `,
        )}
        <uigc-input
          id="slippage"
          class="slippage-input"
          type="text"
          value=${this.customSlippage}
          placeholder="${i18n.t('trade.settings.custom')}"
        ></uigc-input>
      </uigc-toggle-button-group>
      <div class="desc">${i18n.t('trade.settings.slippageInfo1')}</div>
      <div class="desc">${i18n.t('trade.settings.slippageInfo2')}</div>
    </div>`;
  }

  render() {
    return html`
      <slot name="header"></slot>
      <div class="content">
        <div class="section">${i18n.t('trade.settings.slippage')}</div>
        ${this.formSlippageTemplate()}
      </div>
    `;
  }
}
