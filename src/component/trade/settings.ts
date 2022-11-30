import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

import { baseStyles } from '../base.css';
import { settingsCursor } from '../../db';

const SLIPPAGE_OPTS = ['0.1', '0.5', '1', '3'];

@customElement('gc-trade-app-settings')
export class Settings extends LitElement {
  @property({ type: Number }) slippage = null;
  @state() customSlippage: String = null;

  constructor() {
    super();
    this.initSlippage();
  }

  private initSlippage() {
    const slippageOpts = new Set(SLIPPAGE_OPTS);
    const slippage = settingsCursor.deref().slippage;
    this.slippage = slippage;
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

      .header {
        display: flex;
        justify-content: center;
        padding: 22px 28px;
        box-sizing: border-box;
        align-items: center;
        height: 84px;
      }

      .header .back {
        position: absolute;
        left: 20px;
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
        text-transform: capitalize;
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
      }

      .actions {
        display: flex;
        padding: 22px 28px;
        box-sizing: border-box;
        justify-content: space-between;
      }
    `,
  ];

  changeSlippage(changeDetails: any) {
    this.slippage = changeDetails.value;
    this.customSlippage = null;
    settingsCursor.resetIn(['slippage'], changeDetails.value);
  }

  changeSlippageCustom(changeDetails: any) {
    if (changeDetails.valid) {
      this.slippage = changeDetails.value;
      this.customSlippage = changeDetails.value;
      settingsCursor.resetIn(['slippage'], changeDetails.value);
    }
  }

  onBackClick(e: any) {
    const options = {
      bubbles: true,
      composed: true,
    };
    this.dispatchEvent(new CustomEvent('back-clicked', options));
  }

  render() {
    return html`
      <div class="header">
        <uigc-icon-button class="back" @click=${this.onBackClick}> <uigc-icon-back></uigc-icon-back> </uigc-icon-button>
        <uigc-typography variant="section">Edit settings</uigc-typography>
        <span></span>
      </div>
      <div class="section">Slippage</div>
      <div class="settings">
        <div class="row">
          <span class="label">Allow auto slippage</span>
          <uigc-switch size="small" disabled></uigc-switch>
        </div>
        <uigc-toggle-button-group
          selected=${this.slippage}
          @toggle-button-clicked=${(e: CustomEvent) => this.changeSlippage(e.detail)}
          @input-changed=${(e: CustomEvent) => this.changeSlippageCustom(e.detail)}
        >
          ${SLIPPAGE_OPTS.map((s: string) => html` <uigc-toggle-button value=${s}>${s}%</uigc-toggle-button> `)}
          <uigc-input
            class="slippage-input"
            type="number"
            value=${this.customSlippage}
            min="0"
            max="100"
            step="0.1"
            placeholder="Custom"
          ></uigc-input>
        </uigc-toggle-button-group>
        <div class="desc">
          The deviation of the final acceptable price from the spot price caused by protocol fee, price impact (depends
          on trade & pool size) and change in price between announcing the transaction and processing it.
        </div>
      </div>
    `;
  }
}
