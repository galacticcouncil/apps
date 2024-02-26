import { html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';
import { classMap } from 'lit/directives/class-map.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';

import * as i18n from 'i18next';

import {
  Account,
  AccountCursor,
  DatabaseController,
  DcaConfig,
  DcaConfigCursor,
} from 'db';
import { BaseElement } from 'element/BaseElement';
import { baseStyles } from 'styles/base.css';
import { formStyles } from 'styles/form.css';
import { formatAmount, humanizeAmount } from 'utils/amount';

import {
  INTERVAL_DCA,
  APY,
  IntervalDca,
  DcaYieldOrder,
  INTERVAL_DCA_MS,
} from './types';

import { Asset } from '@galacticcouncil/sdk';

@customElement('gc-yield-form')
export class YieldForm extends BaseElement {
  private account = new DatabaseController<Account>(this, AccountCursor);
  private dcaConfig = new DatabaseController<DcaConfig>(this, DcaConfigCursor);

  @property({ attribute: false }) assets: Map<string, Asset> = new Map([]);
  @property({ type: Boolean }) inProgress = false;
  @property({ type: Boolean }) disabled = false;
  @property({ type: Boolean }) loaded = false;
  @property({ type: Object }) assetIn: Asset = null;
  @property({ type: Object }) assetOut: Asset = null;
  @property({ type: String }) interval: IntervalDca = '1 month';
  @property({ type: String }) amountIn = null;
  @property({ type: String }) balanceIn = null;
  @property({ type: Number }) rate = null;
  @property({ attribute: false }) order: DcaYieldOrder = null;
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
        flex-direction: column;
        white-space: nowrap;
        align-items: flex-start;
      }

      @media (max-width: 480px) {
        .interval {
          padding: 0 14px;
        }
      }

      .interval div.section {
        color: var(--hex-white);
        font-style: normal;
        font-weight: 500;
        font-size: 14px;
        line-height: 100%;
        margin-bottom: 10px;
      }

      uigc-toggle-button {
        white-space: nowrap;
      }

      .interval uigc-toggle-button {
        display: flex;
      }

      .interval uigc-toggle-button.sm {
        display: none;
      }

      @media (max-width: 480px) {
        .interval uigc-toggle-button.sm {
          display: flex;
        }

        .interval uigc-toggle-button {
          display: none;
        }
      }

      .interval uigc-toggle-button-group {
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

      .apy {
        margin-top: -10px;
        margin-bottom: -10px;
        padding: unset;
      }

      uigc-asset {
        padding: 5px;
      }
    `,
  ];

  private getEstDate(): string {
    if (!this.interval) {
      return null;
    }

    const intervalMs = INTERVAL_DCA_MS[this.interval];
    return this._dayjs()
      .add(intervalMs, 'millisecond')
      .format('DD-MM-YYYY HH:mm');
  }

  private getEstFreq(): string {
    if (this.interval && this.order) {
      const { tradesNo } = this.order;
      const intervalMs = INTERVAL_DCA_MS[this.interval];
      return this._humanizer.humanize(intervalMs / tradesNo, {
        round: true,
        largest: 2,
      });
    } else {
      return null;
    }
  }

  private getDotYield(): string {
    if (this.order) {
      console.log(this.rate);
      const dotYield = this.order.amountInYield.multipliedBy(this.rate);
      return formatAmount(dotYield, this.assetIn.decimals);
    }
    return null;
  }

  onScheduleClick(e: any) {
    const options = {
      bubbles: true,
      composed: true,
    };
    this.dispatchEvent(new CustomEvent('schedule-click', options));
  }

  onMaxPriceChange(e: any) {
    const options = {
      bubbles: true,
      composed: true,
      detail: { id: 'maxPrice', asset: e.detail.asset, value: e.detail.value },
    };
    this.dispatchEvent(new CustomEvent('asset-input-change', options));
  }

  onIntervalChange(e: any) {
    const options = {
      bubbles: true,
      composed: true,
      detail: { value: e.detail.value },
    };
    this.dispatchEvent(new CustomEvent('interval-change', options));
  }

  infoSummaryTemplate() {
    const order = this.order?.toHuman();
    const dotYield = this.getDotYield();

    const summary = i18n.t('form.summary.message', {
      amountIn: humanizeAmount(order?.amountIn),
      amountInYield: humanizeAmount(order?.amountInYield),
      assetIn: this.assetIn?.symbol,
      assetOut: this.assetOut?.symbol,
      frequency: this.getEstFreq(),
      int: this.interval.toLowerCase(),
      rate: humanizeAmount(dotYield),
    });
    return html`
      <span class="label">${i18n.t('form.summary')}</span>
      <span class="value">${unsafeHTML(summary)}</span>
    `;
  }

  infoApyTemplate() {
    return html`
      <span class="label">${i18n.t('form.info.avgApy')}</span>
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
            <span class="value highlight">${`${APY}%` || '-'}</span>
          `,
      )}
    `;
  }

  infoEstYieldTemplate() {
    const dotYield = this.getDotYield();
    return html`
      <span class="label">${i18n.t('form.info.estYield')}</span>
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
            <span class="value highlight">
              ${`${humanizeAmount(dotYield)} DOT/${this.interval}` || '-'}
            </span>
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

  formAssetTemplate(asset: Asset, slot?: string) {
    if (this.loaded) {
      return html`
        <gc-asset-identicon
          slot=${slot}
          .asset=${asset}
          .assets=${this.assets}></gc-asset-identicon>
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

  private humanizeSmInterval(value: string) {
    return value.substring(0, 3).toUpperCase().replace(' ', '');
  }

  formIntervalTemplate() {
    return html`
      <div class="interval">
        <div class="section">${i18n.t('form.duration.label')}</div>
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
                <uigc-toggle-button class="sm" tab value=${s}>
                  ${this.humanizeSmInterval(s)}
                </uigc-toggle-button>
              `,
          )}
        </uigc-toggle-button-group>
      </div>
    `;
  }

  formYieldFromTemplate() {
    const error =
      this.error['balanceTooLow'] || this.error['minInvestmentTooLow'];
    return html`
      <uigc-asset-transfer
        id="assetIn"
        title=${i18n.t('form.assetIn.label')}
        ?readonly=${!this.loaded}
        .readonly=${!this.loaded}
        ?selectable=${false}
        .selectable=${false}
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

  render() {
    const isValid =
      this.amountIn &&
      this.order &&
      this.rate &&
      Object.keys(this.error).length == 0;
    const infoClasses = {
      info: true,
      show: isValid,
    };
    return html`
      <slot name="header"></slot>
      <div class="invest">
        ${this.formYieldFromTemplate()} ${this.formAssetOutTemplate()}
        ${this.formIntervalTemplate()}
      </div>
      <div class=${classMap(infoClasses)}>
        <div class="row summary show">${this.infoSummaryTemplate()}</div>
        <div class="row">${this.infoApyTemplate()}</div>
        <div class="row">${this.infoEstYieldTemplate()}</div>
        <div class="row">${this.infoEstEndDateTemplate()}</div>
        <div class="row">${this.infoSlippageTemplate()}</div>
      </div>
      <uigc-button
        ?disabled=${this.disabled || !this.account.state}
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
