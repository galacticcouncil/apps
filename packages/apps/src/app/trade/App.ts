import { html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';
import { classMap } from 'lit/directives/class-map.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';

import { i18n } from 'localization';
import { translation } from './locales';

import { PoolApp } from 'app/PoolApp';
import {
  Account,
  DatabaseController,
  TradeConfig,
  TradeConfigCursor,
} from 'db';
import { TxInfo, TxMessage } from 'signer/types';
import { baseStyles } from 'styles/base.css';
import { headerStyles } from 'styles/header.css';
import { tradeLayoutStyles } from 'styles/layout/trade.css';
import {
  exchangeNative,
  formatAmount,
  humanizeAmount,
  MIN_NATIVE_AMOUNT,
  toBn,
} from 'utils/amount';
import { isAssetInAllowed, isAssetOutAllowed } from 'utils/asset';
import { calculateEffectiveBalance } from 'utils/balance';
import { isEvmAccount } from 'utils/evm';
import { getTradeMaxAmountIn, getTradeMinAmountOut } from 'utils/slippage';
import { updateQueryParams } from 'utils/url';

import '@galacticcouncil/ui';
import {
  Asset,
  Amount,
  PoolType,
  scale,
  ONE,
  SYSTEM_ASSET_ID,
  TradeType,
  Transaction,
  bnum,
  Trade,
  Swap,
  ZERO,
} from '@galacticcouncil/sdk';

import './Form';
import './Settings';
import './chart';
import './orders';

import 'element/selector';
import { AssetSelector } from 'element/selector/types';

import { TwapApi } from './api';
import {
  TradeTab,
  TradeState,
  DEFAULT_TRADE_STATE,
  TwapOrder,
  TwapState,
  DEFAULT_TWAP_STATE,
  TransactionFee,
} from './types';

@customElement('gc-trade')
export class TradeApp extends PoolApp {
  protected tradeConfig = new DatabaseController<TradeConfig>(
    this,
    TradeConfigCursor,
  );

  protected tradeApi: TwapApi = null;

  @property({ type: Boolean }) chart: Boolean = false;
  @property({ type: Boolean }) twapOn: Boolean = false;

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
    const assetIn = this.trade.assetIn?.id;
    const assetOut = this.trade.assetOut?.id;

    if (!assetIn || !assetOut) {
      return true;
    }

    const assetInAllowed = isAssetInAllowed(
      this.assets.tradeable,
      this.assets.pairs,
      assetOut,
    );
    const assetOutAllowed = isAssetOutAllowed(
      this.assets.tradeable,
      this.assets.pairs,
      assetIn,
    );
    return assetInAllowed && assetOutAllowed;
  }

  isEmptyAmount(amount: string): boolean {
    return amount == null || amount == '' || amount == '0';
  }

  isPoolError(): boolean {
    const assetIn = this.trade.assetIn?.id;
    const assetOut = this.trade.assetOut?.id;

    if (!assetIn || !assetOut) {
      return false;
    }

    const assetInAllowed = isAssetInAllowed(
      this.assets.tradeable,
      this.assets.pairs,
      assetIn,
    );
    const assetOutAllowed = isAssetOutAllowed(
      this.assets.tradeable,
      this.assets.pairs,
      assetOut,
    );
    return assetIn === assetOut || !assetInAllowed || !assetOutAllowed;
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
    const { router } = this.chain.state;
    try {
      return await router.getBestSell(assetIn.id, assetOut.id, amountIn);
    } catch (error) {
      console.error(error);
      this.resetTrade();
    }
  }

  private async calculateSellTwap() {
    const { assetIn, assetOut, trade, transactionFee } = this.trade;
    if (this.isTwapEnabled()) {
      const txFee = exchangeNative(
        this.assets.nativePrice,
        assetIn,
        transactionFee.amountNative,
      );
      const amountInMin = exchangeNative(
        this.assets.nativePrice,
        assetIn,
        MIN_NATIVE_AMOUNT,
      );
      const twap = await this.tradeApi.getSellTwap(
        amountInMin,
        assetIn,
        assetOut,
        trade,
        txFee,
        this.blockTime,
      );
      this.twap = {
        ...this.twap,
        inProgress: false,
        order: twap,
      };
    }
  }

  protected async calculateSell(
    assetIn: Asset,
    assetOut: Asset,
    amountIn: string,
  ) {
    const trade = await this.safeSell(assetIn, assetOut, amountIn);
    const tradeHuman = trade.toHuman();
    const spotPrice = scale(ONE, assetOut.decimals)
      .div(trade.spotPrice)
      .toFixed();

    const { slippage } = this.tradeConfig.state;
    const minAmountOut = getTradeMinAmountOut(trade, slippage);

    const { amountOut } = Object.assign({}, tradeHuman);
    this.trade = {
      ...this.trade,
      amountOut: amountOut,
      assetIn: assetIn,
      assetOut: assetOut,
      inProgress: false,
      minAmountOut: minAmountOut,
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
    const { router } = this.chain.state;
    try {
      return await router.getBestBuy(assetIn.id, assetOut.id, amountOut);
    } catch (error) {
      console.error(error);
      this.resetTrade();
    }
  }

  private async calculateBuyTwap() {
    const { assetIn, assetOut, trade, transactionFee } = this.trade;
    if (this.isTwapEnabled()) {
      const txFee = exchangeNative(
        this.assets.nativePrice,
        assetIn,
        transactionFee.amountNative,
      );
      const amountInMin = exchangeNative(
        this.assets.nativePrice,
        assetIn,
        MIN_NATIVE_AMOUNT,
      );
      const twap = await this.tradeApi.getBuyTwap(
        amountInMin,
        assetIn,
        assetOut,
        trade,
        txFee,
        this.blockTime,
      );
      this.twap = {
        ...this.twap,
        inProgress: false,
        order: twap,
      };
    }
  }

  protected async calculateBuy(
    assetIn: Asset,
    assetOut: Asset,
    amountOut: string,
  ) {
    const trade = await this.safeBuy(assetIn, assetOut, amountOut);
    const tradeHuman = trade.toHuman();

    const { slippage } = this.tradeConfig.state;
    const maxAmountIn = getTradeMaxAmountIn(trade, slippage);

    const { amountIn, spotPrice } = Object.assign({}, tradeHuman);
    this.trade = {
      ...this.trade,
      inProgress: false,
      amountIn: amountIn,
      assetIn: assetIn,
      assetOut: assetOut,
      maxAmountIn: maxAmountIn,
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
    const { router } = this.chain.state;
    const price: Amount = await router.getBestSpotPrice(
      assetIn.id,
      assetOut.id,
    );
    const spotPrice = scale(ONE, price.decimals).div(price.amount).toFixed();
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
    transaction: Transaction,
    feeAssetId: string,
    feeNative: string,
  ): Promise<TransactionFee> {
    const account = this.account.state;
    const feeAsset = this.assets.registry.get(feeAssetId);

    const { amount } = isEvmAccount(account?.address)
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
    const { trade } = this.trade;
    const transaction = trade.toTx(ZERO);
    const [paymentInfo, feeAssetId] = await Promise.all([
      this.paymentApi.getPaymentInfo(transaction, account),
      this.paymentApi.getPaymentFeeAsset(account),
    ]);

    this.trade.transactionFee = await this.calculateTransactionFee(
      transaction,
      feeAssetId,
      paymentInfo.partialFee.toString(),
    );
    this.requestUpdate();
  }

  private async updateMaxAmountIn(asset: Asset) {
    const account = this.account.state;
    const feeAssetId = await this.paymentApi.getPaymentFeeAsset(account);

    const { assetIn, assetOut, balanceIn } = this.trade;

    if (asset.id !== feeAssetId) {
      const { amount, decimals } = balanceIn;
      const amountOut = formatAmount(amount, decimals);
      this.updateAmountIn(amountOut);
      return;
    }

    const trade = await this.safeSell(assetIn, assetOut, ONE.toFixed());
    const transaction = trade.toTx(ZERO);
    const paymentInfo = await this.paymentApi.getPaymentInfo(
      transaction,
      account,
    );
    const txFee = await this.calculateTransactionFee(
      transaction,
      feeAssetId,
      paymentInfo.partialFee.toString(),
    );

    const eb = calculateEffectiveBalance(
      this.trade.balanceIn.amount,
      this.trade.assetIn.symbol,
      txFee.amount,
      txFee.asset.symbol,
      bnum(txFee.asset.existentialDeposit),
    );
    const effectiveIn = formatAmount(eb, assetIn.decimals);
    this.updateAmountIn(effectiveIn);
  }

  private async updateMaxAmountOut(asset: Asset) {
    const account = this.account.state;
    const feeAssetId = await this.paymentApi.getPaymentFeeAsset(account);

    const { assetIn, assetOut, balanceOut } = this.trade;

    if (asset.id !== feeAssetId) {
      const { amount, decimals } = balanceOut;
      const amountOut = formatAmount(amount, decimals);
      this.updateAmountOut(amountOut);
      return;
    }

    const trade = await this.safeBuy(assetIn, assetOut, ONE.toFixed());
    const transaction = trade.toTx(ZERO);
    const paymentInfo = await this.paymentApi.getPaymentInfo(
      transaction,
      account,
    );
    const txFee = await this.calculateTransactionFee(
      transaction,
      feeAssetId,
      paymentInfo.partialFee.toString(),
    );

    const eb = calculateEffectiveBalance(
      this.trade.balanceOut.amount,
      this.trade.assetOut.symbol,
      txFee.amount,
      txFee.asset.symbol,
      bnum(txFee.asset.existentialDeposit),
    );
    const effectiveOut = formatAmount(eb, assetOut.decimals);
    this.updateAmountOut(effectiveOut);
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
    transaction: Transaction,
    trade: TradeState,
  ) {
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
      } as TxInfo,
    };
    this.dispatchEvent(new CustomEvent<TxInfo>('gc:tx:new', options));
  }

  private async onSwapClick() {
    const account = this.account.state;
    if (account) {
      const { trade, type, maxAmountIn, minAmountOut } = this.trade;
      const tradeLimit =
        type === TradeType.Sell ? minAmountOut.amount : maxAmountIn.amount;
      const transaction = trade.toTx(tradeLimit);
      this.processTx(account, transaction, this.trade);
    }
  }

  twapNotificationTemplate(
    order: TwapOrder,
    asset: Asset,
    status: string,
  ): TxMessage {
    const { amountIn, amountInPerTrade, reps, time } = order.toHuman();
    const timeframe = this._humanizer.humanize(time, {
      round: true,
      largest: 2,
    });

    const message = i18n.t('notify.twap', {
      amountIn: humanizeAmount(amountInPerTrade),
      amountInBudget: humanizeAmount(amountIn),
      assetIn: asset.symbol,
      noOfTrades: reps,
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
    transaction: Transaction,
    order: TwapOrder,
    asset: Asset,
  ) {
    const notification = {
      processing: this.twapNotificationTemplate(order, asset, 'submitted'),
      success: this.twapNotificationTemplate(order, asset, 'placed'),
      failure: this.twapNotificationTemplate(order, asset, 'failed'),
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

  private async onTwapClick() {
    const account = this.account.state;
    const { maxRetries } = this.tradeConfig.state;

    if (account) {
      const { assetIn } = this.trade;
      const { order } = this.twap;
      const transaction = order.toTx(account.address, maxRetries);
      this.processTwap(account, transaction, order, assetIn);
    }
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
    const { api, router } = this.chain.state;
    this.tradeApi = new TwapApi(api, router, TradeConfigCursor);

    this.initAssets();
    this.validatePool();
    this.recalculateSpotPrice();
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
    id == 'assetIn' && this.updateMaxAmountIn(asset);
    id == 'assetOut' && this.updateMaxAmountOut(asset);
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
    };
    return html`
      <uigc-paper class=${classMap(classes)} id="default-tab">
        <gc-trade-form
          .assets=${this.assets.registry}
          .usdPrice=${this.assets.usdPrice}
          .inProgress=${this.trade.inProgress}
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
          .maxAmountIn=${this.trade.maxAmountIn}
          .minAmountOut=${this.trade.minAmountOut}
          .spotPrice=${this.trade.spotPrice}
          .trade=${this.trade.trade}
          .tradeType=${this.trade.type}
          .transactionFee=${this.trade.transactionFee}
          .twap=${this.twap.order}
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
            <uigc-typography variant="title" gradient>
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
    const classes = {
      tab: true,
      main: true,
      active: this.tab == TradeTab.Settings,
    };
    return html`
      <uigc-paper class=${classMap(classes)}>
        <gc-trade-settings @settings-change=${() => this.recalculateTrade()}>
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

  protected onAssetClick(e: CustomEvent) {
    const { id, asset } = this.asset.selector;
    id == 'assetIn' && this.changeAssetIn(asset, e.detail);
    id == 'assetOut' && this.changeAssetOut(asset, e.detail);
    this.updateBalances();
    this.validatePool();
    this.updateQuery();
    this.changeTab(TradeTab.Form);
  }

  selectAssetTab() {
    const classes = {
      tab: true,
      main: true,
      active: this.tab == TradeTab.SelectAsset,
    };
    return html`
      <uigc-paper class=${classMap(classes)}>
        <gc-select-asset
          .assets=${this.assets.tradeable}
          .pairs=${this.assets.pairs}
          .balances=${this.assets.balance}
          .usdPrice=${this.assets.usdPrice}
          .assetIn=${this.trade.assetIn}
          .assetOut=${this.trade.assetOut}
          .switchAllowed=${this.isSwitchEnabled()}
          .selector=${this.asset.selector}
          @asset-click=${this.onAssetClick}>
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
    const classes = {
      tab: true,
      chart: true,
      active: this.tab == TradeTab.Chart,
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

  ordersSummary() {
    const account = this.account.state;
    if (this.twap) {
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
