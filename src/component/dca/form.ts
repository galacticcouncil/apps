import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';

import * as i18n from 'i18next';

import { baseStyles } from '../styles/base.css';
import { formStyles } from '../styles/form.css';

import { Account, accountCursor } from '../../db';
import { DatabaseController } from '../../db.ctrl';
import { humanizeAmount } from '../../utils/amount';

import { PoolAsset } from '@galacticcouncil/sdk';

const INTERVAL_OPTS = ['Day', 'Week', 'Month'];

@customElement('gc-dca-form')
export class DcaForm extends LitElement {
  private account = new DatabaseController<Account>(this, accountCursor);

  @property({ attribute: false }) assets: Map<string, PoolAsset> = new Map([]);
  @property({ attribute: false }) pairs: Map<string, PoolAsset[]> = new Map([]);
  @property({ type: Boolean }) inProgress = false;
  @property({ type: Boolean }) disabled = false;
  @property({ type: Object }) assetIn: PoolAsset = null;
  @property({ type: Object }) assetOut: PoolAsset = null;
  @property({ type: String }) interval = INTERVAL_OPTS[1];
  @property({ type: String }) amountIn = null;
  @property({ type: String }) amountInUsd = null;
  @property({ type: String }) amountOut = null;
  @property({ type: String }) amountOutUsd = null;
  @property({ type: String }) slippagePct = '5';
  @property({ type: String }) tradeFee = '0';
  @property({ type: String }) tradeFeePct = '0';

  static styles = [
    baseStyles,
    formStyles,
    css`
      :host {
        display: flex;
        flex-direction: column;
        height: 100%;
      }

      .invest {
        display: flex;
        position: relative;
        flex-direction: column;
        padding: 0 14px;
        gap: 14px;
        box-sizing: border-box;
      }

      .interval {
        display: flex;
        flex-direction: row;
        align-items: center;
      }

      @media (max-width: 480px) {
        .interval {
          padding: 0 14px;
        }
      }

      .interval span {
        color: var(--hex-white);
        font-style: normal;
        font-weight: 600;
        font-size: 16px;
        line-height: 100%;
      }

      .interval uigc-toggle-button-group {
        margin-left: 24px;
        width: 100%;
      }

      .budget {
        white-space: nowrap;
        font-weight: 500;
        font-size: 14px;
        line-height: 14px;
        color: #ffffff;
      }

      @media (max-width: 480px) {
        .invest {
          padding: 0;
        }
      }

      @media (min-width: 768px) {
        .invest {
          padding: 0 28px;
        }
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

  onScheduleClick(e: any) {
    const options = {
      bubbles: true,
      composed: true,
    };
    this.dispatchEvent(new CustomEvent('schedule-clicked', options));
  }

  infoSlippageTemplate() {
    return html` <span class="label">${i18n.t('dca.slippage')}</span>
      <span class="grow"></span>
      ${when(
        this.inProgress,
        () => html`<uigc-skeleton progress rectangle width="80px" height="12px"></uigc-skeleton>`,
        () => html`<span class="value">5%</span> `
      )}`;
  }

  infoEstimatedEndDateTemplate() {
    return html` <span class="label">${i18n.t('dca.endData')}</span>
      <span class="grow"></span>
      ${when(
        this.inProgress,
        () => html`<uigc-skeleton progress rectangle width="80px" height="12px"></uigc-skeleton>`,
        () => html`<span class="value">12.04.1986</span> `
      )}`;
  }

  infoTransactionCostTemplate(assetSymbol: string) {
    return html` <span class="label">${i18n.t('dca.transactionCost')}</span>
      <span class="grow"></span>
      ${when(
        this.inProgress,
        () => html`<uigc-skeleton progress rectangle width="80px" height="12px"></uigc-skeleton>`,
        () => html`<span class="value">${humanizeAmount(this.tradeFee)} ${assetSymbol}</span>`
      )}`;
  }

  infoTradeFeeTemplate(assetSymbol: string) {
    return html` <span class="label">${i18n.t('dca.tradeFee')}</span>
      <span class="grow"></span>
      ${when(
        this.inProgress,
        () => html`<uigc-skeleton progress rectangle width="80px" height="12px"></uigc-skeleton>`,
        () => html`<span class="value">${humanizeAmount(this.tradeFee)} ${assetSymbol}</span> `
      )}`;
  }

  render() {
    return html`
      <slot name="header"></slot>
      <div class="invest">
        <uigc-asset-transfer
          id="assetIn"
          title="${i18n.t('dca.invest')}"
          .asset=${this.assetIn?.symbol}
          .amount=${this.amountIn}
          .amountUsd=${this.amountInUsd}
        >
        </uigc-asset-transfer>
        <div class="interval">
          <span> Every </span>
          <uigc-toggle-button-group value=${this.interval} @toggle-button-clicked=${(e: CustomEvent) => {}}>
            ${INTERVAL_OPTS.map((s: string) => html` <uigc-toggle-button tab value=${s}>${s}</uigc-toggle-button> `)}
          </uigc-toggle-button-group>
        </div>
        <uigc-selector item=${this.assetOut?.symbol} title="Get">
          <uigc-asset symbol=${this.assetOut?.symbol}></uigc-asset>
        </uigc-selector>
        <uigc-asset-input field amount=${this.amountOut} asset=${this.assetOut?.symbol}>
          <span class="budget" slot="inputAdornment">Max budget</span>
        </uigc-asset-input>
      </div>
      <div class="info show">
        <div class="row">${this.infoEstimatedEndDateTemplate()}</div>
        <div class="row">${this.infoSlippageTemplate()}</div>
        <div class="row">${this.infoTransactionCostTemplate('DAI')}</div>
        <div class="row">${this.infoTradeFeeTemplate('DAI')}</div>
      </div>
      <uigc-button
        ?disabled=${this.disabled || !this.account.state}
        class="confirm"
        variant="info"
        fullWidth
        @click=${this.onScheduleClick}
        >${this.account.state ? i18n.t('dca.schedule') : i18n.t('trade.connect')}</uigc-button
      >
    `;
  }
}
