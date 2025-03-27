import { html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';
import { classMap } from 'lit/directives/class-map.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';

import * as i18n from 'i18next';

import { BaseElement } from 'element/BaseElement';
import {
  Account,
  AccountCursor,
  DatabaseController,
  DcaConfig,
  DcaConfigCursor,
} from 'db';
import { baseStyles, formStyles } from 'styles';
import { formatAmount, humanizeAmount } from 'utils/amount';
import { MINUTE_MS } from 'utils/time';

import { DcaOrder, FrequencyUnit, INTERVAL_DCA, IntervalDca } from './types';

import { Amount, Asset } from '@galacticcouncil/sdk';

import styles from './Form.css';

const HOUR_MIN = 60;
const DAY_MIN = 24 * HOUR_MIN;
const FREQ_UNIT_BY_INTERVAL: Record<IntervalDca, FrequencyUnit> = {
  hour: 'min',
  day: 'hour',
  week: 'day',
};

@customElement('gc-dca-form')
export class DcaForm extends BaseElement {
  private account = new DatabaseController<Account>(this, AccountCursor);
  private dcaConfig = new DatabaseController<DcaConfig>(this, DcaConfigCursor);

  @property({ attribute: false }) assets: Map<string, Asset> = new Map([]);
  @property({ type: Boolean }) inProgress = false;
  @property({ type: Boolean }) disabled = false;
  @property({ type: Boolean }) loaded = false;
  @property({ type: Object }) assetIn: Asset = null;
  @property({ type: Object }) assetOut: Asset = null;
  @property({ type: String }) interval: IntervalDca = 'hour';
  @property({ type: Number }) intervalMultiplier: number = 1;
  @property({ type: Number }) frequency: number = null;
  @property({ type: String }) amountIn = null;
  @property({ type: Object }) balanceIn: Amount = null;
  @property({ attribute: false }) order: DcaOrder = null;
  @property({ attribute: false }) error = {};

  @state() frequencyUnit: FrequencyUnit = 'hour';

  static styles = [baseStyles, formStyles, styles];

  private getEstDate(): string {
    const order = this.order;
    if (order) {
      const est = order.frequency * order.tradesNo * MINUTE_MS;
      return this._dayjs().add(est, 'millisecond').format('DD-MM-YYYY HH:mm');
    }
    return null;
  }

  private getEstTime(): string {
    const order = this.order;
    if (order) {
      const est = order.frequency * order.tradesNo * MINUTE_MS;
      return this._humanizer.humanize(est, {
        round: true,
        largest: 2,
      });
    }
    return null;
  }

  private getEstFreq(): string {
    const order = this.order;
    if (order) {
      return this._humanizer.humanize(order.frequency * MINUTE_MS, {
        round: true,
        largest: 2,
      });
    }
    return null;
  }

  get minFrequency() {
    return this.order
      ? Math.min(this.order.frequencyMin, this.order.frequencyOpt)
      : 0;
  }

  get maxFrequency() {
    return Number.isFinite(this.order?.frequencyOpt)
      ? Math.max(this.minFrequency, this.order.frequencyOpt)
      : 0;
  }

  get frequencyRanges(): Record<FrequencyUnit, number> {
    const range = this.maxFrequency - this.minFrequency;
    return {
      min: range,
      hour: Math.floor(range / HOUR_MIN),
      day: Math.floor(range / DAY_MIN),
    };
  }

  onScheduleClick(e: any) {
    const options = {
      bubbles: true,
      composed: true,
    };
    this.dispatchEvent(new CustomEvent('schedule-click', options));
  }

  onIntervalChange(e: any) {
    const interval = e.detail.value as IntervalDca;
    const options = {
      bubbles: true,
      composed: true,
      detail: { value: interval },
    };

    this.setFrequencyUnit(this.maxFrequency, FREQ_UNIT_BY_INTERVAL[interval]);
    this.dispatchEvent(new CustomEvent('interval-change', options));
  }

  onIntervalMultiplierChange(e: any) {
    const multipliplier = e.detail.value;
    const options = {
      bubbles: true,
      composed: true,
      detail: { value: multipliplier },
    };

    this.dispatchEvent(new CustomEvent('interval-mul-change', options));

    setTimeout(() => {
      if (multipliplier && this.frequencyRanges[this.frequencyUnit] <= 1) {
        const units = Object.keys(this.frequencyRanges);
        const unit =
          (units[units.indexOf(this.frequencyUnit) - 1] as FrequencyUnit) ||
          'min';
        const values = {
          min: this.maxFrequency,
          hour: Math.floor(this.maxFrequency / HOUR_MIN),
          day: Math.floor(this.maxFrequency / DAY_MIN),
        };
        this.setFrequencyUnit(values[unit], unit);
      }
    }, 0);
  }

  convertFrequencyValue(value: number, unit: FrequencyUnit = 'min') {
    return unit === 'min'
      ? value
      : unit === 'hour'
      ? value * HOUR_MIN
      : value * DAY_MIN;
  }

  onFrequencyChange(value: number, unit: FrequencyUnit = 'min') {
    const options = {
      bubbles: true,
      composed: true,
      detail: { value: this.convertFrequencyValue(value, unit) },
    };
    this.dispatchEvent(new CustomEvent('frequency-change', options));
  }

  setFrequencyUnit(value: number, unit: FrequencyUnit) {
    this.frequencyUnit = unit;
    this.onFrequencyChange(value, unit);
  }

  infoSummaryTemplate() {
    if (this.inProgress) {
      return html`
        <span class="label">${i18n.t('form.summary')}</span>
        <uigc-skeleton
          class="full"
          progress
          rectangle
          height="12px"></uigc-skeleton>
        <uigc-skeleton
          class="full"
          progress
          rectangle
          height="12px"></uigc-skeleton>
      `;
    }

    const order = this.order?.toHuman();
    const summary = i18n.t('form.summary.message', {
      amountInBudget: humanizeAmount(this.amountIn),
      amountIn: humanizeAmount(order?.amountIn),
      assetIn: this.assetIn?.symbol,
      assetOut: this.assetOut?.symbol,
      frequency: this.getEstFreq(),
      noOfTrades: order?.tradesNo,
      time: this.getEstTime(),
    });

    return html`
      <span class="label">${i18n.t('form.summary')}</span>
      <span class="value">${unsafeHTML(summary)}</span>
    `;
  }

  infoEstEndDateTemplate() {
    const estDate = this.getEstDate();
    return html`
      <span class="label">${i18n.t('form.info.estSchedule')}</span>
      <span class="grow"></span>
      ${when(
        this.inProgress,
        () =>
          html`
            <uigc-skeleton
              progress
              rectangle
              width="80px"
              height="12px"></uigc-skeleton>
          `,
        () =>
          html`
            <span class="value">${estDate || '-'}</span>
          `,
      )}
    `;
  }

  infoSlippageTemplate() {
    const { slippage } = this.dcaConfig.state;
    return html`
      <span class="label">${i18n.t('form.info.slippage')}</span>
      <span class="grow"></span>
      ${when(
        this.inProgress,
        () =>
          html`
            <uigc-skeleton
              progress
              rectangle
              width="80px"
              height="12px"></uigc-skeleton>
          `,
        () =>
          html`
            <span class="value">${slippage}%</span>
          `,
      )}
    `;
  }

  formAssetTemplate(asset: Asset, slot?: string) {
    if (this.loaded) {
      return html`
        <gc-asset-identicon
          slot=${slot}
          .asset=${asset}
          .assets=${this.assets}
          .atokens=${this.atokens}></gc-asset-identicon>
      `;
    }
    return this.formAssetLoadingTemplate(slot);
  }

  formAssetBalanceTemplate(balance: Amount) {
    return html`
      <uigc-asset-balance
        slot="balance"
        .balance=${balance && formatAmount(balance.amount, balance.decimals)}
        .visible=${false}
        .formatter=${humanizeAmount}></uigc-asset-balance>
    `;
  }

  formAssetLoadingTemplate(slot?: string) {
    return html`
      <div class="loading" slot=${slot}>
        <uigc-skeleton
          circle
          progress
          width="32px"
          height="32px"></uigc-skeleton>
        <span class="title">
          <uigc-skeleton
            progress
            rectangle
            width="40px"
            height="16px"></uigc-skeleton>
          <uigc-skeleton
            progress
            rectangle
            width="50px"
            height="8px"></uigc-skeleton>
        </span>
      </div>
    `;
  }

  formIntervalTemplate() {
    return html`
      <div class="interval">
        <div class="section">Over the period of</div>
        <div class="selection">
          <uigc-input
            fit
            id="slippage"
            class="slippage-input"
            type="number"
            value=${this.intervalMultiplier}
            min=${1}
            placeholder="${i18n.t('settings.custom')}"
            @input-change=${(e: CustomEvent) =>
              this.onIntervalMultiplierChange(e)}></uigc-input>
          <uigc-toggle-button-group
            .value=${this.interval}
            @toggle-button-click=${(e: CustomEvent) => {
              this.onIntervalChange(e);
            }}>
            ${INTERVAL_DCA.map(
              (s: string) =>
                html`
                  <uigc-toggle-button tab value=${s}>
                    ${s.toUpperCase()}
                  </uigc-toggle-button>
                `,
            )}
          </uigc-toggle-button-group>
        </div>
      </div>
    `;
  }

  formAssetInTemplate() {
    const error = this.error['balanceTooLow'] || this.error['minBudgetTooLow'];
    return html`
      <uigc-asset-transfer
        id="assetIn"
        title=${i18n.t('form.assetIn.label')}
        ?readonly=${!this.loaded}
        .readonly=${!this.loaded}
        ?selectable=${this.loaded}
        .selectable=${this.loaded}
        ?error=${error}
        .error=${error}
        asset=${this.assetIn?.symbol}
        unit=${this.assetIn?.symbol}
        amount=${this.amountIn}>
        ${this.formAssetTemplate(this.assetIn, 'asset')}
        ${this.formAssetBalanceTemplate(this.balanceIn)}
      </uigc-asset-transfer>
    `;
  }

  formAssetOutTemplate() {
    return html`
      <uigc-selector
        title=${i18n.t('form.assetOut.label')}
        ?readonly=${!this.loaded}
        .readonly=${!this.loaded}
        .item=${this.assetOut?.symbol}>
        ${this.formAssetTemplate(this.assetOut)}
      </uigc-selector>
    `;
  }

  formFrequencyTemplate() {
    const min = this.minFrequency;
    const max = this.maxFrequency;
    const value = this.frequency ?? max;

    const minValues: Record<FrequencyUnit, number> = {
      min: min,
      hour: Math.ceil(min / HOUR_MIN),
      day: Math.ceil(min / DAY_MIN),
    };

    const maxValues: Record<FrequencyUnit, number> = {
      min: max,
      hour: Math.floor(max / HOUR_MIN),
      day: Math.floor(max / DAY_MIN),
    };

    const values: Record<FrequencyUnit, number> = {
      min: value,
      hour: Math.floor(value / HOUR_MIN),
      day: Math.floor(value / DAY_MIN),
    };

    const units = [
      'min',
      this.frequencyRanges.hour > 0 && 'hour',
      this.frequencyRanges.day > 0 && 'day',
    ].filter((u): u is FrequencyUnit => !!u);

    const valueMsec = value * 60 * 1000;
    const blockTime = 12_000;
    const blockCount = Math.floor(valueMsec / blockTime);
    const blockHint =
      blockCount > 0
        ? i18n.t('form.advanced.intervalBlocks', {
            unit: i18n.t(`form.frequency.${this.frequencyUnit}`),
            value: values[this.frequencyUnit],
            blocks: blockCount,
          })
        : undefined;

    return html`
      <uigc-slider
        label=${i18n.t('form.advanced.interval')}
        unit=${i18n.t(`form.frequency.${this.frequencyUnit}`)}
        hint=${blockHint}
        .min=${minValues[this.frequencyUnit]}
        .max=${maxValues[this.frequencyUnit]}
        .value=${values[this.frequencyUnit]}
        .disabled=${!this.order}
        @input-change=${(e: CustomEvent) =>
          this.onFrequencyChange(
            parseFloat(e.detail.value),
            this.frequencyUnit,
          )}>
        >
        <div slot="value">
          ${units.length > 1
            ? html`
                <uigc-dropdown
                  triggerMethod="click"
                  placement="bottom-end"
                  .items=${units.map((u) => ({
                    active: this.frequencyUnit === u,
                    text: i18n.t(`form.frequency.${u}`),
                    onClick: () => this.setFrequencyUnit(values[u], u),
                  }))}>
                  <div class="frequency-select">
                    ${i18n.t(`form.frequency.${this.frequencyUnit}`)}
                    <uigc-icon-dropdown></uigc-icon-dropdown>
                  </div>
                </uigc-dropdown>
              `
            : i18n.t(`form.frequency.${this.frequencyUnit}`)}
        </div>
      </uigc-slider>
    `;
  }

  formSwitch() {
    return html`
      <div class="switch">
        <div class="divider"></div>
        <uigc-asset-switch
          class="switch-button"
          ?disabled=${!this.loaded}></uigc-asset-switch>
      </div>
    `;
  }

  formATokenWarning() {
    const aTokenWarnClasses = {
      alert: true,
      warning: true,
      show: this.assetIn ? this.atokens.get(this.assetIn.id) : false,
    };
    return html`
      <div class=${classMap(aTokenWarnClasses)}>
        <uigc-icon-warning></uigc-icon-warning>
        <span>${i18n.t('warn.aToken')}</span>
      </div>
    `;
  }

  render() {
    const isValid = this.amountIn && !!this.order?.amountIn;
    const infoClasses = {
      info: true,
      show: isValid,
    };

    return html`
      <slot name="header"></slot>
      <div class="invest">
        ${this.formAssetInTemplate()}
        ${this.formSwitch()}${this.formAssetOutTemplate()}
        ${this.formIntervalTemplate()}
      </div>
      <div class=${classMap(infoClasses)}>
        <div class="row">${this.formFrequencyTemplate()}</div>
        <div class="row summary show">${this.infoSummaryTemplate()}</div>
        <div class="row">${this.infoEstEndDateTemplate()}</div>
        <div class="row">${this.infoSlippageTemplate()}</div>
      </div>
      ${this.formATokenWarning()}
      <uigc-button
        ?disabled=${this.disabled || this.inProgress || !this.account.state}
        class="confirm"
        variant="info"
        fullWidth
        @click=${this.onScheduleClick}>
        ${this.account.state
          ? i18n.t('form.cta.schedule')
          : i18n.t('form.cta.connect')}
      </uigc-button>
    `;
  }
}
