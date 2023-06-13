import { html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';
import { classMap, ClassInfo } from 'lit/directives/class-map.js';

import * as i18n from 'i18next';

import { baseStyles } from '../styles/base.css';
import { formStyles } from '../styles/form.css';

import { Account, accountCursor, DcaConfig, dcaSettingsCursor } from '../../db';
import { DatabaseController } from '../../db.ctrl';
import { humanizeAmount } from '../../utils/amount';
import { INTERVAL, Interval } from '../../api/time';

import { PoolAsset } from '@galacticcouncil/sdk';
import { BaseElement } from '../base/BaseElement';

@customElement('gc-dca-form')
export class DcaForm extends BaseElement {
  private account = new DatabaseController<Account>(this, accountCursor);
  private settings = new DatabaseController<DcaConfig>(this, dcaSettingsCursor);

  @state() advanced: boolean = false;

  @property({ attribute: false }) assets: Map<string, PoolAsset> = new Map([]);
  @property({ attribute: false }) pairs: Map<string, PoolAsset[]> = new Map([]);
  @property({ type: Boolean }) inProgress = false;
  @property({ type: Boolean }) disabled = false;
  @property({ type: Object }) assetIn: PoolAsset = null;
  @property({ type: Object }) assetOut: PoolAsset = null;
  @property({ type: String }) interval: Interval = '1h';
  @property({ type: String }) intervalBlock: number = null;
  @property({ type: String }) amountIn = null;
  @property({ type: String }) amountInUsd = null;
  @property({ type: String }) amountInBudget = null;
  @property({ type: String }) balanceIn = null;
  @property({ type: String }) maxPrice = null;
  @property({ type: String }) slippagePct = '5';
  @property({ type: String }) tradeFee = '0';
  @property({ type: String }) tradeFeePct = '0';
  @property({ type: String }) est = null;
  @property({ attribute: false }) error = {};

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

      .advanced {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        color: var(--uigc-app-font-color__primary);
        font-weight: 500;
        font-size: 14px;
        line-height: 22px;
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
    if (!this.amountIn || !this.amountInBudget) {
      return null;
    }

    const aIn = Number(this.amountIn);
    const aInbudget = Number(this.amountInBudget);
    const reps = Math.floor(aInbudget / aIn);
    return this._dayjs()
      .add(reps * this.est, 'millisecond')
      .format('DD-MM-YYYY HH:mm');
  }

  private getEstTime(): string {
    if (this.intervalBlock && this.est) {
      return this._humanizer.humanize(this.est, { round: true, largest: 2 });
    } else {
      return null;
    }
  }

  private toggleAdvanced() {
    this.advanced = !this.advanced;
  }

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

  onMaxPriceChanged(e: any) {
    const options = {
      bubbles: true,
      composed: true,
      detail: { id: 'maxPrice', asset: e.detail.asset, value: e.detail.value },
    };
    this.dispatchEvent(new CustomEvent('asset-input-changed', options));
  }

  onIntervalChanged(e: any) {
    const options = {
      bubbles: true,
      composed: true,
      detail: { value: e.detail.value },
    };
    this.dispatchEvent(new CustomEvent('interval-changed', options));
  }

  onIntervalBlockChanged(e: any) {
    const options = {
      bubbles: true,
      composed: true,
      detail: { value: e.detail.value },
    };
    this.dispatchEvent(new CustomEvent('interval-block-changed', options));
  }

  infoSummaryTemplate() {
    const int = this.intervalBlock ? this.getEstTime() : this.interval.toLowerCase();
    return html` <span class="label">${i18n.t('dca.summary')}</span>
      <span>
        <span class="value">Spend</span>
        <span class="value highlight">${this.amountIn} ${this.assetIn?.symbol}</span>
        <span class="value">every ~${int} to buy ${this.assetOut?.symbol} with a total budget of</span>
        <span class="value highlight">${this.amountInBudget} ${this.assetIn?.symbol}</span>
      </span>`;
  }

  infoSlippageTemplate() {
    return html` <span class="label">${i18n.t('dca.priceImpact')}</span>
      <span class="grow"></span>
      ${when(
        this.inProgress,
        () => html`<uigc-skeleton progress rectangle width="80px" height="12px"></uigc-skeleton>`,
        () => html`<span class="value">${this.settings.state.slippage}%</span> `
      )}`;
  }

  infoEstEndDateTemplate() {
    const estDate = this.getEstDate();
    return html` <span class="label">${i18n.t('dca.endData')}</span>
      <span class="grow"></span>
      ${when(
        this.inProgress,
        () => html`<uigc-skeleton progress rectangle width="80px" height="12px"></uigc-skeleton>`,
        () => html`<span class="value">${estDate || '-'}</span> `
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

  formAssetInTemplate() {
    return html` <uigc-asset-transfer
      id="assetIn"
      title="Swap"
      dense
      .asset=${this.assetIn?.symbol}
      .amount=${this.amountIn}
      .amountUsd=${this.amountInUsd}
    >
    </uigc-asset-transfer>`;
  }

  formIntervalTemplate() {
    return html` <div class="interval">
      <span>Every</span>
      <uigc-toggle-button-group
        .value=${this.intervalBlock ? null : this.interval}
        @toggle-button-clicked=${(e: CustomEvent) => {
          this.onIntervalChanged(e);
        }}
      >
        ${INTERVAL.map(
          (s: string) => html` <uigc-toggle-button tab value=${s}>${s.toUpperCase()}</uigc-toggle-button> `
        )}
      </uigc-toggle-button-group>
    </div>`;
  }

  formAssetOutTemplate() {
    return html` <uigc-selector item=${this.assetOut?.symbol} title="For">
      <uigc-asset symbol=${this.assetOut?.symbol}></uigc-asset>
    </uigc-selector>`;
  }

  formMaxBudgetTemplate() {
    const error = this.error['balanceTooLow'] || this.error['maxBudgetTooLow'];
    return html` <uigc-asset-transfer
      id="assetInBudget"
      title=${i18n.t('dca.settings.budget')}
      ?error=${error}
      .error=${error}
      dense
      asset=${this.assetIn?.symbol}
      amount=${this.amountInBudget}
      .selectable=${false}
    >
      <uigc-asset-balance
        slot="balance"
        .balance=${this.balanceIn}
        .visible=${false}
        .formatter=${humanizeAmount}
      ></uigc-asset-balance>
    </uigc-asset-transfer>`;
  }

  formMaxBuyPriceTemplate(classInfo: ClassInfo) {
    return html`
      <uigc-asset-input
        class=${classMap(classInfo)}
        field
        .amount=${this.maxPrice}
        .asset=${this.assetOut?.symbol}
        @asset-input-changed=${(e: CustomEvent) => this.onMaxPriceChanged(e)}
      >
        <span class="adornment" slot="inputAdornment">Max <span class="highlight">Buy</span> Price</span>
      </uigc-asset-input>
    `;
  }

  formBlockPeriodTemplate(classInfo: ClassInfo) {
    return html`
      <uigc-textfield
        class=${classMap(classInfo)}
        field
        number
        ?error=${this.error['blockPeriodInvalid']}
        .error=${this.error['blockPeriodInvalid']}
        .placeholder=${0}
        .value=${this.intervalBlock}
        .desc=${this.getEstTime()}
        @input-changed=${(e: CustomEvent) => this.onIntervalBlockChanged(e)}
      >
        <span class="adornment" slot="inputAdornment">${i18n.t('dca.settings.interval')}</span>
      </uigc-textfield>
    `;
  }

  render() {
    const isValid = this.amountIn && this.amountInBudget && Object.keys(this.error).length == 0;
    const infoClasses = {
      info: true,
      show: isValid,
    };

    const advancedClasses = {
      hidden: this.advanced == false,
    };
    return html`
      <slot name="header"></slot>
      <div class="invest">
        ${this.formAssetInTemplate()} ${this.formIntervalTemplate()} ${this.formAssetOutTemplate()}
        ${this.formMaxBudgetTemplate()}
        <div class="advanced">
          <span>Advanced settings</span>
          <uigc-switch .checked=${this.advanced} size="small" @click=${() => this.toggleAdvanced()}></uigc-switch>
        </div>
        ${this.formBlockPeriodTemplate(advancedClasses)}
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
        >${this.account.state ? i18n.t('dca.schedule') : i18n.t('trade.connect')}</uigc-button
      >
    `;
  }
}
