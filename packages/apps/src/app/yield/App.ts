import { html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';
import { classMap } from 'lit/directives/class-map.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';

import { i18n } from 'localization';
import { translation } from './locales';

import { PoolApp } from 'app/PoolApp';
import { Account, DatabaseController, DcaConfig, DcaConfigCursor } from 'db';
import { TxInfo, TxMessage } from 'signer/types';
import { baseStyles, headerStyles, tradeLayoutStyles } from 'styles';
import { exchangeNative, formatAmount, humanizeAmount } from 'utils/amount';

import '@galacticcouncil/ui';
import {
  bnum,
  Amount,
  Asset,
  scale,
  Transaction,
  ONE,
  SYSTEM_ASSET_ID,
  SubstrateTransaction,
} from '@galacticcouncil/sdk';
import { chainsMap } from '@galacticcouncil/xcm-cfg';
import { Parachain } from '@galacticcouncil/xcm-core';

import './Form';
import './Settings';
import './Stepper';

import 'app/trade/chart';
import 'app/trade/orders';

import 'element/selector';
import { AssetSelector } from 'element/selector/types';

import { DcaYieldApi } from './api';
import {
  DcaTab,
  DcaState,
  DEFAULT_DCA_STATE,
  APY,
  APY_DENOMINATOR,
  INTERVAL_DCA_MS,
} from './types';

import styles from './App.css';

@customElement('gc-yield')
export class YieldApp extends PoolApp {
  protected dcaConfig = new DatabaseController<DcaConfig>(
    this,
    DcaConfigCursor,
  );
  protected dcaApi: DcaYieldApi = null;

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

  static styles = [baseStyles, headerStyles, tradeLayoutStyles, styles];

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

  hasRate(): boolean {
    const { rate } = this.dca;
    return rate && rate > 0;
  }

  hasError(): boolean {
    return Object.keys(this.dca.error).length > 0;
  }

  changeTab(active: DcaTab) {
    this.tab = active;
    this.requestUpdate();
  }

  private async calculateSpotPrice(
    assetIn: Asset,
    assetOut: Asset,
  ): Promise<string> {
    const price: Amount = await this.getSpotPrice(assetIn, assetOut);

    if (price) {
      return scale(ONE, price.decimals).div(price.amount).toFixed();
    } else {
      return undefined;
    }
  }

  private async recalculateSpotPrice() {
    const { assetIn, assetOut } = this.dca;

    if (!assetIn || !assetOut) {
      return;
    }

    const spotPrice = await this.calculateSpotPrice(assetIn, assetOut);
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

  updateAmountInFrom(amount: string) {
    this.dca = {
      ...this.dca,
      amountIn: amount,
    };
    this.updateTradeSize();
  }

  private async updateTradeSize() {
    const { amountIn, assetIn, assetOut, interval } = this.dca;

    const order = await this.dcaApi.getYieldOrder(
      amountIn,
      assetIn,
      assetOut,
      APY,
      APY_DENOMINATOR[interval],
      INTERVAL_DCA_MS[interval],
      this.blockTime,
    );

    this.dca = {
      ...this.dca,
      order: order,
    };
    this.requestUpdate();
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
    const amountIn = this.dca.amountIn;

    if (this.isEmptyAmount(amountIn) || !this.hasAccount()) {
      delete this.dca.error['balanceTooLow'];
      return;
    }

    const balanceIn = this.assets.balance.get(assetIn);
    const amount = scale(bnum(amountIn), balanceIn.decimals);
    if (amount.gt(balanceIn.amount)) {
      this.dca.error['balanceTooLow'] = i18n.t('error.insufficientBalance');
    } else {
      delete this.dca.error['balanceTooLow'];
    }
    this.requestUpdate();
  }

  async validateMinInvestment() {
    const { api } = this.chain.state;
    if (this.isSwapEmpty()) {
      delete this.dca.error['minInvestmentTooLow'];
      return;
    }

    const { amountIn, assetIn, interval } = this.dca;

    const minBudgetNative = api.consts.dca.minBudgetInNativeCurrency.toString();
    const spotPriceNative = await this.getNativePrice(assetIn);
    const minBudget = exchangeNative(
      spotPriceNative,
      assetIn,
      minBudgetNative,
    ).shiftedBy(-1 * assetIn.decimals);

    const apyDenominator = APY_DENOMINATOR[interval];
    const apyMultiplier = 1 + APY / 100;

    const minGain = apyDenominator * minBudget.toNumber();
    const minInvestment = minGain / (apyMultiplier - 1);

    if (minInvestment > Number(amountIn)) {
      this.dca = {
        ...this.dca,
        error: {
          ...this.dca.error,
          minInvestmentTooLow: i18n.t('error.minInvestmentTooLow', {
            amount: humanizeAmount(minInvestment),
            asset: assetIn.symbol,
          }),
        },
      };
    } else {
      delete this.dca.error['minInvestmentTooLow'];
    }

    this.requestUpdate();
  }

  notificationTemplate(dca: DcaState, tKey: string): TxMessage {
    const { assetIn, assetOut, interval, order } = dca;
    const { tradesNo, amountIn, amountInYield } = order.toHuman();
    const period = INTERVAL_DCA_MS[interval];
    const freq = this._humanizer.humanize(period / tradesNo, {
      round: true,
      largest: 2,
    });

    const message = i18n.t(tKey, {
      amountIn: humanizeAmount(amountIn),
      amountInYield: humanizeAmount(amountInYield),
      assetIn: assetIn.symbol,
      assetOut: assetOut.symbol,
      frequency: freq,
    });
    return {
      message: unsafeHTML(message),
      rawHtml: message,
    } as TxMessage;
  }

  private processTx(account: Account, transaction: SubstrateTransaction) {
    const { amountIn, assetIn, assetOut, order } = this.dca;
    const orderHuman = order.toHuman();

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
        meta: {
          amountIn: humanizeAmount(orderHuman.amountIn),
          amountInYield: humanizeAmount(orderHuman.amountInYield),
          amountInFrom: humanizeAmount(amountIn),
          assetIn: assetIn.symbol,
          assetOut: assetOut.symbol,
        },
      } as TxInfo,
    };
    this.dispatchEvent(new CustomEvent<TxInfo>('gc:tx:scheduleDca', options));
  }

  private async onSchedule() {
    const account = this.account.state;
    const { router } = this.chain.state;
    const { maxRetries } = this.dcaConfig.state;

    if (account) {
      const { amountIn, assetIn, assetOut, order } = this.dca;
      const trade = await router.getBestSell(assetIn.id, assetOut.id, amountIn);
      const transaction = order.toTx(account.address, maxRetries, trade);
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

  protected async syncRate() {
    const bifrost = chainsMap.get('bifrost') as Parachain;
    const bifrostApi = await bifrost.api;
    const [totalIssuance, staked] = await Promise.all([
      bifrostApi.query.tokens.totalIssuance({
        vToken2: '0',
      }),
      bifrostApi.query.vtokenMinting.tokenPool({ Token2: '0' }),
    ]);
    const stakedDots = staked.toString();
    const vDotTotalIssuance = totalIssuance.toString();
    const rate = Number(stakedDots) / Number(vDotTotalIssuance);
    this.dca = {
      ...this.dca,
      rate: rate,
    };
  }

  protected initAssets() {
    this.dca.assetIn = this.assets.tradeable.find((a) => a.symbol === 'vDOT');
    this.dca.assetOut = this.assets.registry.get(SYSTEM_ASSET_ID);
  }

  protected onInit(): void {
    const { api, router } = this.chain.state;
    this.dcaApi = new DcaYieldApi(api, router, DcaConfigCursor);
    this.initAssets();
    this.recalculateSpotPrice();
    this.syncRate();
    this.syncBalance();
  }

  protected onBlockChange(): void {}

  protected onBalanceUpdate(): void {
    this.requestUpdate();
    this.syncBalance();
  }

  protected onBroadcastMessage(): void {}

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

  protected onAssetInputChange({ detail: { id, asset, value } }) {
    id == 'assetIn' && this.updateAmountInFrom(value);
    this.validateEnoughBalance();
    this.validateMinInvestment();
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
    this.dca = {
      ...this.dca,
      interval: detail.value,
    };
    this.updateTradeSize();
    this.validateMinInvestment();
  }

  protected isFormDisabled() {
    return (
      !this.isSwapSelected() ||
      !this.hasRate() ||
      this.isSwapEmpty() ||
      this.hasError()
    );
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
    const stepClasses = {
      active: this.tab == DcaTab.Form,
    };
    return html`
      <div class="main">
        <uigc-paper class=${classMap(classes)} id="default-tab">
          <gc-yield-form
            .assets=${this.assets.registry}
            .disabled=${this.isFormDisabled()}
            .loaded=${this.isFormLoaded()}
            .assetIn=${this.dca.assetIn}
            .assetOut=${this.dca.assetOut}
            .amountIn=${this.dca.amountIn}
            .balanceIn=${this.dca.balanceIn}
            .interval=${this.dca.interval}
            .rate=${this.dca.rate}
            .order=${this.dca.order}
            .error=${this.dca.error}
            @asset-input-change=${this.onAssetInputChange}
            @asset-selector-click=${this.onAssetSelectorClick}
            @selector-click=${this.onSelectorClick}
            @interval-change=${this.onIntervalChange}
            @schedule-click=${() => this.onSchedule()}>
            <div class="header" slot="header">
              <uigc-typography variant="title">
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
          </gc-yield-form>
        </uigc-paper>
        <gc-yield-stepper
          class=${classMap(stepClasses)}
          .assets=${this.assets.registry}
          .ecosystem=${this.ecosystem}></gc-yield-stepper>
      </div>
    `;
  }

  settingsTab() {
    const active = this.tab === DcaTab.Settings;
    const classes = {
      tab: true,
      main: true,
      active: active,
    };
    return html`
      <uigc-paper class=${classMap(classes)}>
        <gc-yield-settings @settings-change=${() => this.updateTradeSize()}>
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
        </gc-yield-settings>
      </uigc-paper>
    `;
  }

  protected onAssetClick(e: CustomEvent) {
    const { id, asset } = this.asset.selector;
    id == 'assetIn' && this.changeAssetIn(asset, e.detail);
    id == 'assetOut' && this.changeAssetOut(asset, e.detail);
    this.syncBalance();
    this.validateMinInvestment();
    this.changeTab(DcaTab.Form);
  }

  selectAssetTab() {
    const active = this.tab === DcaTab.SelectAsset;
    const classes = {
      tab: true,
      main: true,
      active: active,
    };
    return html`
      <uigc-paper class=${classMap(classes)}>
        <gc-select-asset
          .assets=${this.assets.tradeable.filter(
            (a) =>
              a.type !== 'Bond' &&
              a.isSufficient &&
              !['vDOT', 'DOT'].includes(a.symbol),
          )}
          .atokens=${this.assets.atokens}
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
        .atokens=${this.assets.atokens}
        .balances=${this.assets.balance}
        .indexerUrl=${this.indexerUrl}
        .grafanaUrl=${this.grafanaUrl}
        .grafanaDsn=${this.grafanaDsn}
        .accountAddress=${account?.address}
        .accountProvider=${account?.provider}
        .accountName=${account?.name}>
        <uigc-typography slot="header" variant="section">
          ${i18n.t('header.orders')}
        </uigc-typography>
      </gc-trade-orders>
    `;
  }

  chartTab() {
    const active = this.tab === DcaTab.Chart;
    const classes = {
      tab: true,
      chart: true,
      active: active,
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
