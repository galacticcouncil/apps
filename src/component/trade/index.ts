import { html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';
import { classMap } from 'lit/directives/class-map.js';

import * as i18n from 'i18next';

import { PoolApp } from '../base/PoolApp';
import { baseStyles } from '../styles/base.css';
import { headerStyles } from '../styles/header.css';
import { tradeLayoutStyles } from '../styles/layout/trade.css';

import { Account, TradeConfig, tradeSettingsCursor } from '../../db';
import { DatabaseController } from '../../db.ctrl';
import {
  TradeInfo,
  TradeTwap,
  TWAP_BLOCK_PERIOD,
  TWAP_RETRIES,
  TradeApi,
} from '../../api/trade';
import {
  formatAmount,
  humanizeAmount,
  MIN_NATIVE_AMOUNT,
  toBn,
} from '../../utils/amount';
import { isAssetInAllowed, isAssetOutAllowed } from '../../utils/asset';
import { calculateEffectiveBalance } from '../../utils/balance';
import { getRenderString } from '../../utils/dom';
import { isEvmAccount } from '../../utils/evm';
import { updateQueryParams } from '../../utils/url';

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
} from '@galacticcouncil/sdk';
import { SubmittableExtrinsic } from '@polkadot/api/promise/types';

import './form';
import './settings';
import '../chart';
import '../selector/asset';

import {
  TradeTab,
  TradeState,
  DEFAULT_TRADE_STATE,
  TradeTwapState,
  DEFAULT_TWAP_STATE,
  TransactionFee,
} from './types';
import { TxInfo, TxNotificationMssg } from '../transaction/types';
import { AssetSelector } from '../selector/types';

@customElement('gc-trade-app')
export class TradeApp extends PoolApp {
  protected settings = new DatabaseController<TradeConfig>(
    this,
    tradeSettingsCursor,
  );

  protected tx: Transaction = null;
  protected tradeApi: TradeApi = null;

  protected headerTitle: string = i18n.t('trade.title');

  @property({ type: Boolean }) chart: Boolean = false;
  @property({ type: Boolean }) twap: Boolean = false;

