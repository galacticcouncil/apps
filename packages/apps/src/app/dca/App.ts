import { html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';
import { classMap } from 'lit/directives/class-map.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';

import { i18n } from 'localization';
import { translation } from './locales';

import { PoolApp } from 'app/PoolApp';
import { Account, DatabaseController, DcaConfig, DcaConfigCursor } from 'db';
import { TxInfo, TxMessage } from 'signer/types';
import { baseStyles } from 'styles/base.css';
import { headerStyles } from 'styles/header.css';
import { tradeLayoutStyles } from 'styles/layout/trade.css';
import { exchangeNative, formatAmount, humanizeAmount } from 'utils/amount';
import { MINUTE_MS } from 'utils/time';

import '@galacticcouncil/ui';
import {
  bnum,
  Amount,
  Asset,
  BigNumber,
  scale,
  Transaction,
  ONE,
  SYSTEM_ASSET_ID,
  Trade,
} from '@galacticcouncil/sdk';

import './Form';
import './Settings';
import 'app/trade/chart';
import 'app/trade/orders';

import 'element/selector';
import { AssetSelector } from 'element/selector/types';

import { DcaApi } from './api';
import { DcaTab, DcaState, DEFAULT_DCA_STATE, INTERVAL_DCA_MS } from './types';

@customElement('gc-dca')
export class DcaApp extends PoolApp {
  protected dcaConfig = new DatabaseController<DcaConfig>(
    this,
    DcaConfigCursor,
  );
  protected dcaApi: DcaApi = null;

  @property({ type: Boolean }) chart: Boolean = false;

  @state() tab: DcaTab = DcaTab.Form;
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
    const { amountIn } = this.dca;
    return this.isEmptyAmount(amountIn);
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
    const { assetIn, assetOut } = this.dca;
    const balanceIn = this.assets.balance.get(assetOut.id);
    this.dca = {
      ...this.dca,
      assetIn: assetOut,
      assetOut: assetIn,
      balanceIn: balanceIn,
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

  private resetDca() {
    this.dca = {
      ...this.dca,
      amountIn: null,
      frequency: null,
      trade: null,
      order: null,
    };
  }

  async updateAmountInBudget(amount: string) {
    if (this.isEmptyAmount(amount)) {
      this.resetDca();
      return;
    }

    this.dca = {
      ...this.dca,
      amountIn: amount,
    };
    this.updateTradeSize();
  }

  private async updateTradeSize(frequency?: number) {
    if (this.isSwapEmpty()) {
      return;
    }

    const { api, router } = this.chain.state;
    const { amountIn, assetIn, assetOut, interval, intervalMultiplier, trade } =
      this.dca;

    let sellTrade: Trade;
    if (frequency) {
      sellTrade = trade;
    } else {
      this.updateProgress(true);
      sellTrade = await router.getBestSell(assetIn.id, assetOut.id, amountIn);
    }

    const minBudgetNative = api.consts.dca.minBudgetInNativeCurrency.toString();
    const period = intervalMultiplier * INTERVAL_DCA_MS[interval];
    const order = await this.dcaApi.getSellOrder(
      exchangeNative(this.assets.nativePrice, assetIn, minBudgetNative),
      assetIn,
      assetOut,
      sellTrade,
      period,
      this.blockTime,
      frequency,
    );

    this.dca = {
      ...this.dca,
      inProgress: false,
      frequency: frequency,
      trade: sellTrade,
      order: order,
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
      balanceIn,
    };
  }

  validateEnoughBalance() {
    const { assetIn, amountIn } = this.dca;

    if (this.isEmptyAmount(amountIn) || !this.hasAccount()) {
      delete this.dca.error['balanceTooLow'];
      return;
    }

    const balanceIn = this.assets.balance.get(assetIn?.id);
    const amount = scale(bnum(amountIn), balanceIn.decimals);
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

    const { amountIn, assetIn } = this.dca;

    const minBudgetNative = api.consts.dca.minBudgetInNativeCurrency.toString();
    const minBudget = exchangeNative(
      this.assets.nativePrice,
      assetIn,
      minBudgetNative,
    ).shiftedBy(-1 * assetIn.decimals);

    const budget = new BigNumber(amountIn);
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
    const { order, frequency } = this.dca;

    if (this.isSwapEmpty() || !frequency) {
      delete this.dca.error['frequencyOutOfRange'];
      return;
    }

    const min = order.frequencyMin;
    const max = order.frequencyOpt;

    if (frequency >= min && frequency <= max) {
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
    const { amountIn, assetIn, assetOut, order } = dca;
    const orderHuman = order.toHuman();
    const freq = order.frequency;
    const freqHuman = this._humanizer.humanize(Number(freq) * MINUTE_MS, {
      round: true,
      largest: 2,
    });

    const message = i18n.t(tKey, {
      amountIn: humanizeAmount(orderHuman.amountIn),
      amountInBudget: amountIn,
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
    const { maxRetries } = this.dcaConfig.state;

    if (account) {
      const { order } = this.dca;
      const transaction = order.toTx(account.address, maxRetries);
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
    const { api, router } = this.chain.state;
    this.dcaApi = new DcaApi(api, router, DcaConfigCursor);
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
    if (window.innerWidth > 1023 && DcaTab.Chart == this.tab) {
      this.changeTab(DcaTab.Form);
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

  protected onAssetSwitchClick() {
    this.switch();
    this.updateTradeSize();
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
      this.updateTradeSize(value);
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

  formTab() {
    const classes = {
      tab: true,
      main: true,
      active: this.tab == DcaTab.Form,
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
          .balanceIn=${this.dca.balanceIn}
          .interval=${this.dca.interval}
          .intervalMultiplier=${this.dca.intervalMultiplier}
          .frequency=${this.dca.frequency}
          .order=${this.dca.order}
          .error=${this.dca.error}
          @asset-input-change=${this.onAssetInputChange}
          @asset-selector-click=${this.onAssetSelectorClick}
          @asset-switch-click=${this.onAssetSwitchClick}
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
              @click=${() => this.changeTab(DcaTab.Chart)}>
              <uigc-icon-chart></uigc-icon-chart>
            </uigc-icon-button>
            <uigc-icon-button
              basic
              @click=${() => this.changeTab(DcaTab.Settings)}>
              <uigc-icon-settings></uigc-icon-settings>
            </uigc-icon-button>
          </div>
        </gc-dca-form>
      </uigc-paper>
    `;
  }

  settingsTab() {
    const classes = {
      tab: true,
      main: true,
      active: this.tab == DcaTab.Settings,
    };
    return html`
      <uigc-paper class=${classMap(classes)}>
        <gc-dca-settings @settings-change=${() => this.updateTradeSize()}>
          <div class="header section" slot="header">
            <uigc-icon-button
              class="back"
              @click=${() => this.changeTab(DcaTab.Form)}>
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
    this.changeTab(DcaTab.Form);
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
          .active=${this.tab == DcaTab.SelectAsset}
          .assets=${this.assets.tradeable.filter(
            (a) => a.type !== 'Bond' && a.isSufficient,
          )}
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
              @click=${() => this.changeTab(DcaTab.Form)}>
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

  ordersSummary() {
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

  chartTab() {
    const classes = {
      tab: true,
      chart: true,
      active: this.tab == DcaTab.Chart,
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
                  @click=${() => this.changeTab(DcaTab.Form)}>
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
        ${this.chartTab()} ${this.formTab()} ${this.settingsTab()}
        ${this.ordersSummary()} ${this.selectAssetTab()}
      </div>
    `;
  }
}
