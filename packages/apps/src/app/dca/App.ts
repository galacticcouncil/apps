import { html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';
import { classMap } from 'lit/directives/class-map.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';

import { i18n } from 'localization';
import { translation } from './locales';

import { TradeApi } from 'api/trade';
import { PoolApp } from 'app/PoolApp';
import { Account, DatabaseController, DcaConfig, DcaConfigCursor } from 'db';
import { TxInfo, TxMessage } from 'signer/types';
import { baseStyles } from 'styles/base.css';
import { headerStyles } from 'styles/header.css';
import { tradeLayoutStyles } from 'styles/layout/trade.css';
import {
  formatAmount,
  humanizeAmount,
  toBn,
  MIN_NATIVE_AMOUNT,
} from 'utils/amount';
import { MINUTE_MS } from 'utils/time';

import '@galacticcouncil/ui';
import {
  bnum,
  buildRoute,
  Amount,
  Asset,
  BigNumber,
  scale,
  Transaction,
  ONE,
  SYSTEM_ASSET_ID,
} from '@galacticcouncil/sdk';
import { SubmittableExtrinsic } from '@polkadot/api/promise/types';

import './Form';
import './Settings';
import 'app/trade/chart';
import 'app/trade/orders';

import 'element/selector';
import { AssetSelector } from 'element/selector/types';

import { DcaTab, DcaState, DEFAULT_DCA_STATE, INTERVAL_DCA_MS } from './types';

@customElement('gc-dca')
export class DcaApp extends PoolApp {
  protected settings = new DatabaseController<DcaConfig>(this, DcaConfigCursor);
  protected tradeApi: TradeApi = null;

  @property({ type: Boolean }) chart: Boolean = false;

  @state() tab: DcaTab = DcaTab.DcaForm;
  @state() dca: DcaState = { ...DEFAULT_DCA_STATE };
  @state() asset = {
    selector: null as AssetSelector,
  };

  constructor() {
    super();
    i18n.init({
      debug: false,
      lng: 'en',
      postProcess: ['highlight'],
      resources: {
        en: {
          translation: translation.en,
        },
      },
    });
  }

  static styles = [
    baseStyles,
    headerStyles,
    tradeLayoutStyles,
    css`
      :host {
        max-width: 480px;
      }

      .orders uigc-typography {
        font-size: 15px;
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

  updateProgress(status: boolean): void {
    this.dca.inProgress = status;
    this.requestUpdate();
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
    const price: Amount = await router.getBestSpotPrice(
      assetIn.id,
      assetOut.id,
    );
    const spotPrice = scale(ONE, price.decimals).div(price.amount).toFixed();

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

  private async changeAssetIn(previous: string, asset: Asset) {
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
    this.recalculateSpotPrice();
  }

  private async changeAssetOut(previous: string, asset: Asset) {
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
    this.recalculateSpotPrice();
  }

  async updateAmountInBudget(amount: string) {
    this.dca = {
      ...this.dca,
      amountInBudget: amount,
    };
    this.updateTradeSize();
  }

  async updateFrequency(frequency: number) {
    const freq = Number(frequency);
    if (freq === 0) {
      this.updateTradeSize();
      return;
    }

    const { amountInBudget, interval, intervalMultiplier } = this.dca;
    const periodMsec = intervalMultiplier * INTERVAL_DCA_MS[interval];
    const periodMin = periodMsec / MINUTE_MS;
    const budget = Number(amountInBudget);
    const tradesNo = Math.round(periodMin / frequency);
    const optTradesNo = tradesNo === 1 ? 2 : tradesNo;

    const amountPerTrade = budget / optTradesNo;
    this.dca = {
      ...this.dca,
      amountIn: amountPerTrade.toFixed(4),
      frequencyManual: frequency,
      tradesNo: optTradesNo,
    };
    this.validateFrequency();
    this.validateMinBudget();
    this.validateEnoughBalance();
  }

  private async updateTradeSize() {
    const { api, router } = this.chain.state;
    const { amountInBudget, assetIn, assetOut, interval, intervalMultiplier } =
      this.dca;

    this.updateProgress(true);
    const bestSell = await router.getBestSell(
      assetIn.id,
      assetOut.id,
      amountInBudget,
    );
    const bestSellHuman = bestSell.toHuman();
    console.log(bestSellHuman);

    const priceDifference = this.tradeApi.getSellPriceDifference(
      Number(amountInBudget),
      Number(bestSellHuman.spotPrice),
      bestSellHuman.swaps,
    );

    const minBudgetNative = api.consts.dca.minBudgetInNativeCurrency.toString();
    const minAmountIn = this.calculateAssetPrice(assetIn, minBudgetNative)
      .multipliedBy(0.2) // 20% from budget
      .toNumber();

    const periodMsec = intervalMultiplier * INTERVAL_DCA_MS[interval];
    const periodMinutes = periodMsec / MINUTE_MS;
    const budget = Number(amountInBudget);

    const minTradesNo = Math.round(budget / minAmountIn);
    const optTradesNo = Math.round(priceDifference.toNumber() * 10) || 1;
    const avgTradesNo = optTradesNo === 1 ? 2 : optTradesNo;

    const minFreq = Math.ceil(periodMinutes / minTradesNo);
    const avgFreq = Math.round(periodMinutes / avgTradesNo);

    const amountIn = Math.round(budget / avgTradesNo);
    this.dca = {
      ...this.dca,
      amountIn: amountIn.toFixed(4),
      frequency: avgFreq,
      frequencyManual: null,
      frequencyRange: [minFreq, avgFreq],
      tradesNo: avgTradesNo,
      inProgress: false,
    };
    this.validateFrequency();
    this.validateMinBudget();
    this.validateEnoughBalance();
  }

  private resetBalance() {
    this.dca.balanceIn = null;
  }

  private updateBalance() {
    const balanceIn = this.assets.balance.get(this.dca.assetIn?.id);
    this.dca = {
      ...this.dca,
      balanceIn:
        balanceIn && formatAmount(balanceIn.amount, balanceIn.decimals),
    };
  }

  validateEnoughBalance() {
    const assetIn = this.dca.assetIn?.id;
    const ammountIn = this.dca.amountInBudget;

    if (this.isEmptyAmount(ammountIn) || !this.hasAccount()) {
      delete this.dca.error['balanceTooLow'];
      return;
    }

    const balanceIn = this.assets.balance.get(assetIn);
    const amount = scale(bnum(ammountIn), balanceIn.decimals);
    if (amount.gt(balanceIn.amount)) {
      this.dca.error['balanceTooLow'] = i18n.t('error.insufficientBalance');
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

    const minBudgetNative = api.consts.dca.minBudgetInNativeCurrency.toString();
    const minBudget = this.calculateAssetPrice(assetIn, minBudgetNative);
    const budget = new BigNumber(amountInBudget);
    if (minBudget.isGreaterThan(budget)) {
      this.dca.error['minBudgetTooLow'] = i18n.t('error.minBudgetTooLow', {
        amount: humanizeAmount(minBudget.toString()),
        asset: assetIn.symbol,
      });
    } else {
      delete this.dca.error['minBudgetTooLow'];
    }
  }

  async validateFrequency() {
    const { frequencyManual, frequencyRange } = this.dca;
    const freq = Number(frequencyManual);

    if (this.isSwapEmpty() || freq === 0) {
      delete this.dca.error['frequencyOutOfRange'];
      return;
    }

    const [min, max] = frequencyRange;
    if (frequencyManual >= min && frequencyManual <= max) {
      delete this.dca.error['frequencyOutOfRange'];
    } else {
      this.dca.error['frequencyOutOfRange'] = i18n.t(
        'error.frequencyOutOfRange',
        {
          min: min,
          max: max,
        },
      );
    }
  }

  notificationTemplate(dca: DcaState, tKey: string): TxMessage {
    const {
      amountIn,
      amountInBudget,
      assetIn,
      assetOut,
      frequency,
      frequencyManual,
    } = dca;
    const freq = frequencyManual || frequency;
    const freqHuman = this._humanizer.humanize(Number(freq) * MINUTE_MS, {
      round: true,
      largest: 2,
    });

    const message = i18n.t(tKey, {
      amountIn: amountIn,
      amountInBudget: amountInBudget,
      assetIn: assetIn?.symbol,
      assetOut: assetOut?.symbol,
      frequency: freqHuman,
    });
    return {
      message: unsafeHTML(message),
      rawHtml: message,
    } as TxMessage;
  }

  private processTx(account: Account, transaction: Transaction) {
    const notification = {
      processing: this.notificationTemplate(this.dca, 'notify.processing'),
      success: this.notificationTemplate(this.dca, 'notify.success'),
      failure: this.notificationTemplate(this.dca, 'notify.error'),
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

  private async onSchedule() {
    const account = this.account.state;
    const { api, router } = this.chain.state;
    const { slippage, maxRetries } = this.settings.state;

    if (account) {
      const { assetIn, assetOut, amountInBudget, frequency, frequencyManual } =
        this.dca;

      const amountInBn = toBn(this.dca.amountIn, assetIn.decimals);
      const amountInBudgetBn = toBn(amountInBudget, assetIn.decimals);

      const freq = frequencyManual || frequency;
      const periodBlock = this.timeApi.toBlockPeriod(
        this.blockTime,
        Number(freq) * MINUTE_MS,
      );
      const sell = await router.getBestSell(
        assetIn.id,
        assetOut.id,
        this.dca.amountIn,
      );
      const tx: SubmittableExtrinsic = api.tx.dca.schedule(
        {
          owner: account.address,
          period: periodBlock,
          maxRetries,
          totalAmount: amountInBudgetBn.toFixed(),
          slippage: Number(slippage) * 10000,
          order: {
            Sell: {
              assetIn: assetIn.id,
              assetOut: assetOut.id,
              amountIn: amountInBn.toFixed(),
              minAmountOut: '0',
              route: buildRoute(sell.swaps),
            },
          },
        },
        null,
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

  private updateAsset(asset: string, assetKey: string) {
    if (asset) {
      this.dca[assetKey] = this.assets.registry.get(asset);
    } else {
      this.dca[assetKey] = null;
    }
  }

  protected initAssets() {
    if (!this.assetIn && !this.assetOut) {
      this.dca.assetIn = this.assets.registry.get(this.stableCoinAssetId);
      this.dca.assetOut = this.assets.registry.get(SYSTEM_ASSET_ID);
    } else {
      this.updateAsset(this.assetIn, 'assetIn');
      this.updateAsset(this.assetOut, 'assetOut');
    }
  }

  protected onInit(): void {
    const { router } = this.chain.state;
    this.tradeApi = new TradeApi(router);
    this.initAssets();
    this.recalculateSpotPrice();
    this.syncBalance();
  }

  protected onBlockChange(): void {}

  protected onBalanceUpdate(): void {
    this.requestUpdate();
    this.syncBalance();
  }

  protected async onAccountChange(prev: Account, curr: Account): Promise<void> {
    await super.onAccountChange(prev, curr);
    if (curr) {
      this.syncBalance();
    } else {
      this.resetBalance();
    }
  }

  onResize(_evt: UIEvent) {
    if (window.innerWidth > 1023 && DcaTab.TradeChart == this.tab) {
      this.changeTab(DcaTab.DcaForm);
    }
  }

  override connectedCallback() {
    super.connectedCallback();
    window.addEventListener('resize', (evt) => this.onResize(evt));
  }

  override disconnectedCallback() {
    window.removeEventListener('resize', this.onResize);
    super.disconnectedCallback();
  }

  protected onAssetInputChange({ detail: { id, value } }) {
    this.updateAmountInBudget(value);
  }

  protected onAssetSelectorClick({ detail }: CustomEvent) {
    this.asset.selector = detail;
    this.changeTab(DcaTab.SelectAsset);
  }

  protected onSelectorClick({ detail: { item } }) {
    if (!item || item === '') {
      return;
    }
    this.asset.selector = { id: 'assetOut', asset: item } as AssetSelector;
    this.changeTab(DcaTab.SelectAsset);
  }

  protected onIntervalChange({ detail }: CustomEvent) {
    this.dca.interval = detail.value;
    this.updateTradeSize();
  }

  protected onIntervalMultiplierChange({ detail }: CustomEvent) {
    this.dca.intervalMultiplier = detail.value;
    this.updateTradeSize();
  }

  protected onFrequencyChange({ detail: { value } }: CustomEvent) {
    const freq = Number(value);
    if (freq > 0) {
      this.updateFrequency(value);
    } else {
      this.updateTradeSize();
    }
  }

  protected isFormDisabled() {
    return !this.isSwapSelected() || this.isSwapEmpty() || this.hasError();
  }

  protected isFormLoaded() {
    return this.assets.tradeable.length > 0;
  }

  dcaFormTab() {
    const classes = {
      tab: true,
      main: true,
      active: this.tab == DcaTab.DcaForm,
    };
    return html`
      <uigc-paper class=${classMap(classes)} id="default-tab">
        <gc-dca-form
          .assets=${this.assets.registry}
          .inProgress=${this.dca.inProgress}
          .disabled=${this.isFormDisabled()}
          .loaded=${this.isFormLoaded()}
          .assetIn=${this.dca.assetIn}
          .assetOut=${this.dca.assetOut}
          .amountIn=${this.dca.amountIn}
          .amountInUsd=${this.dca.amountInUsd}
          .amountInBudget=${this.dca.amountInBudget}
          .balanceIn=${this.dca.balanceIn}
          .interval=${this.dca.interval}
          .intervalMultiplier=${this.dca.intervalMultiplier}
          .frequency=${this.dca.frequency}
          .frequencyManual=${this.dca.frequencyManual}
          .tradeFee=${this.dca.tradeFee}
          .tradeFeePct=${this.dca.tradeFeePct}
          .tradesNo=${this.dca.tradesNo}
          .error=${this.dca.error}
          @asset-input-change=${this.onAssetInputChange}
          @asset-selector-click=${this.onAssetSelectorClick}
          @selector-click=${this.onSelectorClick}
          @interval-change=${this.onIntervalChange}
          @interval-mul-change=${this.onIntervalMultiplierChange}
          @frequency-change=${this.onFrequencyChange}
          @schedule-click=${() => this.onSchedule()}>
          <div class="header" slot="header">
            <uigc-typography variant="title" gradient>
              ${i18n.t('header.form')}
            </uigc-typography>
            <span class="grow"></span>
            <uigc-icon-button
              basic
              class="chart-btn"
              @click=${() => this.changeTab(DcaTab.TradeChart)}>
              <uigc-icon-chart></uigc-icon-chart>
            </uigc-icon-button>
            <uigc-icon-button
              basic
              @click=${() => this.changeTab(DcaTab.DcaSettings)}>
              <uigc-icon-settings></uigc-icon-settings>
            </uigc-icon-button>
          </div>
        </gc-dca-form>
      </uigc-paper>
    `;
  }

  dcaSettingsTab() {
    const classes = {
      tab: true,
      main: true,
      active: this.tab == DcaTab.DcaSettings,
    };
    return html`
      <uigc-paper class=${classMap(classes)}>
        <gc-dca-settings @slippage-change=${() => {}}>
          <div class="header section" slot="header">
            <uigc-icon-button
              class="back"
              @click=${() => this.changeTab(DcaTab.DcaForm)}>
              <uigc-icon-back></uigc-icon-back>
            </uigc-icon-button>
            <uigc-typography variant="section">
              ${i18n.t('header.settings')}
            </uigc-typography>
            <span></span>
          </div>
        </gc-dca-settings>
      </uigc-paper>
    `;
  }

  protected onAssetClick(e: CustomEvent) {
    const { id, asset } = this.asset.selector;
    id == 'assetIn' && this.changeAssetIn(asset, e.detail);
    id == 'assetOut' && this.changeAssetOut(asset, e.detail);
    this.syncBalance();
    this.updateTradeSize();
    this.changeTab(DcaTab.DcaForm);
  }

  selectAssetTab() {
    const classes = {
      tab: true,
      main: true,
      active: this.tab == DcaTab.SelectAsset,
    };
    return html`
      <uigc-paper class=${classMap(classes)}>
        <gc-select-asset
          .assets=${this.assets.tradeable.filter((a) => a.type !== 'Bond')}
          .pairs=${this.assets.pairs}
          .balances=${this.assets.balance}
          .usdPrice=${this.assets.usdPrice}
          .assetIn=${this.dca.assetIn}
          .assetOut=${this.dca.assetOut}
          .switchAllowed=${false}
          .selector=${this.asset.selector}
          @asset-click=${this.onAssetClick}>
          <div class="header section" slot="header">
            <uigc-icon-button
              class="back"
              @click=${() => this.changeTab(DcaTab.DcaForm)}>
              <uigc-icon-back></uigc-icon-back>
            </uigc-icon-button>
            <uigc-typography variant="section">
              ${i18n.t('header.select')}
            </uigc-typography>
            <span></span>
          </div>
        </gc-select-asset>
      </uigc-paper>
    `;
  }

  tradeOrdersSummary() {
    const account = this.account.state;
    return html`
      <gc-trade-orders
        class="orders"
        .assets=${this.assets.registry}
        .indexerUrl=${this.indexerUrl}
        .grafanaUrl=${this.grafanaUrl}
        .grafanaDsn=${this.grafanaDsn}
        .accountAddress=${account?.address}
        .accountProvider=${account?.provider}
        .accountName=${account?.name}>
        <uigc-typography slot="header" variant="title">
          ${i18n.t('header.orders')}
        </uigc-typography>
      </gc-trade-orders>
    `;
  }

  tradeChartTab() {
    const classes = {
      tab: true,
      chart: true,
      active: this.tab == DcaTab.TradeChart,
    };
    return html`
      <uigc-paper class=${classMap(classes)}>
        ${when(
          this.chart,
          () => html`
            <gc-trade-chart
              .grafanaUrl=${this.grafanaUrl}
              .grafanaDsn=${this.grafanaDsn}
              .assetIn=${this.dca.assetIn}
              .assetOut=${this.dca.assetOut}
              .spotPrice=${this.dca.spotPrice}
              .usdPrice=${this.assets.usdPrice}>
              <div class="header section" slot="header">
                <uigc-icon-button
                  class="back"
                  @click=${() => this.changeTab(DcaTab.DcaForm)}>
                  <uigc-icon-back></uigc-icon-back>
                </uigc-icon-button>
                <uigc-typography variant="section">
                  ${i18n.t('header.chart')}
                </uigc-typography>
                <span></span>
              </div>
            </gc-trade-chart>
          `,
        )}
      </uigc-paper>
    `;
  }

  render() {
    return html`
      <div class="layout-root">
        ${this.tradeChartTab()} ${this.dcaFormTab()} ${this.dcaSettingsTab()}
        ${this.tradeOrdersSummary()} ${this.selectAssetTab()}
      </div>
    `;
  }
}