  @state() tab: TradeTab = TradeTab.TradeForm;
  @state() trade: TradeState = { ...DEFAULT_TRADE_STATE };
  @state() tradeTwap: TradeTwapState = { ...DEFAULT_TWAP_STATE };
  @state() asset = {
    active: null as string,
    selector: null as AssetSelector,
  };

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
    const { swaps } = this.trade;
    const pools: string[] = swaps.map((swap: any) => swap.pool);
    const notSupportedRoute =
      pools.includes(PoolType.LBP) || pools.includes(PoolType.XYK);
    return this.twap && !notSupportedRoute;
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
  ): Promise<TradeInfo> {
    const { slippage } = this.settings.state;
    try {
      return await this.tradeApi.getSell(assetIn, assetOut, amountIn, slippage);
    } catch (error) {
      console.error(error);
      this.resetTrade();
    }
  }

  private async calculateSellTwap(spotPrice: string) {
    const { transactionFee, assetIn, assetOut, amountIn, swaps } = this.trade;
    if (this.isTwapEnabled()) {
      const txFee = this.calculateAssetPrice(
        assetIn,
        transactionFee.amountNative,
      );
      const minAmount = this.calculateAssetPrice(assetIn, MIN_NATIVE_AMOUNT);
      const priceDifference = this.tradeApi.getSellPriceDifference(
        Number(amountIn),
        Number(spotPrice),
        swaps,
      );
      const twap = await this.tradeApi.getSellTwap(
        assetIn,
        assetOut,
        Number(amountIn),
        minAmount.toNumber(),
        txFee.toNumber(),
        priceDifference.toNumber(),
        this.blockTime,
      );
      const amountInUsd = this.calculateDollarPrice(
        assetIn,
        twap.amountIn.toString(),
      );
      const amountOutUsd = this.calculateDollarPrice(
        assetOut,
        twap.amountOut.toString(),
      );
      const orderSlippageUsd = this.calculateDollarPrice(
        assetOut,
        twap.orderSlippage.toString(),
      );
      this.tradeTwap = {
        ...this.tradeTwap,
        inProgress: false,
        twap: { ...twap, amountInUsd, amountOutUsd, orderSlippageUsd },
      };
    }
  }

  protected async calculateSell(
    assetIn: Asset,
    assetOut: Asset,
    amountIn: string,
  ) {
    const { trade, transaction, slippage } = await this.safeSell(
      assetIn,
      assetOut,
      amountIn,
    );
    const tradeHuman = trade.toHuman();
    const amountInUsd = this.calculateDollarPrice(assetIn, tradeHuman.amountIn);
    const amountOutUsd = this.calculateDollarPrice(
      assetOut,
      tradeHuman.amountOut,
    );
    const slippageUsd = this.calculateDollarPrice(assetOut, slippage);
    const spotPrice = scale(ONE, assetOut.decimals)
      .div(trade.spotPrice)
      .toFixed();

    // Disable overriding of active asset amount (assetIn) if typing, normalize spotPrice(buy)
    const tradeState = Object.assign({}, tradeHuman);
    delete tradeState.amountIn;
    delete tradeState.spotPrice;

    this.trade = {
      ...this.trade,
      spotPrice: spotPrice,
      inProgress: false,
      assetIn: assetIn,
      amountInUsd: amountInUsd,
      assetOut: assetOut,
      amountOutUsd: amountOutUsd,
      afterSlippage: slippage,
      afterSlippageUsd: slippageUsd,
      ...tradeState,
    };

    this.tx = transaction;
    this.validateTrade(TradeType.Sell);
    this.validateEnoughBalance();
    this.trade.transactionFee
      ? this.syncTransactionFee()
      : await this.syncTransactionFee();
    this.calculateSellTwap(tradeHuman.spotPrice);
    console.log(tradeHuman);
  }

  private async safeBuy(
    assetIn: Asset,
    assetOut: Asset,
    amountOut: string,
  ): Promise<TradeInfo> {
    const { slippage } = this.settings.state;
    try {
      return await this.tradeApi.getBuy(assetIn, assetOut, amountOut, slippage);
    } catch (error) {
      console.error(error);
      this.resetTrade();
    }
  }

  private async calculateBuyTwap() {
    const { transactionFee, assetIn, assetOut, amountOut, priceImpactPct } =
      this.trade;
    if (this.isTwapEnabled()) {
      const txFee = this.calculateAssetPrice(
        assetIn,
        transactionFee.amountNative,
      );
      const minAmount = this.calculateAssetPrice(assetIn, MIN_NATIVE_AMOUNT);
      const priceImpact = Number(priceImpactPct);
      const priceDifference = Math.abs(priceImpact);
      const twap = await this.tradeApi.getBuyTwap(
        assetIn,
        assetOut,
        Number(amountOut),
        minAmount.toNumber(),
        txFee.toNumber(),
        priceDifference,
        this.blockTime,
      );
      const amountInUsd = this.calculateDollarPrice(
        assetIn,
        twap.amountIn.toString(),
      );
      const amountOutUsd = this.calculateDollarPrice(
        assetOut,
        twap.amountOut.toString(),
      );
      const orderSlippageUsd = this.calculateDollarPrice(
        assetIn,
        twap.orderSlippage.toString(),
      );
      this.tradeTwap = {
        ...this.tradeTwap,
        inProgress: false,
        twap: { ...twap, amountInUsd, amountOutUsd, orderSlippageUsd },
      };
    }
  }

  protected async calculateBuy(
    assetIn: Asset,
    assetOut: Asset,
    amountOut: string,
  ) {
    const { trade, transaction, slippage } = await this.safeBuy(
      assetIn,
      assetOut,
      amountOut,
    );
    const tradeHuman = trade.toHuman();
    const amountInUsd = this.calculateDollarPrice(assetIn, tradeHuman.amountIn);
    const amountOutUsd = this.calculateDollarPrice(
      assetOut,
      tradeHuman.amountOut,
    );
    const slippageUsd = this.calculateDollarPrice(assetIn, slippage);

    // Disable overriding of active asset amount (assetOut) if typing
    const tradeState = Object.assign({}, tradeHuman);
    delete tradeState.amountOut;

    this.trade = {
      ...this.trade,
      inProgress: false,
      assetIn: assetIn,
      amountInUsd: amountInUsd,
      assetOut: assetOut,
      amountOutUsd: amountOutUsd,
      afterSlippage: slippage,
      afterSlippageUsd: slippageUsd,
      ...tradeState,
    };
    this.tx = transaction;
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

  private recalculateTrade() {
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
      assetIn: this.trade.assetOut,
      assetOut: this.trade.assetIn,
      balanceIn: this.trade.balanceOut,
      balanceOut: this.trade.balanceIn,
      amountIn: amountIn,
      amountOut: amountOut,
    };
    this.tradeTwap = {
      ...this.tradeTwap,
      inProgress: false,
      twap: null,
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

    this.tradeTwap = {
      ...this.tradeTwap,
      inProgress: true,
      twap: null,
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

    this.tradeTwap = {
      ...this.tradeTwap,
      inProgress: true,
      twap: null,
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
      this.trade.error['balance'] = i18n.t('trade.error.balance');
    } else {
      delete this.trade.error['balance'];
    }
    this.requestUpdate();
  }

  private translateTradeError(error: string): string {
    switch (error) {
      case 'InsufficientTradingAmount':
        return i18n.t('trade.error.insufficientTradingAmount');
      case 'MaxOutRatioExceeded':
        return i18n.t('trade.error.maxOutRatioExceeded');
      case 'MaxInRatioExceeded':
        return i18n.t('trade.error.maxInRatioExceeded');
      case 'TradeNotAllowed':
        return i18n.t('trade.error.tradeNotAllowed');
    }
  }

  validateTrade(type: TradeType) {
    if (this.trade.swaps.length === 0) {
      return;
    }
    const swaps =
      type == TradeType.Buy ? this.trade.swaps.reverse() : this.trade.swaps;
    const swapWithError: any = swaps.find(
      (swap: any) => swap.errors.length > 0,
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
      this.trade.error['pool'] = i18n.t('trade.error.invalidPair');
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
      amountInUsd: null,
      amountOut: null,
      amountOutUsd: null,
      error: withError ? [] : this.trade.error,
      swaps: [],
    };
    this.tradeTwap = {
      ...this.tradeTwap,
      inProgress: false,
      twap: null,
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
      this.tradeTwap = {
        ...this.tradeTwap,
        inProgress: true,
        twap: null,
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
      this.tradeTwap = {
        ...this.tradeTwap,
        inProgress: true,
        twap: null,
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
    feeAssetId: string,
    feeNative: string,
  ): Promise<TransactionFee> {
    const account = this.account.state;
    const feeAsset = this.assets.registry.get(feeAssetId);

    const { amount } = isEvmAccount(account?.address)
      ? await this.paymentApi.getEvmPaymentFee(this.tx.hex, account)
      : await this.paymentApi.getPaymentFee(feeAsset, feeNative);

    return {
      asset: feeAsset,
      amount: amount,
      amountNative: feeNative,
    } as TransactionFee;
  }

  async syncTransactionFee() {
    const account = this.account.state;
    const [paymentInfo, feeAssetId] = await Promise.all([
      this.paymentApi.getPaymentInfo(this.tx, account),
      this.paymentApi.getPaymentFeeAsset(account),
    ]);

    this.trade.transactionFee = await this.calculateTransactionFee(
      feeAssetId,
      paymentInfo.partialFee.toString(),
    );
    this.requestUpdate();
  }

  private async updateMaxAmountIn(asset: Asset) {
    const account = this.account.state;
    const feeAssetId = await this.paymentApi.getPaymentFeeAsset(account);
    const { amount, decimals } = this.trade.balanceIn;

    if (asset.id !== feeAssetId) {
      const balanceIn = formatAmount(amount, decimals);
      this.updateAmountIn(balanceIn);
      return;
    }

    const { transaction } = await this.safeSell(
      this.trade.assetIn,
      this.trade.assetOut,
      ONE.toFixed(),
    );

    const { partialFee } = await this.paymentApi.getPaymentInfo(
      transaction,
      account,
    );

    const txFee = await this.calculateTransactionFee(
      feeAssetId,
      partialFee.toString(),
    );

    const eb = calculateEffectiveBalance(
      this.trade.balanceIn.amount,
      this.trade.assetIn.symbol,
      txFee.amount,
      txFee.asset.symbol,
      bnum(txFee.asset.existentialDeposit),
    );
    const effectiveIn = formatAmount(eb, decimals);
    this.updateAmountIn(effectiveIn);
  }

  private async updateMaxAmountOut(asset: Asset) {
    const account = this.account.state;
    const feeAssetId = await this.paymentApi.getPaymentFeeAsset(account);

    const { amount, decimals } = this.trade.balanceOut;

    if (asset.id !== feeAssetId) {
      const balanceOut = formatAmount(amount, decimals);
      this.updateAmountOut(balanceOut);
      return;
    }

    const { transaction } = await this.safeBuy(
      this.trade.assetIn,
      this.trade.assetOut,
      ONE.toFixed(),
    );

    const { partialFee } = await this.paymentApi.getPaymentInfo(
      transaction,
      account,
    );

    const txFee = await this.calculateTransactionFee(
      feeAssetId,
      partialFee.toString(),
    );

    const eb = calculateEffectiveBalance(
      this.trade.balanceOut.amount,
      this.trade.assetOut.symbol,
      txFee.amount,
      txFee.asset.symbol,
      bnum(txFee.asset.existentialDeposit),
    );
    const effectiveOut = formatAmount(eb, decimals);
    this.updateAmountOut(effectiveOut);
  }

  notificationTemplate(trade: TradeState, status: string): TxNotificationMssg {
    const isSell: boolean = trade.type == TradeType.Sell;
    const amountIn = trade.amountIn;
    const assetIn = trade.assetIn.symbol;
    const amountOut = trade.amountOut;
    const assetOut = trade.assetOut.symbol;
    const template = html`
      <span>${status ? trade.type : isSell ? 'You sold' : 'You bought'}</span>
      <span class="highlight"
        >${humanizeAmount(isSell ? amountIn : amountOut)}</span
      >
      <span class="highlight">${isSell ? assetIn : assetOut}</span>
      <span>${'for'}</span>
      <span class="highlight"
        >${humanizeAmount(isSell ? amountOut : amountIn)}</span
      >
      <span class="highlight">${isSell ? assetOut : assetIn}</span>
      <span>${status}</span>
    `;
    return {
      message: template,
      rawHtml: getRenderString(template),
    } as TxNotificationMssg;
  }

  private processTx(
    account: Account,
    transaction: Transaction,
    trade: TradeState,
  ) {
    const notification = {
      processing: this.notificationTemplate(trade, 'submitted'),
      success: this.notificationTemplate(trade, null),
      failure: this.notificationTemplate(trade, 'failed'),
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
    if (account && this.tx) {
      this.processTx(account, this.tx, this.trade);
    }
  }

  dcaNotificationTemplate(
    twap: TradeTwap,
    asset: Asset,
    status: string,
  ): TxNotificationMssg {
    const { trade, tradeReps, tradeTime, budget } = twap;
    const tradeHuman = trade.toHuman();
    const timeframe = this._humanizer.humanize(tradeTime, {
      round: true,
      largest: 2,
    });

    const template = html`
      <span>${tradeReps}</span>
      <span>${'trades'}</span>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="6"
        height="7"
        viewBox="0 0 6 7"
        fill="none"
      >
        <line
          x1="0.353553"
          y1="1.16671"
          x2="5.13786"
          y2="5.95101"
          stroke="#878C9E"
        />
        <line
          x1="5.22074"
          y1="1.07743"
          x2="0.436439"
          y2="5.86173"
          stroke="#878C9E"
        />
      </svg>
      <span>${humanizeAmount(tradeHuman.amountIn)}</span>
      <span>${asset?.symbol}</span>
      <span>${'placed during next'}</span>
      <span class="highlight">${timeframe}</span>
      <span>${'amounting to a total of'}</span>
      <span class="highlight">${humanizeAmount(budget.toString())}</span>
      <span class="highlight">${asset?.symbol}</span>
      <span>${status}</span>
    `;
    return {
      message: template,
      rawHtml: getRenderString(template),
    } as TxNotificationMssg;
  }

  private processDca(
    account: Account,
    transaction: Transaction,
    twap: TradeTwap,
    asset: Asset,
  ) {
    const notification = {
      processing: this.dcaNotificationTemplate(twap, asset, 'submitted'),
      success: this.dcaNotificationTemplate(twap, asset, 'placed'),
      failure: this.dcaNotificationTemplate(twap, asset, 'failed'),
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
    const { slippageTwap } = this.settings.state;

    if (account) {
      const { assetIn } = this.trade;
      const { twap } = this.tradeTwap;
      const totalBudget = toBn(twap.budget.toString(), assetIn.decimals);

      const { api } = this.chain.state;
      const tx: SubmittableExtrinsic = api.tx.dca.schedule(
        {
          owner: account.address,
          period: TWAP_BLOCK_PERIOD,
          maxRetries: TWAP_RETRIES,
          totalAmount: totalBudget.toFixed(),
          slippage: Number(slippageTwap) * 10000,
          order: twap.order,
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

      this.processDca(account, transaction, twap, assetIn);
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
    const { router } = this.chain.state;
    this.tradeApi = new TradeApi(router);
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
    if (window.innerWidth > 1023 && TradeTab.TradeChart == this.tab) {
      this.changeTab(TradeTab.TradeForm);
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

  tradeSettingsTab() {
    const classes = {
      tab: true,
      main: true,
      active: this.tab == TradeTab.TradeSettings,
    };
    return html` <uigc-paper class=${classMap(classes)}>
      <gc-trade-settings @slippage-change=${() => this.recalculateTrade()}>
        <div class="header section" slot="header">
          <uigc-icon-button
            class="back"
            @click=${() => this.changeTab(TradeTab.TradeForm)}
          >
            <uigc-icon-back></uigc-icon-back>
          </uigc-icon-button>
          <uigc-typography variant="section"
            >${i18n.t('trade.settings.title')}</uigc-typography
          >
          <span></span>
        </div>
      </gc-trade-settings>
    </uigc-paper>`;
  }

  protected onAssetClick(e: CustomEvent) {
    const { id, asset } = this.asset.selector;
    id == 'assetIn' && this.changeAssetIn(asset, e.detail);
    id == 'assetOut' && this.changeAssetOut(asset, e.detail);
    this.updateBalances();
    this.validatePool();
    this.updateQuery();
    this.changeTab(TradeTab.TradeForm);
  }

  selectAssetTab() {
    const classes = {
      tab: true,
      main: true,
      active: this.tab == TradeTab.SelectAsset,
    };
    return html` <uigc-paper class=${classMap(classes)}>
      <gc-select-asset
        .assets=${this.assets.tradeable}
        .pairs=${this.assets.pairs}
        .balances=${this.assets.balance}
        .usdPrice=${this.assets.usdPrice}
        .assetIn=${this.trade.assetIn}
        .assetOut=${this.trade.assetOut}
        .switchAllowed=${this.isSwitchEnabled()}
        .selector=${this.asset.selector}
        @asset-click=${this.onAssetClick}
      >
        <div class="header section" slot="header">
          <uigc-icon-button
            class="back"
            @click=${() => this.changeTab(TradeTab.TradeForm)}
          >
            <uigc-icon-back></uigc-icon-back>
          </uigc-icon-button>
          <uigc-typography variant="section"
            >${i18n.t('trade.selectAsset')}</uigc-typography
          >
          <span></span>
        </div>
      </gc-select-asset>
    </uigc-paper>`;
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
    return (
      this.isSwapEmpty() ||
      !this.isSwapSelected() ||
      !this.hasAccount() ||
      !this.tx
    );
  }

  protected isFormLoaded() {
    return this.assets.tradeable.length > 0;
  }

  protected isFormReadOnly() {
    return false;
  }

  tradeFormTab() {
    const classes = {
      tab: true,
      main: true,
      active: this.tab == TradeTab.TradeForm,
    };
    return html` <uigc-paper class=${classMap(classes)} id="default-tab">
      <gc-trade-form
        .assets=${this.assets.registry}
        .inProgress=${this.trade.inProgress}
        .disabled=${this.isFormDisabled()}
        .loaded=${this.isFormLoaded()}
        .readonly=${this.isFormReadOnly()}
        .switchAllowed=${this.isSwitchEnabled()}
        .tradeType=${this.trade.type}
        .twap=${this.tradeTwap.twap}
        .twapAllowed=${this.isTwapEnabled()}
        .twapProgress=${this.tradeTwap.inProgress}
        .assetIn=${this.trade.assetIn}
        .assetOut=${this.trade.assetOut}
        .amountIn=${this.trade.amountIn}
        .amountInUsd=${this.trade.amountInUsd}
        .amountOut=${this.trade.amountOut}
        .amountOutUsd=${this.trade.amountOutUsd}
        .balanceIn=${this.trade.balanceIn}
        .balanceOut=${this.trade.balanceOut}
        .spotPrice=${this.trade.spotPrice}
        .afterSlippage=${this.trade.afterSlippage}
        .afterSlippageUsd=${this.trade.afterSlippageUsd}
        .priceImpactPct=${this.trade.priceImpactPct}
        .tradeFee=${this.trade.tradeFee}
        .tradeFeePct=${this.trade.tradeFeePct}
        .tradeFeeRange=${this.trade.tradeFeeRange}
        .transactionFee=${this.trade.transactionFee}
        .error=${this.trade.error}
        .swaps=${this.trade.swaps}
        @asset-input-change=${this.onAssetInputChange}
        @asset-max-click=${this.onAssetMaxClick}
        @asset-selector-click=${this.onAssetSelectorClick}
        @asset-switch-click=${this.onAssetSwitchClick}
        @swap-click=${() => this.onSwapClick()}
        @twap-click=${() => this.onTwapClick()}
        @slippage-click=${() => this.changeTab(TradeTab.TradeSettings)}
      >
        <div class="header" slot="header">
          <uigc-typography variant="title" gradient
            >${this.headerTitle}</uigc-typography
          >
          <span class="grow"></span>
          <uigc-icon-button
            basic
            class="chart-btn"
            @click=${() => this.changeTab(TradeTab.TradeChart)}
          >
            <uigc-icon-chart></uigc-icon-chart>
          </uigc-icon-button>
          <uigc-icon-button
            basic
            @click=${() => this.changeTab(TradeTab.TradeSettings)}
          >
            <uigc-icon-settings></uigc-icon-settings>
          </uigc-icon-button>
        </div>
      </gc-trade-form>
    </uigc-paper>`;
  }

  tradeChartTab() {
    const classes = {
      tab: true,
      chart: true,
      active: this.tab == TradeTab.TradeChart,
    };
    return html` <uigc-paper class=${classMap(classes)}>
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
            .usdPrice=${this.assets.usdPrice}
          >
            <div class="header section" slot="header">
              <uigc-icon-button
                class="back"
                @click=${() => this.changeTab(TradeTab.TradeForm)}
              >
                <uigc-icon-back></uigc-icon-back>
              </uigc-icon-button>
              <uigc-typography variant="section"
                >${i18n.t('chart.title')}</uigc-typography
              >
              <span></span>
            </div>
          </gc-trade-chart>
        `,
      )}
    </uigc-paper>`;
  }

  tradeOrdersSummary() {
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
          .accountName=${account?.name}
        >
          <uigc-typography slot="header" variant="title"
            >Your Orders</uigc-typography
          >
        </gc-trade-orders>
      `;
    }
  }

  render() {
    return html`
      <div class="layout-root">
        ${this.tradeChartTab()} ${this.tradeFormTab()}
        ${this.tradeSettingsTab()} ${this.selectAssetTab()}
        ${this.tradeOrdersSummary()}
      </div>
    `;
  }
}
