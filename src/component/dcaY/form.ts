import { html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';
import { classMap } from 'lit/directives/class-map.js';

import * as i18n from 'i18next';

import { BaseElement } from '../base/BaseElement';
import { baseStyles } from '../styles/base.css';
import { formStyles } from '../styles/form.css';

import { Account, accountCursor, DcaConfig, dcaSettingsCursor } from '../../db';
import { DatabaseController } from '../../db.ctrl';
import { humanizeAmount } from '../../utils/amount';

import { INTERVAL_DCA, APY, IntervalDca } from './types';

import { Asset } from '@galacticcouncil/sdk';

@customElement('gc-dca-y-form')
export class DcaYForm extends BaseElement {
  private account = new DatabaseController<Account>(this, accountCursor);
  private settings = new DatabaseController<DcaConfig>(this, dcaSettingsCursor);

  @property({ attribute: false }) assets: Map<string, Asset> = new Map([]);
  @property({ type: Boolean }) inProgress = false;
  @property({ type: Boolean }) disabled = false;
  @property({ type: Boolean }) loaded = false;
  @property({ type: Object }) assetIn: Asset = null;
  @property({ type: Object }) assetOut: Asset = null;
  @property({ type: String }) interval: IntervalDca = 'month';
  @property({ type: String }) amountIn = null;
  @property({ type: String }) amountInYield = null;
  @property({ type: String }) amountInFrom = null;
  @property({ type: String }) balanceIn = null;
  @property({ type: Number }) rate = null;
  @property({ type: Number }) tradesNo = null;
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
        white-space: nowrap;
        align-items: center;
      }

      @media (max-width: 480px) {
        .interval {
          padding: 0 14px;
        }
      }

      .interval div.section {
        color: var(--hex-white);
        font-style: normal;
        font-weight: 600;
        font-size: 16px;
        line-height: 100%;
        margin-right: 14px;
      }

      .interval uigc-toggle-button {
        white-space: nowrap;
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
    if (!this.est) {
      return null;
    }

    return this._dayjs()
      .add(this.est, 'millisecond')
      .format('DD-MM-YYYY HH:mm');
  }

  private getEstFreq(): string {
    if (this.est && this.tradesNo) {
      return this._humanizer.humanize(this.est / this.tradesNo, {
        round: true,
        largest: 2,
      });
    } else {
      return null;
    }
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

  infoApyTemplate() {
    return html` <span class="label">${i18n.t('yDca.form.apy')}</span>
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
        () => html` <span class="value highlight">${`${APY}%` || '-'}</span> `,
      )}`;
  }

  infoEstYieldTemplate() {
    return html` <span class="label">${i18n.t('yDca.form.yield')}</span>
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
          html`<span class="value highlight"
            >${`${humanizeAmount(this.amountInYield * this.rate)} DOT/${
              this.interval
            }` || '-'}</span
          > `,
      )}`;
  }

  infoSummaryTemplate() {
    const frequency = this.getEstFreq();
    const int = this.interval.toLowerCase();
    return html` <span class="label">${i18n.t('dca.summary')}</span>
      <span>
        <span class="value">Spend</span>
        <span class="value highlight"
          >${humanizeAmount(this.amountIn)} ${this.assetIn?.symbol}</span
        >
        <span class="value"
          >every ~${frequency} to buy ${this.assetOut?.symbol}</span
        >

        <span class="value"
          >over ${int} using expected underlying yield of</span
        >
        <span class="value highlight"
          >${humanizeAmount(this.amountInYield * this.rate)} DOT /
          ${humanizeAmount(this.amountInYield)} ${this.assetIn?.symbol}
        </span>
      </span>`;
  }

  infoSlippageTemplate() {
    const { slippage } = this.settings.state;
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
        () => html`<span class="value">${slippage}%</span> `,
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
      <div class="section">Duration of</div>
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
    </div>`;
  }

  formYieldFromTemplate() {
    const error =
      this.error['balanceTooLow'] || this.error['minInvestmentTooLow'];
    return html` <uigc-asset-transfer
      id="assetIn"
      title=${i18n.t('yDca.form.from')}
      ?readonly=${!this.loaded}
      .readonly=${!this.loaded}
      ?selectable=${false}
      .selectable=${false}
      ?error=${error}
      .error=${error}
      asset=${this.assetIn?.symbol}
      unit=${this.assetIn?.symbol}
      amount=${this.amountInFrom}
    >
      ${this.formAssetTemplate(this.assetIn, 'asset')}
      ${this.formAssetBalanceTemplate(this.balanceIn)}
    </uigc-asset-transfer>`;
  }

  formAssetOutTemplate() {
    return html` <uigc-selector
      title=${i18n.t('yDca.form.get')}
      ?readonly=${!this.loaded}
      .readonly=${!this.loaded}
      .item=${this.assetOut?.symbol}
    >
      ${this.formAssetTemplate(this.assetOut)}
    </uigc-selector>`;
  }

  render() {
    const isValid =
      this.amountInYield &&
      this.amountInFrom &&
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
        @click=${this.onScheduleClick}
        >${this.account.state
          ? i18n.t('dca.schedule')
          : i18n.t('trade.connect')}</uigc-button
      >
    `;
  }
}
