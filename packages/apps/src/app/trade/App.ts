import { html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';
import { classMap } from 'lit/directives/class-map.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';

import { i18n } from 'localization';

import '@galacticcouncil/ui';
import {
  findNestedKey,
  scale,
  Asset,
  Amount,
  PoolType,
  Trade,
  TradeType,
  Swap,
  ONE,
  SYSTEM_ASSET_ID,
  SubstrateTransaction,
  TradeOrder,
} from '@galacticcouncil/sdk';
import { chainsMap } from '@galacticcouncil/xcm-cfg';
import { Parachain } from '@galacticcouncil/xcm-core';

import { translation } from './locales';

import { PoolApp } from 'app/PoolApp';
import {
  Account,
  DatabaseController,
  TradeConfig,
  TradeConfigCursor,
} from 'db';
import { TradeMetadata, TxInfo, TxMessage } from 'signer/types';
import { baseStyles, headerStyles, tradeLayoutStyles } from 'styles';
import { TRSRY_ACC } from 'api/payment';
import { formatAmount, humanizeAmount, toBn } from 'utils/amount';
import { isEvmAccount } from 'utils/evm';
import { updateQueryParams } from 'utils/url';
import { EVM_NATIVE_ASSET_ID } from 'utils/account';
import { isSellOnly } from 'utils/asset';

import './Form';
import './Settings';
import './AssetInfo';
import './chart';
import './orders';

import 'element/selector';
import { AssetSelector } from 'element/selector/types';

import {
  TradeTab,
  TradeState,
  DEFAULT_TRADE_STATE,
  TwapState,
  DEFAULT_TWAP_STATE,
  TransactionFee,
} from './types';

import styles from './App.css';

@customElement('gc-trade')
export class TradeApp extends PoolApp {
  protected tradeConfig = new DatabaseController<TradeConfig>(
    this,
    TradeConfigCursor,
  );

  @property({ type: Boolean }) chart: Boolean = false;
  @property({ type: Boolean }) twapOn: Boolean = false;
  @property({ type: Boolean }) newAssetBtn: Boolean = false;
  @property({ type: Boolean }) assetCheckEnabled: Boolean = false;

  @state() tab: TradeTab = TradeTab.Form;
  @state() trade: TradeState = { ...DEFAULT_TRADE_STATE };
  @state() twap: TwapState = { ...DEFAULT_TWAP_STATE };
  @state() asset = {
    active: null as string,
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

  isSwapSelected(): boolean {
    return this.trade.assetIn != null && this.trade.assetOut != null;
  }

  isSwapEmpty(): boolean {
    return this.trade.amountIn == null && this.trade.amountOut == null;
  }

  isTwapEnabled(): boolean {
    const { trade } = this.trade;
    const pools: string[] = trade
      ? trade.swaps.map((swap: any) => swap.pool)
      : [];
    const notSupportedRoute =
      pools.includes(PoolType.LBP) || pools.includes(PoolType.XYK);
    return this.twapOn && !notSupportedRoute;
  }

  isSwitchEnabled(): boolean {
    const assetIn = this.trade.assetIn;
    return !isSellOnly(assetIn);
  }

  isEmptyAmount(amount: string): boolean {
    return amount == null || amount == '' || amount == '0';
  }

  isPoolError(): boolean {
    const assetOut = this.trade.assetOut;
    return assetOut?.id === '1' && assetOut?.symbol.toLowerCase() === 'h2o';
  }

  changeTab(active: TradeTab) {
    this.tab = active;
    this.requestUpdate();
  }

  private async safeSell(
    assetIn: Asset,
    assetOut: Asset,
    amountIn: string,
  ): Promise<Trade> {
    const { sdk } = this.chain.state;
    const { api } = sdk;
    try {
      return await api.router.getBestSell(assetIn.id, assetOut.id, amountIn);
    } catch (error) {
      console.error(error);
      this.resetTrade();
    }
  }

  private async calculateSellTwap() {
    const { sdk } = this.chain.state;
    const { api } = sdk;

    const { amountIn, assetIn, assetOut } = this.trade;

    if (this.isTwapEnabled()) {
      const order = await api.scheduler.getTwapSellOrder(
        assetIn.id,
        assetOut.id,
        amountIn,
      );
      const orderDuration = api.scheduler.getTwapExecutionTime(
        order.tradeCount,
      );
      this.twap = {
        ...this.twap,
        inProgress: false,
        order: order,
        orderDuration: orderDuration,
      };
    }
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

  protected async calculateSell(
    assetIn: Asset,
    assetOut: Asset,
    amountIn: string,
  ) {
    const [trade, spotPrice] = await Promise.all([
      this.safeSell(assetIn, assetOut, amountIn),
      this.calculateSpotPrice(assetIn, assetOut),
    ]);
    const tradeHuman = trade.toHuman();

    const { amountOut } = Object.assign({}, tradeHuman);
    this.trade = {
      ...this.trade,
      amountOut: amountOut,
      assetIn: assetIn,
      assetOut: assetOut,
      inProgress: false,
      spotPrice: spotPrice,
      trade: trade,
      type: TradeType.Sell,
    };
    this.validateTrade(TradeType.Sell);
    this.validateEnoughBalance();
    this.trade.transactionFee
      ? this.syncTransactionFee()
      : await this.syncTransactionFee();
    this.calculateSellTwap();
    console.log(tradeHuman);
  }

  private async safeBuy(
    assetIn: Asset,
    assetOut: Asset,
    amountOut: string,
  ): Promise<Trade> {
    const { sdk } = this.chain.state;
    const { api } = sdk;

    try {
      return await api.router.getBestBuy(assetIn.id, assetOut.id, amountOut);
    } catch (error) {
      console.error(error);
      this.resetTrade();
    }
  }

  private async calculateBuyTwap() {
    const { sdk } = this.chain.state;
    const { api } = sdk;

    const { amountOut, assetIn, assetOut } = this.trade;

    if (this.isTwapEnabled()) {
      const order = await api.scheduler.getTwapBuyOrder(
        assetIn.id,
        assetOut.id,
        amountOut,
      );
      const orderDuration = api.scheduler.getTwapExecutionTime(
        order.tradeCount,
      );
      this.twap = {
        ...this.twap,
        inProgress: false,
        order: order,
        orderDuration: orderDuration,
      };
    }
  }

  protected async calculateBuy(
    assetIn: Asset,
    assetOut: Asset,
    amountOut: string,
  ) {
    const [trade, spotPrice] = await Promise.all([
      this.safeBuy(assetIn, assetOut, amountOut),
      this.calculateSpotPrice(assetIn, assetOut),
    ]);
    const tradeHuman = trade.toHuman();

    const { amountIn } = Object.assign({}, tradeHuman);
    this.trade = {
      ...this.trade,
      inProgress: false,
      amountIn: amountIn,
      assetIn: assetIn,
      assetOut: assetOut,
      spotPrice: spotPrice,
      trade: trade,
      type: TradeType.Buy,
    };
    this.validateTrade(TradeType.Buy);
    this.validateEnoughBalance();
    this.trade.transactionFee
      ? this.syncTransactionFee()
      : await this.syncTransactionFee();
    this.calculateBuyTwap();
    console.log(tradeHuman);
  }

  private recalculateBestSell() {
    this.calculateSell(
      this.trade.assetIn,
      this.trade.assetOut,
      this.trade.amountIn,
    );
  }

  private recalculateBestBuy() {
    this.calculateBuy(
      this.trade.assetIn,
      this.trade.assetOut,
      this.trade.amountOut,
    );
  }

  protected recalculateTrade() {
    if (!this.isSwapSelected() || this.isSwapEmpty() || this.isPoolError()) {
      this.recalculateSpotPrice();
    } else if (this.trade.assetIn.symbol == this.asset.active) {
      this.recalculateBestSell();
    } else if (this.trade.assetOut.symbol == this.asset.active) {
      this.recalculateBestBuy();
    }
  }

  protected async recalculateSpotPrice() {
    if (!this.isSwapSelected()) {
      return;
    }

    const { assetIn, assetOut } = this.trade;
    const spotPrice = await this.calculateSpotPrice(assetIn, assetOut);
    this.trade = {
      ...this.trade,
      inProgress: false,
      spotPrice: spotPrice,
    };
  }

  private switchAssets(amountIn: string, amountOut: string, progress: boolean) {
    this.trade = {
      ...this.trade,
      inProgress: progress,
      amountIn: amountIn,
      amountOut: amountOut,
      assetIn: this.trade.assetOut,
      assetOut: this.trade.assetIn,
      balanceIn: this.trade.balanceOut,
      balanceOut: this.trade.balanceIn,
    };
    this.twap = {
      ...this.twap,
      inProgress: false,
      order: null,
    };
  }

  private switch() {
    if (!this.isSwapSelected()) {
      this.switchAssets(this.trade.amountOut, this.trade.amountIn, false);
    } else if (!this.isSwitchEnabled() || this.isFormReadOnly()) {
      return;
    } else if (this.isSwapEmpty()) {
      this.switchAssets(this.trade.amountOut, this.trade.amountIn, true);
      this.recalculateSpotPrice();
    } else if (this.trade.assetOut.symbol == this.asset.active) {
      this.switchAssets(this.trade.amountOut, null, true);
      this.recalculateBestSell();
    } else if (this.trade.assetIn.symbol == this.asset.active) {
      this.switchAssets(null, this.trade.amountIn, true);
      this.recalculateBestBuy();
    }
  }

  protected async changeAssetIn(previous: string, asset: Asset) {
    const assetIn = asset;
    const assetOut = this.trade.assetOut;

    // Switch if selecting the same asset
    if (assetIn.id === assetOut?.id) {
      this.switch();
      return;
    }

    // Change without recalculation if pair not specified
    if (assetOut == null) {
      this.trade = {
        ...this.trade,
        assetIn: asset,
        balanceIn: null,
      };
      return;
    }

    // Recalculate only spot price if amount not set
    if (this.isSwapEmpty()) {
      this.trade = {
        ...this.trade,
        inProgress: true,
        assetIn: asset,
        balanceOut: null,
      };
      this.recalculateSpotPrice();
      return;
    }

    this.twap = {
      ...this.twap,
      inProgress: true,
      order: null,
    };

    if (previous == this.asset.active) {
      this.trade = {
        ...this.trade,
        inProgress: true,
        assetIn: asset,
        balanceIn: null,
        amountOut: null,
      };
      this.asset.active = assetIn.symbol;
      this.calculateSell(assetIn, assetOut, this.trade.amountIn);
    } else {
      this.trade = {
        ...this.trade,
        inProgress: true,
        assetIn: asset,
        balanceIn: null,
        amountIn: null,
      };
      this.calculateBuy(assetIn, assetOut, this.trade.amountOut);
    }
  }

  protected async changeAssetOut(previous: string, asset: Asset) {
    const assetIn = this.trade.assetIn;
    const assetOut = asset;

    // Switch if selecting the same asset
    if (assetOut.id === assetIn?.id) {
      this.switch();
      return;
    }

    // Change without recalculation if pair not specified
    if (assetIn == null) {
      this.trade = {
        ...this.trade,
        assetOut: asset,
        balanceOut: null,
      };
      return;
    }

    // Recalculate only spot price if amount not set
    if (this.isSwapEmpty()) {
      this.trade = {
        ...this.trade,
        inProgress: true,
        assetOut: asset,
        balanceOut: null,
      };
      this.recalculateSpotPrice();
      return;
    }

    this.twap = {
      ...this.twap,
      inProgress: true,
      order: null,
    };

    if (previous == this.asset.active) {
      this.trade = {
        ...this.trade,
        inProgress: true,
        assetOut: asset,
        balanceOut: null,
        amountIn: null,
      };
      this.asset.active = assetOut.symbol;
      this.calculateBuy(assetIn, assetOut, this.trade.amountOut);
    } else {
      this.trade = {
        ...this.trade,
        inProgress: true,
        assetOut: asset,
        balanceOut: null,
        amountOut: null,
      };
      this.calculateSell(assetIn, assetOut, this.trade.amountIn);
    }
  }

  validateEnoughBalance() {
    const assetIn = this.trade.assetIn?.id;
    const ammountIn = this.trade.amountIn;

    if (
      this.isEmptyAmount(ammountIn) ||
      !this.isSwapSelected ||
      !this.hasAccount()
    ) {
      return;
    }

    const balanceIn = this.assets.balance.get(assetIn);
    if (!balanceIn) {
      return;
    }

    const amount = toBn(ammountIn, balanceIn.decimals);
    if (amount.gt(balanceIn.amount)) {
      this.trade.error['balance'] = i18n.t('error.insufficientBalance');
    } else {
      delete this.trade.error['balance'];
    }
    this.requestUpdate();
  }

  private translateTradeError(error: string): string {
    switch (error) {
      case 'InsufficientTradingAmount':
        return i18n.t('error.insufficientTradingAmount');
      case 'MaxOutRatioExceeded':
        return i18n.t('error.maxOutRatioExceeded');
      case 'MaxInRatioExceeded':
        return i18n.t('error.maxInRatioExceeded');
      case 'TradeNotAllowed':
        return i18n.t('error.tradeNotAllowed');
    }
  }

  validateTrade(type: TradeType) {
    const { trade } = this.trade;

    if (trade.swaps.length === 0) {
      return;
    }

    const swaps =
      type == TradeType.Buy ? trade.swaps.slice().reverse() : trade.swaps;
    const swapWithError: Swap = swaps.find(
      (swap: Swap) => swap.errors.length > 0,
    );
    if (swapWithError) {
      this.trade.error['trade'] = this.translateTradeError(
        swapWithError.errors[0],
      );
    } else {
      delete this.trade.error['trade'];
    }
  }

  validatePool() {
    if (this.isPoolError()) {
      this.trade.error['pool'] = i18n.t('error.invalidPair');
      this.resetTrade();
    } else {
      delete this.trade.error['pool'];
    }
  }

  private resetTrade(withError?: boolean) {
    delete this.trade.error['balance'];
    delete this.trade.error['trade'];
    this.trade = {
      ...this.trade,
      inProgress: false,
      amountIn: null,
      amountOut: null,
      error: withError ? [] : this.trade.error,
      trade: null,
    };
    this.twap = {
      ...this.twap,
      inProgress: false,
      order: null,
    };
  }

  updateAmountIn(amount: string) {
    // Wipe the trade info on input clear
    if (this.isEmptyAmount(amount)) {
      this.resetTrade();
      return;
    }

    if (this.isSwapSelected() && !this.isPoolError()) {
      this.trade = {
        ...this.trade,
        inProgress: true,
        amountIn: amount,
        amountOut: null,
      };
      this.twap = {
        ...this.twap,
        inProgress: true,
        order: null,
      };
      this.calculateSell(this.trade.assetIn, this.trade.assetOut, amount);
    } else {
      this.trade.amountIn = amount;
    }
  }

  updateAmountOut(amount: string) {
    // Wipe the trade info on input clear
    if (this.isEmptyAmount(amount)) {
      this.resetTrade();
      return;
    }

    if (this.isSwapSelected() && !this.isPoolError()) {
      this.trade = {
        ...this.trade,
        inProgress: true,
        amountIn: null,
        amountOut: amount,
      };
      this.twap = {
        ...this.twap,
        inProgress: true,
        order: null,
      };
      this.calculateBuy(this.trade.assetIn, this.trade.assetOut, amount);
    } else {
      this.trade.amountOut = amount;
    }
  }

  private resetBalances() {
    this.trade.balanceIn = null;
    this.trade.balanceOut = null;
  }

  async syncBalances() {
    const account = this.account.state;
    if (account) {
      this.updateBalances();
      this.validateEnoughBalance();
    }
  }

  protected updateBalances() {
    const balanceIn = this.assets.balance.get(this.trade.assetIn?.id);
    const balanceOut = this.assets.balance.get(this.trade.assetOut?.id);
    this.trade = {
      ...this.trade,
      balanceIn,
      balanceOut,
    };
  }

  private async calculateTransactionFee(
    transaction: SubstrateTransaction,
    feeAssetId: string,
    feeNative: string,
  ): Promise<TransactionFee> {
    const account = this.account.state;
    const feeAsset = this.assets.registry.get(feeAssetId);

    const { amount } =
      isEvmAccount(account?.address) && feeAssetId === EVM_NATIVE_ASSET_ID
        ? await this.paymentApi.getEvmPaymentFee(transaction.hex, account)
        : await this.paymentApi.getPaymentFee(feeAsset, feeNative);

    return {
      asset: feeAsset,
      amount: amount,
      amountNative: feeNative,
    } as TransactionFee;
  }

  async syncTransactionFee() {
    const account = this.account.state;
    const { trade, assetIn, assetOut } = this.trade;
    const { sdk } = this.chain.state;

    const nTrade = trade
      ? trade
      : await this.safeSell(assetIn, assetOut, ONE.toFixed()); // Dummy trade if no action was taken

    const transaction = await sdk.tx
      .trade(nTrade)
      .withBeneficiary(TRSRY_ACC)
      .build();
    const [paymentInfo, feeAssetId] = await Promise.all([
      this.paymentApi.getPaymentInfo(transaction, account),
      this.paymentApi.getPaymentFeeAsset(account?.address),
    ]);

    this.trade.transactionFee = await this.calculateTransactionFee(
      transaction,
      feeAssetId,
      paymentInfo.partialFee.toString(),
    );
    this.requestUpdate();
  }

  private async updateMaxAmountIn(_asset: Asset) {
    const { balanceIn } = this.trade;
    const { amount, decimals } = balanceIn;
    const amountIn = formatAmount(amount, decimals);
    this.updateAmountIn(amountIn);
  }

  notificationTemplate(trade: TradeState, tKey: string): TxMessage {
    const { amountIn, amountOut, assetIn, assetOut, type } = this.trade;
    const isSell: boolean = type == TradeType.Sell;
    const action =
      tKey === 'notify.success' ? (isSell ? 'sold' : 'bought') : trade.type;

    const message = i18n.t(tKey, {
      action: action,
      amountIn: humanizeAmount(isSell ? amountIn : amountOut),
      amountOut: humanizeAmount(isSell ? amountOut : amountIn),
      assetIn: isSell ? assetIn?.symbol : assetOut?.symbol,
      assetOut: isSell ? assetOut?.symbol : assetIn?.symbol,
    });
    return {
      message: unsafeHTML(message),
      rawHtml: message,
    } as TxMessage;
  }

  private processTx(
    account: Account,
    transaction: SubstrateTransaction,
    trade: TradeState,
  ) {
    const { amountIn, amountOut, assetIn, assetOut } = trade;
    const isWithdraw = trade.trade.swaps[0].isWithdraw();

    const notification = {
      processing: this.notificationTemplate(trade, 'notify.processing'),
      success: this.notificationTemplate(trade, 'notify.success'),
      failure: this.notificationTemplate(trade, 'notify.error'),
    };

    const options = {
      bubbles: true,
      composed: true,
      detail: {
        account: account,
        transaction: transaction,
        notification: notification,
        meta: {
          amountIn: amountIn,
          amountOut: amountOut,
          assetIn: assetIn,
          assetOut: assetOut,
          isWithdraw: isWithdraw,
        },
      } as TxInfo<TradeMetadata>,
    };
    this.dispatchEvent(new CustomEvent('gc:tx:new', options));
  }

  private async onSwapClick() {
    const account = this.account.state;

    const { sdk } = this.chain.state;
    const { slippage } = this.tradeConfig.state;
    const { trade } = this.trade;

    const tx = await sdk.tx
      .trade(trade)
      .withSlippage(Number(slippage))
      .withBeneficiary(account.address)
      .build();

    const txResult = await tx.dryRun(account.address);
    console.log(txResult.executionResult.toHuman());
    this.processTx(account, tx, this.trade);
  }

  twapNotificationTemplate(
    order: TradeOrder,
    orderDuration: number,
    asset: Asset,
    status: string,
  ): TxMessage {
    const { tradeCount } = order;
    const { amountIn, tradeAmountIn } = order.toHuman();
    const timeframe = this._humanizer.humanize(orderDuration, {
      round: true,
      largest: 2,
    });

    const message = i18n.t('notify.twap', {
      amountIn: humanizeAmount(tradeAmountIn),
      amountInBudget: humanizeAmount(amountIn),
      assetIn: asset.symbol,
      noOfTrades: tradeCount,
      timeframe: timeframe,
      status: status,
    });
    return {
      message: unsafeHTML(message),
      rawHtml: message,
    } as TxMessage;
  }

  private processTwap(
    account: Account,
    transaction: SubstrateTransaction,
    order: TradeOrder,
    orderDuration: number,
  ) {
    const { amountIn, amountOut, assetIn, assetOut, trade } = this.trade;
    const isWithdraw = trade.swaps[0].isWithdraw();

    const notification = {
      processing: this.twapNotificationTemplate(
        order,
        orderDuration,
        assetIn,
        'submitted',
      ),
      success: this.twapNotificationTemplate(
        order,
        orderDuration,
        assetIn,
        'placed',
      ),
      failure: this.twapNotificationTemplate(
        order,
        orderDuration,
        assetIn,
        'failed',
      ),
    };

    const options = {
      bubbles: true,
      composed: true,
      detail: {
        account: account,
        transaction: transaction,
        notification: notification,
        meta: {
          amountIn: amountIn,
          amountOut: amountOut,
          assetIn: assetIn,
          assetOut: assetOut,
          isWithdraw: isWithdraw,
        },
      } as TxInfo<TradeMetadata>,
    };
    this.dispatchEvent(new CustomEvent('gc:tx:scheduleDca', options));
  }

  private async onTwapClick() {
    const account = this.account.state;
    const { maxRetries, slippageTwap } = this.tradeConfig.state;
    const { sdk } = this.chain.state;
    const { tx } = sdk;

    const { order, orderDuration } = this.twap;
    const transaction = await tx
      .order(order)
      .withBeneficiary(account.address)
      .withMaxRetries(maxRetries)
      .withSlippage(Number(slippageTwap))
      .build();
    this.processTwap(account, transaction, order, orderDuration);
  }

  protected updateQuery() {
    const assetIn = this.trade.assetIn?.id;
    const assetOut = this.trade.assetOut?.id;
    updateQueryParams({
      assetIn: assetIn,
      assetOut: assetOut,
    });
    const options = {
      bubbles: true,
      composed: true,
      detail: { assetIn: assetIn, assetOut: assetOut },
    };
    this.dispatchEvent(new CustomEvent('gc:query:update', options));
  }

  protected updateAsset(asset: string, assetKey: string) {
    if (asset) {
      this.trade[assetKey] = this.assets.registry.get(asset);
    } else {
      this.trade[assetKey] = null;
    }
  }

  protected initAssets() {
    if (!this.assetIn && !this.assetOut) {
      this.trade.assetIn = this.assets.registry.get(this.stableCoinAssetId);
      this.trade.assetOut = this.assets.registry.get(SYSTEM_ASSET_ID);
    } else {
      this.updateAsset(this.assetIn, 'assetIn');
      this.updateAsset(this.assetOut, 'assetOut');
    }
  }

  protected async onInit(): Promise<void> {
    this.initAssets();
    this.validatePool();
    this.recalculateSpotPrice();
    this.syncTransactionFee();
  }

  protected onBlockChange(): void {
    if (!this.trade.inProgress) {
      this.recalculateTrade();
    }
  }

  protected onBalanceUpdate() {
    this.requestUpdate();
    this.syncBalances();
  }

  protected onBroadcastMessage(): void {}

  protected override async onAccountChange(
    prev: Account,
    curr: Account,
  ): Promise<void> {
    super.onAccountChange(prev, curr);
    if (curr) {
      this.syncBalances();
    } else {
      this.resetBalances();
    }
  }

  private onResize(_evt: UIEvent) {
    if (window.innerWidth > 1023 && TradeTab.Chart == this.tab) {
      this.changeTab(TradeTab.Form);
    }
  }

  override connectedCallback() {
    super.connectedCallback();
    window.addEventListener('resize', (evt) => this.onResize(evt));
    this.resetTrade(true);
  }

  override disconnectedCallback() {
    window.removeEventListener('resize', this.onResize);
    super.disconnectedCallback();
  }

  protected onAssetInputChange({ detail: { id, asset, value } }) {
    this.asset.active = asset;
    id == 'assetIn' && this.updateAmountIn(value);
    id == 'assetOut' && this.updateAmountOut(value);
    this.validateEnoughBalance();
  }

  protected onAssetMaxClick({ detail: { id, asset } }) {
    this.asset.active = asset.symbol;
    if (id === 'assetIn') {
      this.updateMaxAmountIn(asset);
    }
  }

  protected onAssetSelectorClick({ detail }: CustomEvent) {
    this.asset.selector = detail;
    this.changeTab(TradeTab.SelectAsset);
  }

  protected onAssetSwitchClick({ detail }: CustomEvent) {
    this.switch();
    this.validatePool();
    this.updateQuery();
  }

  protected isFormDisabled() {
    return this.isSwapEmpty() || !this.isSwapSelected() || !this.hasAccount();
  }

  protected isFormLoaded() {
    return this.assets.tradeable.length > 0;
  }

  protected isFormReadOnly() {
    return false;
  }

  formTab() {
    const classes = {
      tab: true,
      main: true,
      active: this.tab == TradeTab.Form,
      'form-tab': this.tab == TradeTab.Form,
    };
    return html`
      <uigc-paper class=${classMap(classes)} id="default-tab">
        <gc-trade-form
          .assets=${this.assets.registry}
          .atokens=${this.assets.atokens}
          .usdPrice=${this.assets.usdPrice}
          .inProgress=${this.trade.inProgress}
          .ecosystem=${this.ecosystem}
          .disabled=${this.isFormDisabled()}
          .loaded=${this.isFormLoaded()}
          .readonly=${this.isFormReadOnly()}
          .switchAllowed=${this.isSwitchEnabled()}
          .assetIn=${this.trade.assetIn}
          .assetOut=${this.trade.assetOut}
          .amountIn=${this.trade.amountIn}
          .amountOut=${this.trade.amountOut}
          .balanceIn=${this.trade.balanceIn}
          .balanceOut=${this.trade.balanceOut}
          .spotPrice=${this.trade.spotPrice}
          .trade=${this.trade.trade}
          .tradeType=${this.trade.type}
          .transactionFee=${this.trade.transactionFee}
          .twap=${this.twap.order}
          .twapDuration=${this.twap.orderDuration}
          .twapAllowed=${this.isTwapEnabled()}
          .twapProgress=${this.twap.inProgress}
          .error=${this.trade.error}
          @asset-input-change=${this.onAssetInputChange}
          @asset-max-click=${this.onAssetMaxClick}
          @asset-selector-click=${this.onAssetSelectorClick}
          @asset-switch-click=${this.onAssetSwitchClick}
          @swap-click=${() => this.onSwapClick()}
          @twap-click=${() => this.onTwapClick()}
          @slippage-click=${() => this.changeTab(TradeTab.Settings)}>
          <div class="header" slot="header">
            <uigc-typography variant="title">
              ${i18n.t('header.form')}
            </uigc-typography>
            <span class="grow"></span>
            <uigc-icon-button
              basic
              class="chart-btn"
              @click=${() => this.changeTab(TradeTab.Chart)}>
              <uigc-icon-chart></uigc-icon-chart>
            </uigc-icon-button>
            <uigc-icon-button
              basic
              @click=${() => this.changeTab(TradeTab.Settings)}>
              <uigc-icon-settings></uigc-icon-settings>
            </uigc-icon-button>
          </div>
        </gc-trade-form>
      </uigc-paper>
    `;
  }

  settingsTab() {
    const active = this.tab === TradeTab.Settings;
    const classes = {
      tab: true,
      main: true,
      active: active,
    };
    return html`
      <uigc-paper class=${classMap(classes)}>
        <gc-trade-settings
          .ecosystem=${this.ecosystem}
          @settings-change=${() => this.recalculateTrade()}>
          <div class="header section" slot="header">
            <uigc-icon-button
              class="back"
              @click=${() => this.changeTab(TradeTab.Form)}>
              <uigc-icon-back></uigc-icon-back>
            </uigc-icon-button>
            <uigc-typography variant="section">
              ${i18n.t('header.settings')}
            </uigc-typography>
            <span></span>
          </div>
        </gc-trade-settings>
      </uigc-paper>
    `;
  }

  protected onAddNewAssetClick() {
    const options = {
      bubbles: true,
      composed: true,
    };
    this.dispatchEvent(new CustomEvent('gc:external:new', options));
  }

  protected onAssetClick(e: CustomEvent) {
    const { id, asset } = this.asset.selector;
    id == 'assetIn' && this.changeAssetIn(asset, e.detail);
    id == 'assetOut' && this.changeAssetOut(asset, e.detail);
    this.updateBalances();
    this.validatePool();
    this.updateQuery();
    this.changeTab(TradeTab.Form);
  }

  addAssetBtn() {
    if (this.newAssetBtn) {
      return html`
        <div class="container" slot="footer">
          <uigc-button
            variant="secondary"
            size="micro"
            class="btn"
            @click=${this.onAddNewAssetClick}>
            <span class="cta">Add new asset</span>
            <div class="icon" slot="icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="10"
                height="10"
                viewBox="0 0 10 10"
                fill="none">
                <path
                  d="M5.49999 1.33398V5.00074M5.49999 8.66749V5.00074M5.49999 5.00074H1.83333M5.49999 5.00074H9.16666"
                  stroke="#85D1FF"
                  stroke-width="1.71429"
                  stroke-linecap="square" />
              </svg>
            </div>
          </uigc-button>
        </div>
      `;
    }
  }

  addAssetBtnTitle() {
    if (this.newAssetBtn) {
      return html`
        <span slot="emptyTitle">
          The asset your are looking for is missing, feel free to add custom
          asset.
        </span>
      `;
    }
  }

  selectAssetTab() {
    const active = this.tab === TradeTab.SelectAsset;
    const classes = {
      tab: true,
      main: true,
      active: active,
    };
    return html`
      <uigc-paper class=${classMap(classes)}>
        <gc-select-asset
          .assets=${this.assets.tradeable}
          .atokens=${this.assets.atokens}
          .balances=${this.assets.balance}
          .ecosystem=${this.ecosystem}
          .usdPrice=${this.assets.usdPrice}
          .assetIn=${this.trade.assetIn}
          .assetOut=${this.trade.assetOut}
          .switchAllowed=${this.isSwitchEnabled()}
          .selector=${this.asset.selector}
          @asset-click=${this.onAssetClick}>
          ${this.addAssetBtn()} ${this.addAssetBtnTitle()}
          <div class="header section" slot="header">
            <uigc-icon-button
              class="back"
              @click=${() => this.changeTab(TradeTab.Form)}>
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

  chartTab() {
    const active = this.tab === TradeTab.Chart;
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
              .tradeProgress=${this.trade.inProgress}
              .grafanaUrl=${this.grafanaUrl}
              .grafanaDsn=${this.grafanaDsn}
              .assetIn=${this.trade.assetIn}
              .assetOut=${this.trade.assetOut}
              .spotPrice=${this.trade.spotPrice}
              .usdPrice=${this.assets.usdPrice}>
              <div class="header section" slot="header">
                <uigc-icon-button
                  class="back"
                  @click=${() => this.changeTab(TradeTab.Form)}>
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

  protected validateAssetByOrigin(asset?: Asset, origin?: number) {
    const parachainEntry = findNestedKey(asset?.location, 'parachain');
    return asset?.type === 'External' && parachainEntry?.parachain === origin
      ? asset
      : null;
  }

  assetCheck() {
    if (this.assetCheckEnabled) {
      const assetHub = chainsMap.get('assethub') as Parachain;

      const assetIn = this.validateAssetByOrigin(
        this.trade.assetIn,
        assetHub.parachainId,
      );

      const assetOut = this.validateAssetByOrigin(
        this.trade.assetOut,
        assetHub.parachainId,
      );

      if (assetIn || assetOut) {
        return html`
          <gc-trade-asset-info
            .chain=${assetHub}
            .assets=${this.assets.registry}
            .assetIn=${assetIn}
            .assetOut=${assetOut}></gc-trade-asset-info>
        `;
      }
    }
  }

  ordersSummary() {
    const account = this.account.state;
    if (this.twapOn) {
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
  }

  render() {
    return html`
      <div class="layout-root">
        ${this.chartTab()}
        <div class="layout-trade">
          <div>
            ${this.formTab()} ${this.settingsTab()} ${this.selectAssetTab()}
          </div>
          ${this.assetCheck()}
        </div>
        ${this.ordersSummary()}
      </div>
    `;
  }
}
