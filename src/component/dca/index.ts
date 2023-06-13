import { html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';
import { classMap } from 'lit/directives/class-map.js';

import * as i18n from 'i18next';

import { PoolApp } from '../base/PoolApp';
import { baseStyles } from '../styles/base.css';
import { headerStyles } from '../styles/header.css';
import { tradeLayoutStyles } from '../styles/layout/trade.css';

import { Account, dcaSettingsCursor } from '../../db';
import { getMinAmountOut } from '../../api/slippage';
import { INTERVAL_MS, getBlockTime, toBlockPeriod, toTimestamp } from '../../api/time';
import { formatAmount, humanizeAmount, toBn } from '../../utils/amount';
import { getRenderString } from '../../utils/dom';

import '@galacticcouncil/ui';
import {
  PoolAsset,
  Transaction,
  SYSTEM_ASSET_ID,
  Amount,
  BigNumber,
  bnum,
  scale,
  SYSTEM_ASSET_DECIMALS,
} from '@galacticcouncil/sdk';
import { SubmittableExtrinsic } from '@polkadot/api/promise/types';

import './form';
import './settings';
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
  @state() dcaPositions = {
    list: [] as DcaPosition[],
    tx: new Map<number, DcaTransaction[]>([]),
    next: new Map<number, number>([]),
    open: new Set<number>([]),
  };

  @state() asset = {
    selector: null as AssetSelector,
  };
  @state() width: number = window.innerWidth;

  @property({ type: String }) assetIn: string = null;
  @property({ type: String }) assetOut: string = null;
  @property({ type: Number }) chartDatasourceId: number = null;
  @property({ type: Boolean }) chart: Boolean = false;

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
    return amount == null || amount == '' || amount == '0';
  }

  isSwapSelected(): boolean {
    return this.dca.assetIn != null && this.dca.assetOut != null;
  }

  isSwapEmpty(): boolean {
    const { amountIn, amountInBudget } = this.dca;
    return this.isEmptyAmount(amountIn) || this.isEmptyAmount(amountInBudget);
  }

  hasError(): boolean {
    return Object.keys(this.dca.error).length > 0;
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
    const { interval, intervalBlock } = this.dca;

    let periodMsec = INTERVAL_MS[interval];
    if (intervalBlock) {
      const blockTime = await getBlockTime();
      periodMsec = intervalBlock * blockTime;
    }
    this.dca.est = periodMsec;
    this.requestUpdate();
  }

  private resetBalance() {
    this.dca.balanceIn = null;
  }

  private updateBalance() {
    const balanceIn = this.assets.balance.get(this.dca.assetIn?.id);
    this.dca = {
      ...this.dca,
      balanceIn: balanceIn && formatAmount(balanceIn.amount, balanceIn.decimals),
    };
  }

  validateEnoughBalance() {
    const assetIn = this.dca.assetIn?.id;
    const ammountIn = this.dca.amountInBudget;
    const account = this.account.state;

    if (this.isEmptyAmount(ammountIn) || !account) {
      delete this.dca.error['balanceTooLow'];
      return;
    }

    const balanceIn = this.assets.balance.get(assetIn);
    const amount = scale(bnum(ammountIn), balanceIn.decimals);
    if (amount.gt(balanceIn.amount)) {
      this.dca.error['balanceTooLow'] = i18n.t('trade.error.balance');
    } else {
      delete this.dca.error['balanceTooLow'];
    }
    this.requestUpdate();
  }

  async validateMinBudget() {
    const { api } = this.chain.state;
    if (this.isSwapEmpty()) {
      delete this.dca.error['minBudgetTooLow'];
      return;
    }

    const { amountInBudget, assetIn } = this.dca;

    const assetInMeta = this.assets.meta.get(assetIn.id);
    const assetInNativePrice = this.assets.nativePrice.get(assetIn.id);
    const minBudgetNative = api.consts.dca.minBudgetInNativeCurrency.toString();

    let minBudget: BigNumber;
    if (assetIn.id === SYSTEM_ASSET_ID) {
      minBudget = bnum(minBudgetNative).shiftedBy(-1 * SYSTEM_ASSET_DECIMALS);
    } else {
      minBudget = new BigNumber(minBudgetNative).div(new BigNumber(assetInNativePrice.amount));
    }

    const budget = new BigNumber(amountInBudget);
    if (minBudget.isGreaterThan(budget)) {
      this.dca.error['minBudgetTooLow'] = i18n.t('dca.error.minBudgetTooLow', {
        amount: humanizeAmount(minBudget.toString()),
        asset: assetInMeta.symbol,
      });
    } else {
      delete this.dca.error['minBudgetTooLow'];
    }
  }

  validateBudget() {
    if (this.isSwapEmpty()) {
      delete this.dca.error['budgetTooLow'];
      return;
    }

    const { amountIn, amountInBudget } = this.dca;

    const amountInBN = bnum(amountIn);
    const amountInBudgetBN = bnum(amountInBudget);

    if (amountInBN.isGreaterThan(amountInBudgetBN)) {
      this.dca.error['budgetTooLow'] = i18n.t('dca.error.budgetTooLow');
    } else {
      delete this.dca.error['budgetTooLow'];
    }
  }

  validateBlockPeriod() {
    const blockPeriod = this.dca.intervalBlock;
    if (!blockPeriod) {
      delete this.dca.error['blockPeriodInvalid'];
      return;
    }

    if (blockPeriod < 1) {
      this.dca.error['blockPeriodInvalid'] = i18n.t('dca.error.blockPeriodInvalid');
    } else {
      delete this.dca.error['blockPeriodInvalid'];
    }
  }

  notificationTemplate(dca: DcaState, status: string): TxNotificationMssg {
    const int = this.dca.intervalBlock
      ? this._humanizer.humanize(this.dca.est, { round: true, largest: 2 })
      : this.dca.interval.toLowerCase();
    const template = html`
      <span>${'Spend'}</span>
      <span class="highlight">${dca.amountIn}</span>
      <span class="highlight">${dca.assetIn.symbol}</span>
      <span>${`every ~${int} to buy ${dca.assetOut.symbol} with a total budget of`}</span>
      <span class="highlight">${dca.amountInBudget}</span>
      <span class="highlight">${dca.assetIn.symbol}</span>
      <span>${status}</span>
    `;
    return {
      message: template,
      rawHtml: getRenderString(template),
    } as TxNotificationMssg;
  }

  processTx(account: Account, transaction: Transaction) {
    const notification = {
      processing: this.notificationTemplate(this.dca, 'submitted'),
      success: this.notificationTemplate(this.dca, 'scheduled'),
      failure: this.notificationTemplate(this.dca, 'failed'),
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

  private async schedule() {
    const account = this.account.state;
    const chain = this.chain.state;
    if (account) {
      const { assetIn, assetOut, spotPrice, amountIn, amountInBudget, interval, intervalBlock } = this.dca;

      const assetInMeta = this.assets.meta.get(assetIn.id);
      const assetOutMeta = this.assets.meta.get(assetOut.id);

      const amountInBn = toBn(this.dca.amountIn, assetInMeta.decimals);
      const amountInBudgetBn = toBn(amountInBudget, assetInMeta.decimals);

      const amountOut = new BigNumber(amountIn).multipliedBy(new BigNumber(spotPrice)).toString();
      const amountOutBn = toBn(amountOut, assetOutMeta.decimals);
      const minAmount = getMinAmountOut(amountOutBn, assetOutMeta.decimals, '0');

      const periodMsec = INTERVAL_MS[interval];
      const periodBlock = await toBlockPeriod(this.blockTime, periodMsec);
      const slippage = dcaSettingsCursor.deref().slippage;

      const tx: SubmittableExtrinsic = chain.api.tx.dca.schedule(
        {
          owner: account.address,
          period: intervalBlock ? intervalBlock : periodBlock,
          totalAmount: amountInBudgetBn.toFixed(),
          slippage: Number(slippage) * 10000,
          order: {
            Sell: {
              assetIn: assetIn.id,
              assetOut: assetOut.id,
              amountIn: amountInBn.toFixed(),
              minLimit: '0',
              route: [{ pool: 'Omnipool', assetIn: assetIn.id, assetOut: assetOut.id }],
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

  private async syncBalance() {
    const account = this.account.state;
    if (account) {
      this.updateBalance();
      this.validateEnoughBalance();
    }
  }

  private async syncNext(scheduleId: number) {
    let nextExecutionBlock = this.dcaPositions.next.get(scheduleId);
    if (!nextExecutionBlock) {
      nextExecutionBlock = await getPlanned(scheduleId);
      if (nextExecutionBlock > this.blockNumber) {
        this.dcaPositions.next.set(scheduleId, nextExecutionBlock);
      }
    }
  }

  private async syncTransactions(scheduleId: number) {
    let transactions = this.dcaPositions.tx.get(scheduleId);
    if (!transactions) {
      transactions = await getTrades(scheduleId);
      this.dcaPositions.tx.set(scheduleId, transactions);
    }
  }

  private async syncSummary(scheduleId: number) {
    const dcaPositionsUpdated = this.dcaPositions.list.map(async (position) => {
      if (position.id == scheduleId) {
        const transactions = this.dcaPositions.tx.get(position.id) || [];
        const nextExecutionBlock = this.dcaPositions.next.get(position.id);
        const nextExecution = await toTimestamp(this.blockTime, nextExecutionBlock);
        return { ...position, transactions, nextExecutionBlock, nextExecution };
      }
      return position;
    });
    this.dcaPositions = {
      ...this.dcaPositions,
      list: await Promise.all(dcaPositionsUpdated),
    };
  }

  private togglePosition(scheduleId: number) {
    const open = this.dcaPositions.open;
    open.has(scheduleId) ? open.delete(scheduleId) : open.add(scheduleId);
  }

  private async syncPosition(scheduleId: number) {
    const open = this.dcaPositions.open.has(scheduleId);
    if (open) {
      await this.syncNext(scheduleId);
      await this.syncTransactions(scheduleId);
      await this.syncSummary(scheduleId);
    }
  }

  private resetPositions() {
    this.dcaPositions.list = [];
  }

  private async syncPositions() {
    const account = this.account.state;

    if (!account) {
      return;
    }

    const assetMeta = this.assets.meta;
    const scheduled = await getScheduled(account);
    if (assetMeta) {
      const positions = scheduled.map(async (position: DcaPosition) => {
        const assetInMeta = assetMeta.get(position.assetIn);
        const assetOutMeta = assetMeta.get(position.assetOut);
        const transactions = this.dcaPositions.tx.get(position.id) || [];
        const nextExecutionBlock = this.dcaPositions.next.get(position.id);
        const nextExecution = await toTimestamp(this.blockTime, nextExecutionBlock);
        await this.syncPosition(position.id);
        return {
          ...position,
          assetInMeta,
          assetOutMeta,
          transactions,
          nextExecution,
          nextExecutionBlock,
        } as DcaPosition;
      });
      this.dcaPositions = {
        ...this.dcaPositions,
        list: await Promise.all(positions),
      };
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
    this.syncBalance();
  }

  protected onBlockChange(): void {
    this.syncBalance();
    this.syncPositions();
  }

  protected async onAccountChange(prev: Account, curr: Account): Promise<void> {
    await super.onAccountChange(prev, curr);
    if (curr) {
      this.syncBalance();
      this.syncPositions();
    } else {
      this.resetBalance();
      this.resetPositions();
    }
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

  dcaSettingsTab() {
    const classes = {
      tab: true,
      main: true,
      active: this.tab == DcaTab.DcaSettings,
    };
    return html` <uigc-paper class=${classMap(classes)}>
      <gc-dca-settings @slippage-changed=${() => {}}>
        <div class="header section" slot="header">
          <uigc-icon-button class="back" @click=${() => this.changeTab(DcaTab.DcaForm)}>
            <uigc-icon-back></uigc-icon-back>
          </uigc-icon-button>
          <uigc-typography variant="section">${i18n.t('dca.settings.title')}</uigc-typography>
          <span></span>
        </div>
      </gc-dca-settings>
    </uigc-paper>`;
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
          this.syncBalance();
          this.validateMinBudget();
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

  dcaFormTab() {
    const classes = {
      tab: true,
      main: true,
      active: this.tab == DcaTab.DcaForm,
    };
    return html` <uigc-paper class=${classMap(classes)} id="default-tab">
      <gc-dca-form
        .assets=${this.assets.map}
        .pairs=${this.assets.pairs}
        .disabled=${!this.isSwapSelected() || this.isSwapEmpty() || this.hasError()}
        .assetIn=${this.dca.assetIn}
        .assetOut=${this.dca.assetOut}
        .amountIn=${this.dca.amountIn}
        .amountInUsd=${this.dca.amountInUsd}
        .amountInBudget=${this.dca.amountInBudget}
        .balanceIn=${this.dca.balanceIn}
        .maxPrice=${this.dca.maxPrice}
        .interval=${this.dca.interval}
        .intervalBlock=${this.dca.intervalBlock}
        .tradeFee=${this.dca.tradeFee}
        .tradeFeePct=${this.dca.tradeFeePct}
        .est=${this.dca.est}
        .error=${this.dca.error}
        @asset-input-changed=${({ detail: { id, asset, value } }: CustomEvent) => {
          id == 'assetIn' && this.updateAmountIn(value);
          id == 'assetInBudget' && this.updateAmountInBudget(value);
          id == 'maxPrice' && this.updateMaxPrice(value);
          this.validateBudget();
          this.validateMinBudget();
          this.validateEnoughBalance();
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
          this.dca.intervalBlock = null;
          this.updateEstimated();
          this.validateBlockPeriod();
        }}
        @interval-block-changed=${({ detail }: CustomEvent) => {
          this.dca.intervalBlock = detail.value;
          this.updateEstimated();
          this.validateBlockPeriod();
        }}
        @schedule-clicked=${() => this.schedule()}
      >
        <div class="header" slot="header">
          <uigc-typography variant="title" gradient>${i18n.t('dca.title')}</uigc-typography>
          <span class="grow"></span>
          <uigc-icon-button basic class="chart-btn" @click=${() => this.changeTab(DcaTab.TradeChart)}>
            <uigc-icon-chart></uigc-icon-chart>
          </uigc-icon-button>
          <uigc-icon-button basic @click=${() => this.changeTab(DcaTab.DcaSettings)}>
            <uigc-icon-settings></uigc-icon-settings>
          </uigc-icon-button>
        </div>
      </gc-dca-form>
    </uigc-paper>`;
  }

  dcaPositionsSummary() {
    const classes = {
      positions: true,
    };
    return html` <div class=${classMap(classes)}>
      ${when(
        this.width > 768,
        () => html` <gc-dca-positions
          .defaultData=${this.dcaPositions.list}
          @dca-clicked=${({ detail: { id } }: CustomEvent) => {
            this.togglePosition(id);
            this.syncPosition(id);
          }}
        >
          <uigc-typography slot="header" class="title">DCA</uigc-typography>
          <uigc-typography slot="header" variant="title">Orders</uigc-typography>
        </gc-dca-positions>`,
        () => html` <gc-dca-positions-mob
          .defaultData=${this.dcaPositions.list}
          @dca-clicked=${({ detail: { id } }: CustomEvent) => {
            this.togglePosition(id);
            this.syncPosition(id);
          }}
        >
          <uigc-typography slot="header" class="title">DCA</uigc-typography>
          <uigc-typography slot="header" variant="title">Orders</uigc-typography>
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
        ${this.tradeChartTab()} ${this.dcaFormTab()} ${this.dcaSettingsTab()} ${this.dcaPositionsSummary()}
        ${this.selectAssetTab()}
      </div>
    `;
  }
}
