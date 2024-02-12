import { html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';
import { classMap } from 'lit/directives/class-map.js';

import i18n from 'i18next';
import enLocales from './translation.en.json';

import { PoolApp } from 'app/PoolApp';
import { Account, DcaConfigCursor } from 'db';
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
import { getRenderString } from 'utils/dom';

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

import 'element/selector/asset';
import { AssetSelector } from 'element/selector/types';

import { DcaTab, DcaState, DEFAULT_DCA_STATE, INTERVAL_DCA_MS } from './types';

@customElement('gc-dca')
export class DcaApp extends PoolApp {
  @property({ type: Boolean }) chart: Boolean = false;

  @state() tab: DcaTab = DcaTab.DcaForm;
  @state() dca: DcaState = { ...DEFAULT_DCA_STATE };
  @state() asset = {
    selector: null as AssetSelector,
  };

  constructor() {
    super();
    i18n.init({
      lng: 'en',
      debug: false,
      resources: {
        en: {
          translation: enLocales,
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

  private async updateEstimated() {
    const { interval, intervalBlock } = this.dca;

    let periodMsec = INTERVAL_DCA_MS[interval];
    if (intervalBlock) {
      periodMsec = intervalBlock * this.blockTime;
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

  async validateMinAmount() {
    if (this.isSwapEmpty()) {
      delete this.dca.error['minAmountTooLow'];
      return;
    }

    const { amountIn, assetIn } = this.dca;
    const minAmount = this.calculateAssetPrice(assetIn, MIN_NATIVE_AMOUNT);
    const amount = new BigNumber(amountIn);
    if (minAmount.isGreaterThan(amount)) {
      this.dca.error['minAmountTooLow'] = i18n.t('error.minAmountTooLow', {
        amount: humanizeAmount(minAmount.toString()),
        asset: assetIn.symbol,
      });
    } else {
      delete this.dca.error['minAmountTooLow'];
    }
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

  validateBudget() {
    if (this.isSwapEmpty()) {
      delete this.dca.error['budgetTooLow'];
      return;
    }

    const { amountIn, amountInBudget } = this.dca;

    const amountInBN = bnum(amountIn);
    const amountInBudgetBN = bnum(amountInBudget);

    if (amountInBN.isGreaterThan(amountInBudgetBN)) {
      this.dca.error['budgetTooLow'] = i18n.t('error.budgetTooLow');
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
      this.dca.error['blockPeriodInvalid'] = i18n.t('error.blockPeriodInvalid');
    } else {
      delete this.dca.error['blockPeriodInvalid'];
    }
  }

  notificationTemplate(dca: DcaState, status: string): TxMessage {
    const int = this.dca.intervalBlock
      ? this._humanizer.humanize(this.dca.est, { round: true, largest: 2 })
      : this.dca.interval.toLowerCase();
    const template = html`
      <span>${'Spend'}</span>
      <span class="highlight">${dca.amountIn}</span>
      <span class="highlight">${dca.assetIn.symbol}</span>
      <span></span>
        ${`every ~${int} to buy ${dca.assetOut.symbol} with a total budget of`}
      </span>
      <span class="highlight">${dca.amountInBudget}</span>
      <span class="highlight">${dca.assetIn.symbol}</span>
      <span>${status}</span>
    `;
    return {
      message: template,
      rawHtml: getRenderString(template),
    } as TxMessage;
  }

  private processTx(account: Account, transaction: Transaction) {
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

  private async onSchedule() {
    const account = this.account.state;
    const { api, router } = this.chain.state;
    if (account) {
      const { assetIn, assetOut, amountInBudget, interval, intervalBlock } =
        this.dca;

      const amountInBn = toBn(this.dca.amountIn, assetIn.decimals);
      const amountInBudgetBn = toBn(amountInBudget, assetIn.decimals);

      const periodMsec = INTERVAL_DCA_MS[interval];
      const periodBlock = this.timeApi.toBlockPeriod(
        this.blockTime,
        periodMsec,
      );
      const slippage = DcaConfigCursor.deref().slippage;
      const sell = await router.getBestSell(
        assetIn.id,
        assetOut.id,
        this.dca.amountIn,
      );
      const tx: SubmittableExtrinsic = api.tx.dca.schedule(
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

  protected onAssetInputChange({ detail: { id, asset, value } }) {
    id == 'assetIn' && this.updateAmountIn(value);
    id == 'assetInBudget' && this.updateAmountInBudget(value);
    id == 'maxPrice' && this.updateMaxPrice(value);
    this.validateBudget();
    this.validateMinBudget();
    this.validateMinAmount();
    this.validateEnoughBalance();
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
    this.dca.intervalBlock = null;
    this.updateEstimated();
    this.validateBlockPeriod();
  }

  protected onIntervalBlockChange({ detail }: CustomEvent) {
    this.dca.intervalBlock = detail.value;
    this.updateEstimated();
    this.validateBlockPeriod();
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
          .disabled=${this.isFormDisabled()}
          .loaded=${this.isFormLoaded()}
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
          @asset-input-change=${this.onAssetInputChange}
          @asset-selector-click=${this.onAssetSelectorClick}
          @selector-click=${this.onSelectorClick}
          @interval-change=${this.onIntervalChange}
          @interval-block-change=${this.onIntervalBlockChange}
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
    this.validateMinBudget();
    this.validateMinAmount();
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
