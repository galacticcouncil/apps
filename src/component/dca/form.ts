import { html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';
import { classMap } from 'lit/directives/class-map.js';

import * as i18n from 'i18next';

import { BaseElement } from '../base/BaseElement';
import { baseStyles } from '../styles/base.css';
import { formStyles } from '../styles/form.css';

import { Account, accountCursor, DcaConfig, dcaSettingsCursor } from '../../db';
import { DatabaseController } from '../../db.ctrl';
import { humanizeAmount } from '../../utils/amount';

import { INTERVAL_DCA, IntervalDca } from './types';

import { Asset } from '@galacticcouncil/sdk';
import { MINUTE_MS } from '../../utils/time';

@customElement('gc-dca-form')
export class DcaForm extends BaseElement {
  private account = new DatabaseController<Account>(this, accountCursor);
  private settings = new DatabaseController<DcaConfig>(this, dcaSettingsCursor);

  @property({ attribute: false }) assets: Map<string, Asset> = new Map([]);
  @property({ type: Boolean }) inProgress = false;
  @property({ type: Boolean }) disabled = false;
  @property({ type: Boolean }) loaded = false;
  @property({ type: Object }) assetIn: Asset = null;
  @property({ type: Object }) assetOut: Asset = null;
  @property({ type: String }) interval: IntervalDca = 'hour';
  @property({ type: Number }) intervalMultiplier: number = 1;
  @property({ type: Number }) frequency: number = null;
  @property({ type: Number }) frequencyManual: number = null;
  @property({ type: String }) amountIn = null;
  @property({ type: String }) amountInUsd = null;
  @property({ type: String }) amountInBudget = null;
  @property({ type: String }) balanceIn = null;
  @property({ type: String }) slippagePct = '5';
  @property({ type: String }) tradeFee = '0';
  @property({ type: String }) tradeFeePct = '0';
  @property({ type: String }) tradesNo = null;
  @property({ type: String }) est = null;
  @property({ attribute: false }) error = {};
  @state() advanced: boolean = false;

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

      .advanced {
        display: flex;
        flex-direction: column;
        row-gap: 3px;
      }

      .interval {
        display: flex;
        flex-direction: column;
      }

      @media (max-width: 480px) {
        .interval {
          padding: 0 14px;
        }
      }

      .interval div.section {
        color: var(--hex-white);
        font-style: normal;
        font-weight: 400;
        font-size: 14px;
        line-height: 100%;
        margin: 12px 0;
      }

      .interval div.selection {
        width: 100%;
        display: flex;
        flex-direction: row;
      }

      .interval div.selection > uigc-input {
        max-width: 130px;
        height: 46px;
        margin-right: 12px;
      }

      .interval div.selection > uigc-toggle-button-group {
        width: 100%;
      }

      .adornment {
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

      .hidden {
        display: none;
      }

      uigc-asset {
        padding: 5px;
      }
    `,
  ];

  private getEstDate(): string {
    const freq = this.frequencyManual || this.frequency;
    if (freq) {
      const est = Number(freq) * this.tradesNo * MINUTE_MS;
      return this._dayjs().add(est, 'millisecond').format('DD-MM-YYYY HH:mm');
    }
    return null;
  }

  private getEstTime(): string {
    const freq = this.frequencyManual || this.frequency;
    if (freq) {
      const est = Number(freq) * this.tradesNo * MINUTE_MS;
      return this._humanizer.humanize(est, {
        round: true,
        largest: 2,
      });
    }
    return null;
  }

  private getEstFreq(): string {
    const freq = this.frequencyManual || this.frequency;
    if (freq) {
      return this._humanizer.humanize(Number(freq) * MINUTE_MS, {
        round: true,
        largest: 2,
      });
    }
    return null;
  }

  private toggleAdvanced() {
    this.advanced = !this.advanced;
  }

  onScheduleClick(e: any) {
    const options = {
      bubbles: true,
      composed: true,
    };
    this.dispatchEvent(new CustomEvent('schedule-click', options));
  }

  onIntervalChange(e: any) {
    const options = {
      bubbles: true,
      composed: true,
      detail: { value: e.detail.value },
    };
    this.dispatchEvent(new CustomEvent('interval-change', options));
  }

  onIntervalMultiplierChange(e: any) {
    const options = {
      bubbles: true,
      composed: true,
      detail: { value: e.detail.value },
    };
    this.dispatchEvent(new CustomEvent('interval-mul-change', options));
  }

  onFrequencyChange(e: any) {
    const options = {
      bubbles: true,
      composed: true,
      detail: { value: e.detail.value },
    };
    this.dispatchEvent(new CustomEvent('frequency-change', options));
  }

  infoSummaryTemplate() {
    const frequency = this.getEstFreq();
    const time = this.getEstTime();

    return html` <span class="label">${i18n.t('dca.summary')}</span>
      <span>
        <span class="value">Swap a total of</span>
        <span class="value highlight"
          >${humanizeAmount(this.amountInBudget)} ${this.assetIn?.symbol}</span
        >
        <span class="value">for</span>
        <span class="value highlight">${this.assetOut?.symbol}</span>
        <span class="value">over</span>
        <span class="value highlight">${time}</span>
        <span class="value">with</span>
        <span class="value highlight"
          >${humanizeAmount(this.amountIn)} ${this.assetIn?.symbol}</span
        >
        <span class="value">trades every</span>
        <span class="value highlight">${frequency}</span>
      </span>`;
  }

  infoSlippageTemplate() {
    return html` <span class="label">${i18n.t('dca.slippage')}</span>
      <span class="grow"></span>
      ${when(
        this.inProgress,
        () =>
          html`<uigc-skeleton
            progress
            rectangle
            width="80px"
            height="12px"
          ></uigc-skeleton>`,
        () =>
          html`<span class="value">${this.settings.state.slippage}%</span> `,
      )}`;
  }

  infoEstEndDateTemplate() {
    const estDate = this.getEstDate();
    return html` <span class="label">${i18n.t('dca.endData')}</span>
      <span class="grow"></span>
      ${when(
        this.inProgress,
        () =>
          html`<uigc-skeleton
            progress
            rectangle
            width="80px"
            height="12px"
          ></uigc-skeleton>`,
        () => html`<span class="value">${estDate || '-'}</span> `,
      )}`;
  }

  infoTransactionCostTemplate(assetSymbol: string) {
    return html` <span class="label">${i18n.t('dca.transactionCost')}</span>
      <span class="grow"></span>
      ${when(
        this.inProgress,
        () =>
          html`<uigc-skeleton
            progress
            rectangle
            width="80px"
            height="12px"
          ></uigc-skeleton>`,
        () =>
          html`<span class="value"
            >${humanizeAmount(this.tradeFee)} ${assetSymbol}</span
          >`,
      )}`;
  }

  infoTradeFeeTemplate(assetSymbol: string) {
    return html` <span class="label">${i18n.t('dca.tradeFee')}</span>
      <span class="grow"></span>
      ${when(
        this.inProgress,
        () =>
          html`<uigc-skeleton
            progress
            rectangle
            width="80px"
            height="12px"
          ></uigc-skeleton>`,
        () =>
          html`<span class="value"
            >${humanizeAmount(this.tradeFee)} ${assetSymbol}</span
          > `,
      )}`;
  }

  formAssetTemplate(asset: Asset, slot?: string) {
    if (this.loaded) {
      return html`
        <gc-asset-id
          slot=${slot}
          .asset=${asset}
          .assets=${this.assets}
        ></gc-asset-id>
      `;
    }
    return this.formAssetLoadingTemplate(slot);
  }

  formAssetBalanceTemplate(balance: string) {
    return html`
      <uigc-asset-balance
        slot="balance"
        .balance=${balance}
        .visible=${false}
        .formatter=${humanizeAmount}
      ></uigc-asset-balance>
    `;
  }

  formAssetLoadingTemplate(slot?: string) {
    return html`
      <div class="loading" slot=${slot}>
        <uigc-skeleton
          circle
          progress
          width="32px"
          height="32px"
        ></uigc-skeleton>
        <span class="title">
          <uigc-skeleton
            progress
            rectangle
            width="40px"
            height="16px"
          ></uigc-skeleton>
          <uigc-skeleton
            progress
            rectangle
            width="50px"
            height="8px"
          ></uigc-skeleton>
        </span>
      </div>
    `;
  }

  formIntervalTemplate() {
    return html` <div class="interval">
      <div class="section">Over the period of</div>
      <div class="selection">
        <uigc-input
          fit
          id="slippage"
          class="slippage-input"
          type="number"
          value=${this.intervalMultiplier}
          min=${1}
          placeholder="${i18n.t('dca.settings.custom')}"
          @input-change=${(e: CustomEvent) =>
            this.onIntervalMultiplierChange(e)}
        ></uigc-input>
        <uigc-toggle-button-group
          .value=${this.interval}
          @toggle-button-click=${(e: CustomEvent) => {
            this.onIntervalChange(e);
          }}
        >
          ${INTERVAL_DCA.map(
            (s: string) =>
              html`
                <uigc-toggle-button tab value=${s}
                  >${s.toUpperCase()}</uigc-toggle-button
                >
              `,
          )}
        </uigc-toggle-button-group>
      </div>
    </div>`;
  }

  formMaxBudgetTemplate() {
    const error = this.error['balanceTooLow'] || this.error['minBudgetTooLow'];
    return html` <uigc-asset-transfer
      id="assetIn"
      title=${i18n.t('dca.form.budget')}
      ?readonly=${!this.loaded}
      .readonly=${!this.loaded}
      ?selectable=${this.loaded}
      .selectable=${this.loaded}
      ?error=${error}
      .error=${error}
      asset=${this.assetIn?.symbol}
      unit=${this.assetIn?.symbol}
      amount=${this.amountInBudget}
    >
      ${this.formAssetTemplate(this.assetIn, 'asset')}
      ${this.formAssetBalanceTemplate(this.balanceIn)}
    </uigc-asset-transfer>`;
  }

  formAssetOutTemplate() {
    return html` <uigc-selector
      title=${i18n.t('dca.form.get')}
      ?readonly=${!this.loaded}
      .readonly=${!this.loaded}
      .item=${this.assetOut?.symbol}
    >
      ${this.formAssetTemplate(this.assetOut)}
    </uigc-selector>`;
  }

  formAdvancedSwitch() {
    return html`
      <div class="form-switch">
        <div>
          <span class="title">Advanced settings</span>
          <span class="desc"
            >Customize your trades to an even greater extent.</span
          >
        </div>
        <uigc-switch
          .checked=${this.advanced}
          size="small"
          @click=${() => this.toggleAdvanced()}
        ></uigc-switch>
      </div>
    `;
  }

  formFrequencyTemplate() {
    const error = this.error['frequencyOutOfRange'];
    return html`
      <uigc-textfield
        field
        number
        ?error=${error}
        .error=${error}
        .min=${1}
        .placeholder=${this.frequency}
        .value=${this.frequencyManual}
        @input-change=${(e: CustomEvent) => this.onFrequencyChange(e)}
      >
        <span class="adornment" slot="inputAdornment"
          >${i18n.t('dca.form.interval')}</span
        >
      </uigc-textfield>
    `;
  }

  render() {
    const isValid =
      this.amountIn &&
      this.amountInBudget &&
      Object.keys(this.error).length == 0;
    const infoClasses = {
      info: true,
      show: isValid,
    };
    const advancedClasses = {
      hidden: this.advanced == false,
      advanced: true,
    };
    return html`
      <slot name="header"></slot>
      <div class="invest">
        ${this.formMaxBudgetTemplate()} ${this.formAssetOutTemplate()}
        ${this.formIntervalTemplate()} ${this.formAdvancedSwitch()}
        <div class=${classMap(advancedClasses)}>
          ${this.formFrequencyTemplate()}
        </div>
      </div>
      <div class=${classMap(infoClasses)}>
        <div class="row summary show">${this.infoSummaryTemplate()}</div>
        <div class="row">${this.infoEstEndDateTemplate()}</div>
        <div class="row">${this.infoSlippageTemplate()}</div>
      </div>
      <uigc-button
        ?disabled=${this.disabled || !this.account.state}
        class="confirm"
        variant="info"
        fullWidth
        @click=${this.onScheduleClick}
        >${this.account.state
          ? i18n.t('dca.schedule')
          : i18n.t('trade.connect')}</uigc-button
      >
    `;
  }
}
