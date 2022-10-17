import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

import { baseStyles } from '../../base.css';

import { DEFAULT_SLIPPAGE } from '../../utils/router';

import '../../component/Button';
import '../../component/IconButton';
import '../../component/Input';
import '../../component/Switch';
import '../../component/ToggleButton';
import '../../component/ToggleButtonGroup';

const SLIPPAGE_OPTS = ['0.1', '0.5', '1', '3'];

@customElement('app-settings')
export class Settings extends LitElement {
  private readonly predefinedSlippage: Set<string>;

  @property({ type: Number }) slippage = DEFAULT_SLIPPAGE;
  @state() customSlippage: String = null;

  constructor() {
    super();
    this.predefinedSlippage = new Set(SLIPPAGE_OPTS);
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
        line-height: 40px;
      }

      .header span {
        color: var(--hex-neutral-gray-100);
        font-weight: 500;
        font-size: 16px;
      }

      .header .back {
        position: absolute;
        left: 20px;
      }

      .section {
        height: 40px;
        background: var(--hex-background-gray-1000);
        font-weight: 500;
        font-size: 14px;
        line-height: 19px;
        color: #acb2b5;
        padding: 0 28px;
        box-sizing: border-box;
        align-items: center;
        display: flex;
      }

      .settings {
        display: flex;
        flex-direction: column;
        padding: 14px 28px 28px 28px;
        gap: 14px;
        box-sizing: border-box;
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
        color: #acb2b5;
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

  async firstUpdated() {
    const slippage = window.localStorage.getItem('trade.settings.slippage');
    if (slippage) {
      this.slippage = slippage;
      if (!this.predefinedSlippage.has(slippage)) {
        this.customSlippage = slippage;
      }
    }
  }

  changeSlippage(changeDetails: any) {
    this.slippage = changeDetails.value;
    this.customSlippage = null;
    window.localStorage.setItem('trade.settings.slippage', changeDetails.value);
  }

  changeSlippageCustom(changeDetails: any) {
    if (changeDetails.valid) {
      this.slippage = changeDetails.value;
      this.customSlippage = changeDetails.value;
      window.localStorage.setItem('trade.settings.slippage', changeDetails.value);
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
        <ui-icon-button class="back" @click=${this.onBackClick}>
          <img src="assets/img/icon/back.svg" alt="settings" />
        </ui-icon-button>
        <span>Edit settings</span>
        <span></span>
      </div>
      <div class="section">Slippage</div>
      <div class="settings">
        <div class="row">
          <span class="label">Enable Auto Trade Limit</span>
          <ui-switch size="small" disabled></ui-switch>
        </div>
        <ui-toggle-button-group
          selected=${this.slippage}
          @toggle-button-clicked=${(e: CustomEvent) => this.changeSlippage(e.detail)}
          @input-changed=${(e: CustomEvent) => this.changeSlippageCustom(e.detail)}
        >
          ${SLIPPAGE_OPTS.map((s: string) => html` <ui-toggle-button value=${s}>${s}%</ui-toggle-button> `)}

          <ui-input
            class="slippage-input"
            type="number"
            value=${this.customSlippage}
            min="0"
            max="100"
            placeholder="Custom"
          ></ui-input>
        </ui-toggle-button-group>
        <div class="desc">
          The deviation of the final acceptable price from the spot price caused by protocol fee, price impact (depends
          on trade & pool size) and change in price between announcing the transaction and processing it.
        </div>
      </div>
      <div class="grow"></div>
    `;
  }
}
