import { html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';
import { classMap } from 'lit/directives/class-map.js';

import * as i18n from 'i18next';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

import { PoolApp } from '../base/PoolApp';
import { baseStyles } from '../styles/base.css';
import { headerStyles } from '../styles/header.css';
import { tradeLayoutStyles } from '../styles/layout/trade.css';

import { Account } from '../../db';
import { getMinAmountOut } from '../../api/slippage';
import { INTERVAL_MS, blocktoTs, intervalAsBlockNo } from '../../api/time';
import { formatAmount, toBn } from '../../utils/amount';
import { getRenderString } from '../../utils/dom';

import '@galacticcouncil/ui';
import { PoolAsset, Transaction, SYSTEM_ASSET_ID, Amount, BigNumber } from '@galacticcouncil/sdk';
import { SubmittableExtrinsic } from '@polkadot/api/promise/types';

import './form';
import './positions/desktop';
import './positions/mobile';
import '../selector/asset';

import { DcaTab, DcaState, DEFAULT_DCA_STATE } from './types';
import { TxInfo, TxNotificationMssg } from '../transaction/types';
import { AssetSelector } from '../selector/types';

import { DcaPosition, DcaTransaction } from './positions/types';
import { getPlanned, getScheduled, getTrades } from './positions/api';

@customElement('gc-dca-app')
export class DcaApp extends PoolApp {
  @state() tab: DcaTab = DcaTab.DcaForm;
  @state() dca: DcaState = { ...DEFAULT_DCA_STATE };
  @state() dcaPositions: DcaPosition[] = [];
  @state() dcaTransactions: Map<number, DcaTransaction[]> = new Map([]);
  @state() dcaPlanned: Map<number, number> = new Map([]);

  @state() asset = {
    selector: null as AssetSelector,
  };
  @state() width: number = window.innerWidth;

  @property({ type: String }) assetIn: string = null;
  @property({ type: String }) assetOut: string = null;
  @property({ type: Number }) chartDatasourceId: number = null;
  @property({ type: Boolean }) chart: Boolean = false;

  constructor() {
    super();
    dayjs.extend(utc);
  }

  static styles = [
    baseStyles,
    headerStyles,
    tradeLayoutStyles,
    css`
      :host {
        max-width: 480px;
      }

      .positions {
        background: var(--uigc-app-background-color);
        overflow: hidden;
      }

      .positions .title {
        color: var(--uigc-app-font-color__primary);
        font-family: var(--uigc-app-font-secondary);
        font-weight: var(--uigc-typography__title-font-weight);
        padding: 0 5px;
      }

      .positions uigc-typography {
        font-size: 15px;
      }

      @media (min-width: 480px) {
        .positions {
          border-radius: var(--uigc-app-border-radius);
        }
      }
    `,
  ];

  isEmptyAmount(amount: string): boolean {
    return amount == '' || amount == '0';
  }

  changeTab(active: DcaTab) {
    this.tab = active;
    this.requestUpdate();
  }

  private async recalculateSpotPrice() {
    const assetIn = this.dca.assetIn;
    const assetOut = this.dca.assetOut;

    if (!assetIn || !assetOut) {
      return;
    }

    const router = this.chain.state.router;
    const price: Amount = await router.getBestSpotPrice(assetIn.id, assetOut.id);
    const spotPrice: string = formatAmount(price.amount, price.decimals);

    this.dca = {
      ...this.dca,
      spotPrice: spotPrice,
    };
  }

  private switch() {
    this.dca = {
      ...this.dca,
      assetIn: this.dca.assetOut,
      assetOut: this.dca.assetIn,
    };
    this.recalculateSpotPrice();
  }

  private async changeAssetIn(previous: string, asset: PoolAsset) {
    const assetIn = asset;
    const assetOut = this.dca.assetOut;

    // Switch if selecting the same asset
    if (assetIn.id === assetOut?.id) {
      this.switch();
      return;
    }

    this.dca = {
      ...this.dca,
      assetIn: asset,
    };
  }

  private async changeAssetOut(previous: string, asset: PoolAsset) {
    const assetIn = this.dca.assetIn;
    const assetOut = asset;

    // Switch if selecting the same asset
    if (assetOut.id === assetIn?.id) {
      this.switch();
      return;
    }

    this.dca = {
      ...this.dca,
      assetOut: asset,
    };
  }

  updateAmountIn(amount: string) {
    this.dca = {
      ...this.dca,
      amountIn: amount,
    };
    this.updateEstimated();
  }

  updateAmountInBudget(amount: string) {
    this.dca = {
      ...this.dca,
      amountInBudget: amount,
    };
    this.updateEstimated();
  }

  updateMaxPrice(amount: string) {
    this.dca = {
      ...this.dca,
      maxPrice: amount,
    };
  }

  private updateAsset(asset: string, assetKey: string) {
    if (asset) {
      this.dca[assetKey] = this.assets.map.get(asset);
    } else {
      this.dca[assetKey] = null;
    }
  }

  private async updateEstimated() {
    const amountIn = this.dca.amountIn;
    const amountInBudget = this.dca.amountInBudget;

    if (!amountIn || !amountInBudget) {
      this.dca.est = null;
      return;
    }

    const aIn = Number(amountIn);
    const aInbudget = Number(amountInBudget);
    const reps = Math.floor(aInbudget / aIn);
    const interval = INTERVAL_MS[this.dca.interval];
    const est = dayjs()
      .add(interval * reps, 'millisecond')
      .format('DD-MM-YYYY HH:mm');

    this.dca.est = est;
    this.requestUpdate();
  }

  notificationTemplate(msg: String): TxNotificationMssg {
    const template = html` <span>${msg}</span> `;
    return {
      message: template,
      rawHtml: getRenderString(template),
    } as TxNotificationMssg;
  }

  processTx(account: Account, transaction: Transaction) {
    const notification = {
      processing: this.notificationTemplate('processing'),
      success: this.notificationTemplate('In block'),
      failure: this.notificationTemplate('Failed'),
    };
    const options = {
      bubbles: true,
      composed: true,
      detail: {
        account: account,
        transaction: transaction,
        notification: notification,
      } as TxInfo,
    };
    this.dispatchEvent(new CustomEvent<TxInfo>('gc:tx:scheduleDca', options));
  }

  async schedule() {
    const account = this.account.state;
    const chain = this.chain.state;
    if (account) {
      const assetIn = this.dca.assetIn.id;
      const assetInMeta = this.assets.meta.get(assetIn);
      const assetOut = this.dca.assetOut.id;
      const assetOutMeta = this.assets.meta.get(assetOut);

      const spotPrice = this.dca.spotPrice;
      const amountIn = this.dca.amountIn;
      const amountInBn = toBn(this.dca.amountIn, assetInMeta.decimals);
      const amountInBudget = this.dca.amountInBudget;
      const amountInBudgetBn = toBn(amountInBudget, assetInMeta.decimals);

      const amountOut = new BigNumber(amountIn).multipliedBy(new BigNumber(spotPrice)).toString();
      const amountOutBn = toBn(amountOut, assetOutMeta.decimals);
      const minAmount = getMinAmountOut(amountOutBn, assetOutMeta.decimals, '0');

      const interval = this.dca.interval;
      const period = await intervalAsBlockNo(interval);

      const tx: SubmittableExtrinsic = chain.api.tx.dca.schedule(
        {
          owner: account.address,
          period: period,
          totalAmount: amountInBudgetBn.toFixed(),
          order: {
            Sell: {
              assetIn: assetIn,
              assetOut: assetOut,
              amountIn: amountInBn.toFixed(),
              minLimit: '0',
              slippage: '50000',
              route: [{ pool: 'Omnipool', assetIn: assetIn, assetOut: assetOut }],
            },
          },
        },
        null
      );

      const transaction = {
        hex: tx.toHex(),
        name: 'dcaSchedule',
        get: (): SubmittableExtrinsic => {
          return tx;
        },
      } as Transaction;
      this.processTx(account, transaction);
    }
  }

  private async syncPlanned(scheduleId: number) {
    const chain = this.chain.state;
    const currentBlockNo = await chain.api.query.system.number();

    let nextExecutionBlock = this.dcaPlanned.get(scheduleId);
    if (!nextExecutionBlock) {
      nextExecutionBlock = await getPlanned(scheduleId);
      if (nextExecutionBlock > currentBlockNo.toNumber()) {
        const nextExecution = await blocktoTs(nextExecutionBlock);
        this.dcaPlanned.set(scheduleId, nextExecution);
      }
    }
  }

  private async syncTransactions(scheduleId: number) {
    let transactions = this.dcaTransactions.get(scheduleId);
    if (!transactions) {
      transactions = await getTrades(scheduleId);
      this.dcaTransactions.set(scheduleId, transactions);
    }
  }

  async syncSummary(scheduleId: number) {
    await this.syncPlanned(scheduleId);
    await this.syncTransactions(scheduleId);
    const dcaPositionsUpdated = this.dcaPositions.map((position) => {
      if (position.id == scheduleId) {
        const transactions = this.dcaTransactions.get(position.id) || [];
        const nextExecution = this.dcaPlanned.get(position.id);
        return { ...position, transactions, nextExecution };
      }
      return position;
    });
    this.dcaPositions = dcaPositionsUpdated;
  }

  async syncPositions() {
    const account = this.account.state;
    const assetMeta = this.assets.meta;
    const scheduled = await getScheduled(account);
    if (assetMeta) {
      const positions = scheduled.map((position: DcaPosition) => {
        const assetInMeta = assetMeta.get(position.assetIn);
        const assetOutMeta = assetMeta.get(position.assetOut);
        const transactions = this.dcaTransactions.get(position.id) || [];
        const nextExecution = this.dcaPlanned.get(position.id);
        return {
          ...position,
          assetInMeta,
          assetOutMeta,
          transactions,
          nextExecution,
        } as DcaPosition;
      });
      this.dcaPositions = positions;
    }
  }

  protected onInit(): void {
    if (!this.assetIn && !this.assetOut) {
      this.dca.assetIn = this.assets.map.get(this.stableCoinAssetId);
      this.dca.assetOut = this.assets.map.get(SYSTEM_ASSET_ID);
    } else {
      this.updateAsset(this.assetIn, 'assetIn');
      this.updateAsset(this.assetOut, 'assetOut');
    }
    this.recalculateSpotPrice();
  }

  protected onBlockChange(): void {
    this.syncPositions();
  }

  protected async onAccountChange(prev: Account, curr: Account): Promise<void> {
    super.onAccountChange(prev, curr);
  }

  onResize(_evt: UIEvent) {
    if (window.innerWidth > 1023 && DcaTab.TradeChart == this.tab) {
      this.changeTab(DcaTab.DcaForm);
    }
    this.width = window.innerWidth;
  }

  override connectedCallback() {
    super.connectedCallback();
    window.addEventListener('resize', (evt) => this.onResize(evt));
  }

  override disconnectedCallback() {
    window.removeEventListener('resize', this.onResize);
    super.disconnectedCallback();
  }

  selectAssetTab() {
    const classes = {
      tab: true,
      main: true,
      active: this.tab == DcaTab.SelectAsset,
    };
    return html` <uigc-paper class=${classMap(classes)}>
      <gc-select-asset
        .assets=${this.assets.list}
        .pairs=${this.assets.pairs}
        .details=${this.assets.details}
        .balances=${this.assets.balance}
        .usdPrice=${this.assets.usdPrice}
        .switchAllowed=${false}
        .selector=${this.asset.selector}
        @asset-clicked=${(e: CustomEvent) => {
          const { id, asset } = this.asset.selector;
          id == 'assetIn' && this.changeAssetIn(asset, e.detail);
          id == 'assetGet' && this.changeAssetOut(asset, e.detail);
          this.changeTab(DcaTab.DcaForm);
        }}
      >
        <div class="header section" slot="header">
          <uigc-icon-button class="back" @click=${() => this.changeTab(DcaTab.DcaForm)}>
            <uigc-icon-back></uigc-icon-back>
          </uigc-icon-button>
          <uigc-typography variant="section">${i18n.t('dca.selectAsset')}</uigc-typography>
          <span></span>
        </div>
      </gc-select-asset>
    </uigc-paper>`;
  }

  investFormTab() {
    const classes = {
      tab: true,
      main: true,
      active: this.tab == DcaTab.DcaForm,
    };
    return html` <uigc-paper class=${classMap(classes)} id="default-tab">
      <gc-dca-form
        .assets=${this.assets.map}
        .pairs=${this.assets.pairs}
        .assetIn=${this.dca.assetIn}
        .assetOut=${this.dca.assetOut}
        .amountIn=${this.dca.amountIn}
        .amountInUsd=${this.dca.amountInUsd}
        .amountInBudget=${this.dca.amountInBudget}
        .maxPrice=${this.dca.maxPrice}
        .interval=${this.dca.interval}
        .tradeFee=${this.dca.tradeFee}
        .tradeFeePct=${this.dca.tradeFeePct}
        .est=${this.dca.est}
        @asset-input-changed=${({ detail: { id, asset, value } }: CustomEvent) => {
          id == 'assetIn' && this.updateAmountIn(value);
          id == 'assetInBudget' && this.updateAmountInBudget(value);
          id == 'maxPrice' && this.updateMaxPrice(value);
        }}
        @asset-selector-clicked=${({ detail }: CustomEvent) => {
          this.asset.selector = detail;
          this.changeTab(DcaTab.SelectAsset);
        }}
        @selector-clicked=${({ detail }: CustomEvent) => {
          this.asset.selector = { ...detail, id: 'assetGet' };
          this.changeTab(DcaTab.SelectAsset);
        }}
        @interval-changed=${({ detail }: CustomEvent) => {
          this.dca.interval = detail.value;
          this.updateEstimated();
        }}
        @schedule-clicked=${() => this.schedule()}
      >
        <div class="header" slot="header">
          <uigc-typography variant="title" gradient>${i18n.t('dca.title')}</uigc-typography>
          <span class="grow"></span>
          <uigc-icon-button basic class="chart-btn" @click=${() => this.changeTab(DcaTab.TradeChart)}>
            <uigc-icon-chart></uigc-icon-chart>
          </uigc-icon-button>
        </div>
      </gc-dca-form>
    </uigc-paper>`;
  }

  investPositionsSummary() {
    const classes = {
      positions: true,
    };
    return html` <div class=${classMap(classes)}>
      ${when(
        this.width > 768,
        () => html` <gc-dca-positions
          @dca-clicked=${({ detail: { id } }: CustomEvent) => this.syncSummary(id)}
          .defaultData=${this.dcaPositions}
        >
          <uigc-typography slot="header" variant="title">Active</uigc-typography>
          <uigc-typography slot="header" class="title">DCA</uigc-typography>
          <uigc-typography slot="header" variant="title">Positions</uigc-typography>
        </gc-dca-positions>`,
        () => html` <gc-dca-positions-mob
          @dca-clicked=${({ detail: { id } }: CustomEvent) => this.syncSummary(id)}
          .defaultData=${this.dcaPositions}
        >
          <uigc-typography slot="header" variant="title">Active</uigc-typography>
          <uigc-typography slot="header" class="title">DCA</uigc-typography>
          <uigc-typography slot="header" variant="title">Positions</uigc-typography>
        </gc-dca-positions-mob>`
      )}
    </div>`;
  }

  tradeChartTab() {
    const classes = {
      tab: true,
      chart: true,
      active: this.tab == DcaTab.TradeChart,
    };
    return html` <uigc-paper class=${classMap(classes)}>
      ${when(
        this.chart,
        () => html`
          <gc-trade-chart
            .datasourceId=${this.chartDatasourceId}
            .assetIn=${this.dca.assetIn}
            .assetOut=${this.dca.assetOut}
            .spotPrice=${this.dca.spotPrice}
            .usdPrice=${this.assets.usdPrice}
            .details=${this.assets.details}
          >
            <div class="header section" slot="header">
              <uigc-icon-button class="back" @click=${() => this.changeTab(DcaTab.DcaForm)}>
                <uigc-icon-back></uigc-icon-back>
              </uigc-icon-button>
              <uigc-typography variant="section">${i18n.t('chart.title')}</uigc-typography>
              <span></span>
            </div>
          </gc-trade-chart>
        `
      )}
    </uigc-paper>`;
  }

  render() {
    return html`
      <div class="layout-root">
        ${this.tradeChartTab()} ${this.investFormTab()} ${this.investPositionsSummary()} ${this.selectAssetTab()}
      </div>
    `;
  }
}
