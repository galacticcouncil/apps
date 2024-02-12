import { html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';
import { classMap } from 'lit/directives/class-map.js';

import * as i18n from 'i18next';
import enLocales from './translation.en.json';

import { PoolApp } from 'app/PoolApp';
import { Account, DcaConfigCursor } from 'db';
import { TxInfo, TxMessage } from 'signer/types';
import { baseStyles } from 'styles/base.css';
import { headerStyles } from 'styles/header.css';
import { tradeLayoutStyles } from 'styles/layout/trade.css';
import { formatAmount, humanizeAmount, toBn } from 'utils/amount';
import { getRenderString } from 'utils/dom';
import { DAY_MS } from 'utils/time';

import '@galacticcouncil/ui';
import {
  bnum,
  buildRoute,
  Amount,
  Asset,
  scale,
  Transaction,
  ONE,
  SYSTEM_ASSET_ID,
} from '@galacticcouncil/sdk';
import { chainsMap } from '@galacticcouncil/xcm-cfg';
import { SubstrateApis } from '@galacticcouncil/xcm-sdk';

import { SubmittableExtrinsic } from '@polkadot/api/promise/types';

import './Form';
import './Settings';
import './Stepper';

import 'app/trade/chart';
import 'app/trade/orders';

import 'element/selector/asset';
import { AssetSelector } from 'element/selector/types';

import {
  DcaTab,
  DcaState,
  APY,
  APY_DENOMINATOR,
  DEFAULT_DCA_STATE,
  INTERVAL_DCA_MS,
  MIN_TRADE_SIZE,
  MAX_TRADE_SIZE,
} from './types';

@customElement('gc-yield')
export class YieldApp extends PoolApp {
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

      gc-yield-stepper.active {
        display: block;
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
    const { amountInFrom } = this.dca;
    return this.isEmptyAmount(amountInFrom);
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

  updateAmountInFrom(amount: string) {
    this.dca = {
      ...this.dca,
      amountInFrom: amount,
    };
    this.updateYield();
    this.updateTradeSize();
    this.updateEstimated();
  }

  private updateYield() {
    const { amountInFrom, interval } = this.dca;

    const apyDenominator = APY_DENOMINATOR[interval];
    const apyMultiplier = 1 + APY / 100;

    const investment = Number(amountInFrom);
    const futureValue = investment * apyMultiplier;
    const gain = futureValue - investment;
    const amountInYield = gain / apyDenominator;

    this.dca = {
      ...this.dca,
      amountInYield: amountInYield.toFixed(4),
    };
    this.requestUpdate();
  }

  private async updateTradeSize() {
    const { amountInYield, interval } = this.dca;

    const intervalMs = INTERVAL_DCA_MS[interval];
    const budget = Number(amountInYield);

    let noOfTrades = Math.round(intervalMs / DAY_MS) || 1;
    let tradeSize = budget / noOfTrades;

    if (tradeSize < MIN_TRADE_SIZE) {
      noOfTrades = Math.floor(budget / MIN_TRADE_SIZE);
      tradeSize = budget / noOfTrades;
    }

    if (tradeSize > MAX_TRADE_SIZE) {
      noOfTrades = Math.round(budget / MAX_TRADE_SIZE);
      tradeSize = budget / noOfTrades;
    }

    this.dca = {
      ...this.dca,
      amountIn: tradeSize.toFixed(4),
      tradesNo: noOfTrades,
    };
    this.requestUpdate();
  }

  private async updateEstimated() {
    const { interval } = this.dca;

    let periodMsec = INTERVAL_DCA_MS[interval];
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
    const amountIn = this.dca.amountInFrom;

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

    const { amountInFrom, assetIn, interval } = this.dca;

    const minBudgetNative = api.consts.dca.minBudgetInNativeCurrency.toString();
    const minBudget = this.calculateAssetPrice(assetIn, minBudgetNative);

    const apyDenominator = APY_DENOMINATOR[interval];
    const apyMultiplier = 1 + APY / 100;

    const minGain = apyDenominator * minBudget.toNumber();
    const minInvestment = minGain / (apyMultiplier - 1);

    if (minInvestment > Number(amountInFrom)) {
      this.dca.error['minInvestmentTooLow'] = i18n.t(
        'error.minInvestmentTooLow',
        {
          amount: humanizeAmount(minInvestment),
          asset: assetIn.symbol,
        },
      );
    } else {
      delete this.dca.error['minInvestmentTooLow'];
    }
  }

  notificationTemplate(dca: DcaState, status: string): TxMessage {
    const { est, tradesNo } = dca;
    const freq = this._humanizer.humanize(est / tradesNo, {
      round: true,
      largest: 2,
    });
    const template = html`
      <span>${'Spend'}</span>
      <span class="highlight">${dca.amountIn}</span>
      <span class="highlight">${dca.assetIn.symbol}</span>
      <span></span>
        ${`every ~${freq} to buy ${dca.assetOut.symbol} with a total budget of`}
      </span>
      <span class="highlight">${dca.amountInYield}</span>
      <span class="highlight">${dca.assetIn.symbol}</span>
      <span>${status}</span>
    `;
    return {
      message: template,
      rawHtml: getRenderString(template),
    } as TxMessage;
  }

  private processTx(account: Account, transaction: Transaction) {
    const { amountIn, amountInYield, amountInFrom, assetIn, assetOut } =
      this.dca;

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
        meta: {
          amountIn: humanizeAmount(amountIn),
          amountInYield: humanizeAmount(amountInYield),
          amountInFrom: humanizeAmount(amountInFrom),
          assetIn: assetIn.symbol,
          assetOut: assetOut.symbol,
        },
      } as TxInfo,
    };
    this.dispatchEvent(new CustomEvent<TxInfo>('gc:tx:scheduleDca', options));
  }

  private async onSchedule() {
    const account = this.account.state;
    const { api, router } = this.chain.state;
    if (account) {
      const { assetIn, assetOut, amountInYield, est, tradesNo } = this.dca;

      const amountInBn = toBn(this.dca.amountIn, assetIn.decimals);
      const amountInYieldBN = toBn(amountInYield, assetIn.decimals);

      const periodBlock = this.timeApi.toBlockPeriod(
        this.blockTime,
        Math.floor(est / tradesNo),
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
          period: periodBlock,
          totalAmount: amountInYieldBN.toFixed(),
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

  protected async syncRate() {
    const bifrost = chainsMap.get('bifrost');
    const apiPool = SubstrateApis.getInstance();
    const bifrostApi = await apiPool.api(bifrost.ws);
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
    this.dca.interval = detail.value;
    this.updateEstimated();
    this.updateYield();
    this.updateTradeSize();
    this.validateMinInvestment();
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
    const stepClasses = {
      active: this.tab == DcaTab.DcaForm,
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
            .amountInYield=${this.dca.amountInYield}
            .amountInFrom=${this.dca.amountInFrom}
            .balanceIn=${this.dca.balanceIn}
            .interval=${this.dca.interval}
            .rate=${this.dca.rate}
            .tradesNo=${this.dca.tradesNo}
            .est=${this.dca.est}
            .error=${this.dca.error}
            @asset-input-change=${this.onAssetInputChange}
            @asset-selector-click=${this.onAssetSelectorClick}
            @selector-click=${this.onSelectorClick}
            @interval-change=${this.onIntervalChange}
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
          </gc-yield-form>
        </uigc-paper>
        <gc-yield-stepper class=${classMap(stepClasses)}></gc-yield-stepper>
      </div>
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
        <gc-yield-settings @slippage-change=${() => {}}>
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
          .assets=${this.assets.tradeable.filter(
            (a) => a.type !== 'Bond' && !['vDOT', 'DOT'].includes(a.symbol),
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

  /*   dcaStepper() {
    const classes = {
      stepper: true,
      main: true,
    };
    return html`
      <uigc-paper class=${classMap(classes)}>
        <gc-yield-stepper></gc-yield-stepper>
      </uigc-paper>
    `;
  } */

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
