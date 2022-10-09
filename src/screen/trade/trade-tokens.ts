import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { DatabaseController } from '../../db.ctrl';
import { apiCursor, Api } from '../../db';

import { baseStyles } from '../../base.css';

import '../../component/AssetTransfer';
import '../../component/AssetPrice';
import '../../component/AssetSwitch';
import '../../component/Divider';
import '../../component/Paper';
import '../../component/IconButton';
import '../../component/Button';

@customElement('app-trade-tokens')
export class TradeTokens extends LitElement {
  private db = new DatabaseController<Api>(this, apiCursor);

  @property({ type: String }) assetIn = null;
  @property({ type: String }) assetOut = null;

  static styles = [
    baseStyles,
    css`
      :host {
        display: flex;
        flex-direction: column;
        max-width: 595px;
        margin-left: auto;
        margin-right: auto;
        position: relative;
      }

      .header {
        display: flex;
        padding: 22px 28px;
        box-sizing: border-box;
      }

      .header h1 {
        background: var(--gradient-label);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }

      .transfer {
        display: flex;
        flex-direction: column;
        padding: 0 28px;
        gap: 14px;
        box-sizing: border-box;
      }

      .transfer .divider {
        background: rgba(var(--rgb-primary-450), 0.12);
        height: 1px;
        width: 100%;
        left: 0;
        position: absolute;
      }

      .transfer .switch {
        align-items: center;
        display: flex;
        height: 43px;
        justify-content: space-between;
        width: 100%;
      }

      .transfer .switch-button {
        position: absolute;
        left: 14px;
        border-radius: 50%;
        background: var(--hex-poison-green);
      }

      .transfer .switch-button > img {
        height: 100%;
      }

      .transfer .switch-price {
        position: absolute;
        right: 14px;
        background: #23282b;
        border-radius: 7px;
      }

      .info {
        display: flex;
        flex-direction: column;
        margin-top: 10px;
        padding: 0 38px;
        box-sizing: border-box;
      }

      .info .row {
        display: flex;
        align-items: center;
        height: 30px;
        position: relative;
      }

      .info .row:not(:last-child):after {
        background-color: var(--hex-background-gray-800);
        bottom: 0;
        content: ' ';
        height: 1px;
        position: absolute;
        width: 100%;
      }

      .info .label {
        font-weight: 500;
        font-size: 14px;
        line-height: 22px;
        text-align: center;
        color: var(--hex-neutral-gray-300);
      }

      .info .value {
        font-weight: 500;
        font-size: 14px;
        line-height: 22px;
        text-align: center;
        color: var(--hex-white);
      }

      .info .more {
        display: flex;
        align-items: center;
        text-align: center;
        justify-content: center;
        font-weight: 500;
        font-size: 14px;
        line-height: 22px;
        color: var(--hex-primary-300);
        cursor: pointer;
        padding: 10px 0;
      }

      .info .more > img {
        margin-left: 4px;
      }

      .confirm {
        display: flex;
        padding: 22px 28px;
        box-sizing: border-box;
      }
    `,
  ];

  onSettingsClick(e: any) {
    const options = {
      bubbles: true,
      composed: true,
    };
    this.dispatchEvent(new CustomEvent('settings-clicked', options));
  }

  render() {
    return html`
      <ui-paper>
        <div class="header">
          <h1>Trade Tokens</h1>
          <span class="grow"></span>
          <ui-icon-button @click=${this.onSettingsClick}>
            <img src="assets/img/icon/settings.svg" alt="settings" />
          </ui-icon-button>
        </div>
        <div class="transfer">
          <ui-asset-transfer id="assetIn" title="Pay with" .asset=${this.assetIn}></ui-asset-transfer>
          <div class="switch">
            <div class="divider"></div>
            <ui-asset-switch class="switch-button"> </ui-asset-switch>
            <ui-asset-price
              .inputAsset=${this.assetIn}
              .outputAsset=${this.assetOut}
              .outputBalance=${'1234'}
              class="switch-price"
            >
            </ui-asset-price>
          </div>
          <ui-asset-transfer id="assetOut" title="You get" .asset=${this.assetOut}></ui-asset-transfer>
        </div>
        <div class="info">
          <div class="row">
            <span class="label">Minimal amount after slippage:</span>
            <span class="grow"></span>
            <span class="value">124343 ${this.assetOut} </span>
          </div>
          <div class="row">
            <span class="label">Total fees:</span>
            <span class="grow"></span>
            <span class="value">124343 ${this.assetOut}</span>
          </div>
          <div class="row">
            <span class="label">Trade fees:</span>
            <span class="grow"></span>
            <span class="value">124343 ${this.assetOut}</span>
          </div>
          <span class="more">
            <span>More Details</span>
            <img src="assets/img/icon/dropdown.svg" alt="more" />
          </span>
        </div>
        <ui-button class="confirm" variant="primary" fullWidth>Confirm Swap</ui-button>
      </ui-paper>
    `;
  }
}
