import { html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';
import { classMap } from 'lit/directives/class-map.js';

import * as i18n from 'i18next';

import { PoolApp } from '../base/PoolApp';
import { baseStyles } from '../styles/base.css';
import { headerStyles } from '../styles/header.css';
import { tradeLayoutStyles } from '../styles/layout/trade.css';

import { Account, tradeSettingsCursor } from '../../db';
import { TradeInfo, TradeTwap, TWAP_BLOCK_PERIOD, TWAP_RETRIES, TradeApi } from '../../api/trade';
import { formatAmount, humanizeAmount, MIN_NATIVE_AMOUNT, toBn } from '../../utils/amount';
import { isAssetInAllowed, isAssetOutAllowed } from '../../utils/asset';
import { calculateEffectiveBalance } from '../../utils/balance';
import { updateQueryParams } from '../../utils/url';
import { getRenderString } from '../../utils/dom';

import '@galacticcouncil/ui';
import {
  Amount,
  BigNumber,
  bnum,
  ONE,
  PoolAsset,
  scale,
  SYSTEM_ASSET_ID,
  TradeType,
  Transaction,
} from '@galacticcouncil/sdk';
import { SubmittableExtrinsic } from '@polkadot/api/promise/types';
import { Balance } from '@polkadot/types/interfaces';

import './form';
import './settings';
import '../chart';
import '../selector/asset';

import { TradeTab, TradeState, DEFAULT_TRADE_STATE, TradeTwapState, DEFAULT_TWAP_STATE, TransactionFee } from './types';
import { TxInfo, TxNotificationMssg } from '../transaction/types';
import { AssetSelector } from '../selector/types';

@customElement('gc-trade-app')
export class TradeApp extends PoolApp {
  private tx: Transaction = null;

  private tradeApi: TradeApi = null;

  @state() tab: TradeTab = TradeTab.TradeForm;
  @state() trade: TradeState = { ...DEFAULT_TRADE_STATE };
  @state() tradeTwap: TradeTwapState = { ...DEFAULT_TWAP_STATE };
  @state() asset = {
    active: null as string,
    selector: null as AssetSelector,
  };

  @property({ type: Boolean }) chart: Boolean = false;
  @property({ type: Boolean }) twap: Boolean = false;
  @property({ type: String }) assetIn: string = null;
  @property({ type: String }) assetOut: string = null;

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
    return this.tradeTwap.active;
  }

  isSwitchEnabled(): boolean {
    const assetIn = this.trade.assetIn?.id;
    const assetOut = this.trade.assetOut?.id;

    if (!assetIn || !assetOut) {
      return true;
    }

    const assetInAllowed = isAssetInAllowed(this.assets.list, this.assets.pairs, assetOut);
    const assetOutAllowed = isAssetOutAllowed(this.assets.list, this.assets.pairs, assetIn);
    return assetInAllowed && assetOutAllowed;
  }

  isEmptyAmount(amount: string): boolean {
    return amount == '' || amount == '0';
  }

  isPoolError(): boolean {
    const assetIn = this.trade.assetIn?.id;
    const assetOut = this.trade.assetOut?.id;

    if (!assetIn || !assetOut) {
      return false;
    }

    const assetInAllowed = isAssetInAllowed(this.assets.list, this.assets.pairs, assetIn);
    const assetOutAllowed = isAssetOutAllowed(this.assets.list, this.assets.pairs, assetOut);
    return assetIn === assetOut || !assetInAllowed || !assetOutAllowed;
  }

  changeTab(active: TradeTab) {
    this.tab = active;
    this.requestUpdate();
  }

  private async safeSell(assetIn: PoolAsset, assetOut: PoolAsset, amountIn: string): Promise<TradeInfo> {
    try {
      return await this.tradeApi.getSell(assetIn, assetOut, amountIn);
    } catch (error) {
      console.error(error);
      this.resetTrade();
    }
  }

  private async calculateSellTwap() {
    const { transactionFee, assetIn, assetOut, amountIn, spotPrice, swaps } = this.trade;
    if (this.twap && transactionFee) {
      const txFee = this.calculateAssetPrice(assetIn, transactionFee.amountNative);
      const minAmount = this.calculateAssetPrice(assetIn, MIN_NATIVE_AMOUNT);
      const priceDifference = this.tradeApi.getSellPriceDifference(Number(amountIn), Number(spotPrice), swaps);
      const twap = await this.tradeApi.getSellTwap(
        assetIn,
        assetOut,
        Number(amountIn),
        minAmount.toNumber(),
        txFee.toNumber(),
        priceDifference.toNumber(),
        this.blockTime
      );
      const amountInUsd = this.calculateDollarPrice(assetIn, twap.amountIn.toString());
      const amountOutUsd = this.calculateDollarPrice(assetOut, twap.amountOut.toString());
      const orderSlippageUsd = this.calculateDollarPrice(assetOut, twap.orderSlippage.toString());
      this.tradeTwap = {
        ...this.tradeTwap,
        inProgress: false,
        twap: { ...twap, amountInUsd, amountOutUsd, orderSlippageUsd },
      };
    }
  }

  async calculateSell(assetIn: PoolAsset, assetOut: PoolAsset, amountIn: string) {
    const { trade, transaction, slippage } = await this.safeSell(assetIn, assetOut, amountIn);
    const tradeHuman = trade.toHuman();
    const amountInUsd = this.calculateDollarPrice(assetIn, tradeHuman.amountIn);
    const amountOutUsd = this.calculateDollarPrice(assetOut, tradeHuman.amountOut);
    const slippageUsd = this.calculateDollarPrice(assetOut, slippage);

    // Disable overriding of active asset amount (assetIn) if typing
    const tradeState = Object.assign({}, tradeHuman);
    delete tradeState.amountIn;

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
    this.validateTrade(TradeType.Sell);
    this.validateEnoughBalance();
    this.syncTransactionFee();
    this.calculateSellTwap();
    console.log(tradeHuman);
  }

  private async safeBuy(assetIn: PoolAsset, assetOut: PoolAsset, amountOut: string): Promise<TradeInfo> {
    try {
      return await this.tradeApi.getBuy(assetIn, assetOut, amountOut);
    } catch (error) {
      console.error(error);
      this.resetTrade();
    }
  }

  private async calculateBuyTwap() {
    const { transactionFee, assetIn, assetOut, amountOut, priceImpactPct } = this.trade;
    if (this.twap && transactionFee) {
      const txFee = this.calculateAssetPrice(assetIn, transactionFee.amountNative);
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
        this.blockTime
      );
      const amountInUsd = this.calculateDollarPrice(assetIn, twap.amountIn.toString());
      const amountOutUsd = this.calculateDollarPrice(assetOut, twap.amountOut.toString());
      const orderSlippageUsd = this.calculateDollarPrice(assetIn, twap.orderSlippage.toString());
      this.tradeTwap = {
        ...this.tradeTwap,
        inProgress: false,
        twap: { ...twap, amountInUsd, amountOutUsd, orderSlippageUsd },
      };
    }
  }

  async calculateBuy(assetIn: PoolAsset, assetOut: PoolAsset, amountOut: string) {
    const { trade, transaction, slippage } = await this.safeBuy(assetIn, assetOut, amountOut);
    const tradeHuman = trade.toHuman();
    const amountInUsd = this.calculateDollarPrice(assetIn, tradeHuman.amountIn);
    const amountOutUsd = this.calculateDollarPrice(assetOut, tradeHuman.amountOut);
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
    this.syncTransactionFee();
    this.calculateBuyTwap();
    console.log(tradeHuman);
  }

  private recalculateBestSell() {
    this.calculateSell(this.trade.assetIn, this.trade.assetOut, this.trade.amountIn);
  }

  private recalculateBestBuy() {
    this.calculateBuy(this.trade.assetIn, this.trade.assetOut, this.trade.amountOut);
  }

  private recalculateTrade() {
    if (!this.isSwapSelected() || this.isSwapEmpty() || this.isPoolError()) {
      return;
    } else if (this.trade.assetIn.symbol == this.asset.active) {
      this.recalculateBestSell();
    } else if (this.trade.assetOut.symbol == this.asset.active) {
      this.recalculateBestBuy();
    }
  }

  private async recalculateSpotPrice() {
    const assetIn = this.trade.assetIn;
    const assetOut = this.trade.assetOut;

    if (!assetIn || !assetOut) {
      return;
    }

    const router = this.chain.state.router;
    const price: Amount = await router.getBestSpotPrice(assetIn.id, assetOut.id);
    let spotPrice: string;
    if (this.trade.type == TradeType.Buy) {
      spotPrice = scale(ONE, price.decimals).div(price.amount).toFixed();
    } else {
      spotPrice = formatAmount(price.amount, price.decimals);
    }

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

  switch() {
    if (!this.isSwapSelected()) {
      this.switchAssets(this.trade.amountOut, this.trade.amountIn, false);
    } else if (!this.isSwitchEnabled()) {
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

  private async changeAssetIn(previous: string, asset: PoolAsset) {
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

  private async changeAssetOut(previous: string, asset: PoolAsset) {
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
    const account = this.account.state;

    if (!assetIn || !ammountIn || !account) {
      return;
    }

    const balanceIn = this.assets.balance.get(assetIn);
    const amount = scale(bnum(ammountIn), balanceIn.decimals);
    if (amount.gt(balanceIn.amount)) {
      this.trade.error['balance'] = i18n.t('trade.error.balance');
    } else {
      delete this.trade.error['balance'];
    }
    this.requestUpdate();
  }

  translateTradeError(error: string): string {
    switch (error) {
      case 'InsufficientTradingAmount':
        return i18n.t('trade.error.insufficientTradingAmount');
      case 'MaxOutRatioExceeded':
        return i18n.t('trade.error.maxOutRatioExceeded');
      case 'MaxInRatioExceeded':
        return i18n.t('trade.error.maxInRatioExceeded');
    }
  }

  validateTrade(type: TradeType) {
    if (this.trade.swaps.length === 0) {
      return;
    }
    const swaps = type == TradeType.Buy ? this.trade.swaps.reverse() : this.trade.swaps;
    const swapWithError: any = swaps.find((swap: any) => swap.errors.length > 0);
    if (swapWithError) {
      this.trade.error['trade'] = this.translateTradeError(swapWithError.errors[0]);
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

  private updateBalances() {
    const balanceIn = this.assets.balance.get(this.trade.assetIn?.id);
    const balanceOut = this.assets.balance.get(this.trade.assetOut?.id);
    this.trade = {
      ...this.trade,
      balanceIn: balanceIn && formatAmount(balanceIn.amount, balanceIn.decimals),
      balanceOut: balanceOut && formatAmount(balanceOut.amount, balanceOut.decimals),
    };
  }

  async syncBalances() {
    const account = this.account.state;
    if (account) {
      this.updateBalances();
      this.validateEnoughBalance();
    }
  }

  async calculateTransactionFee(feeAssetId: string, feeAssetNativeBalance: Balance): Promise<TransactionFee> {
    const feeAssetSymbol = this.assets.map.get(feeAssetId).symbol;
    const feeAssetEd = this.assets.details.get(feeAssetId).existentialDeposit;
    const { amount, ed } = await this.paymentApi.getPaymentFee(feeAssetId, feeAssetNativeBalance, feeAssetEd);
    return {
      asset: feeAssetSymbol,
      amount: amount,
      amountNative: feeAssetNativeBalance.toString(),
      ed: ed,
    } as TransactionFee;
  }

  async syncTransactionFee() {
    const account = this.account.state;
    if (account) {
      const { partialFee } = await this.paymentApi.getPaymentInfo(this.tx, account);
      const feeAssetId = await this.paymentApi.getPaymentFeeAsset(account);
      this.trade.transactionFee = await this.calculateTransactionFee(feeAssetId, partialFee);
      this.requestUpdate();
    }
  }

  async updateMaxAmountIn(asset: PoolAsset) {
    const account = this.account.state;
    const feeAssetId = await this.paymentApi.getPaymentFeeAsset(account);

    if (asset.id !== feeAssetId) {
      this.updateAmountIn(this.trade.balanceIn);
      return;
    }

    const { transaction } = await this.safeSell(this.trade.assetIn, this.trade.assetOut, ONE.toFixed());
    const { partialFee } = await this.paymentApi.getPaymentInfo(transaction, account);
    const txFee = await this.calculateTransactionFee(feeAssetId, partialFee);

    const eb = calculateEffectiveBalance(
      this.trade.balanceIn,
      this.trade.assetIn.symbol,
      txFee.ed,
      txFee.asset,
      txFee.amount
    );
    this.updateAmountIn(eb);
  }

  async updateMaxAmountOut(asset: PoolAsset) {
    const account = this.account.state;
    const feeAssetId = await this.paymentApi.getPaymentFeeAsset(account);

    if (asset.id !== feeAssetId) {
      this.updateAmountOut(this.trade.balanceOut);
      return;
    }

    const { transaction } = await this.safeBuy(this.trade.assetIn, this.trade.assetOut, ONE.toFixed());
    const { partialFee } = await this.paymentApi.getPaymentInfo(transaction, account);
    const txFee = await this.calculateTransactionFee(feeAssetId, partialFee);

    const eb = calculateEffectiveBalance(
      this.trade.balanceOut,
      this.trade.assetOut.symbol,
      txFee.ed,
      txFee.asset,
      txFee.amount
    );
    this.updateAmountOut(eb);
  }

  notificationTemplate(trade: TradeState, status: string): TxNotificationMssg {
    const isSell: boolean = trade.type == TradeType.Sell;
    const amountIn = trade.amountIn;
    const assetIn = trade.assetIn.symbol;
    const amountOut = trade.amountOut;
    const assetOut = trade.assetOut.symbol;
    const template = html`
      <span>${status ? trade.type : isSell ? 'You sold' : 'You bought'}</span>
      <span class="highlight">${humanizeAmount(isSell ? amountIn : amountOut)}</span>
      <span class="highlight">${isSell ? assetIn : assetOut}</span>
      <span>${'for'}</span>
      <span class="highlight">${humanizeAmount(isSell ? amountOut : amountIn)}</span>
      <span class="highlight">${isSell ? assetOut : assetIn}</span>
      <span>${status}</span>
    `;
    return {
      message: template,
      rawHtml: getRenderString(template),
    } as TxNotificationMssg;
  }

  processTx(account: Account, transaction: Transaction, trade: TradeState) {
    const notification = {
      processing: this.notificationTemplate(trade, 'submitted'),
      success: this.notificationTemplate(trade, null),
      failure: this.notificationTemplate(trade, 'failed'),
    };
    const options = {
      bubbles: true,
      composed: true,
      detail: { account: account, transaction: transaction, notification: notification } as TxInfo,
    };
    this.dispatchEvent(new CustomEvent<TxInfo>('gc:tx:new', options));
  }

  async swap() {
    const account = this.account.state;
    if (account && this.tx) {
      this.processTx(account, this.tx, this.trade);
    }
  }

  dcaNotificationTemplate(twap: TradeTwap, asset: PoolAsset, status: string): TxNotificationMssg {
    const { trade, tradeReps, tradeTime, budget } = twap;
    const tradeHuman = trade.toHuman();
    const timeframe = this._humanizer.humanize(tradeTime, { round: true, largest: 2 });

    const template = html`
      <span>${tradeReps}</span>
      <span>${'trades'}</span>
      <svg xmlns="http://www.w3.org/2000/svg" width="6" height="7" viewBox="0 0 6 7" fill="none">
        <line x1="0.353553" y1="1.16671" x2="5.13786" y2="5.95101" stroke="#878C9E" />
        <line x1="5.22074" y1="1.07743" x2="0.436439" y2="5.86173" stroke="#878C9E" />
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

  processDca(account: Account, transaction: Transaction, twap: TradeTwap, asset: PoolAsset) {
    const notification = {
      processing: this.dcaNotificationTemplate(twap, asset, 'submitted'),
      success: this.dcaNotificationTemplate(twap, asset, 'placed'),
      failure: this.dcaNotificationTemplate(twap, asset, 'failed'),
    };
    const options = {
      bubbles: true,
      composed: true,
      detail: { account: account, transaction: transaction, notification: notification } as TxInfo,
    };
    this.dispatchEvent(new CustomEvent<TxInfo>('gc:tx:scheduleDca', options));
  }

  async dca() {
    const account = this.account.state;
    if (account) {
      const { assetIn } = this.trade;
      const { twap } = this.tradeTwap;
      const assetInMeta = this.assets.meta.get(assetIn.id);
      const totalBudget: BigNumber = toBn(twap.budget.toString(), assetInMeta.decimals);

      const { slippage } = tradeSettingsCursor.deref();
      const { api } = this.chain.state;
      const tx: SubmittableExtrinsic = api.tx.dca.schedule(
        {
          owner: account.address,
          period: TWAP_BLOCK_PERIOD,
          maxRetries: TWAP_RETRIES,
          totalAmount: totalBudget.toFixed(),
          slippage: Number(slippage) * 10000,
          order: twap.order,
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

      this.processDca(account, transaction, twap, assetIn);
    }
  }

  private updateAsset(asset: string, assetKey: string) {
    if (asset) {
      this.trade[assetKey] = this.assets.map.get(asset);
    } else {
      this.trade[assetKey] = null;
    }
  }

  private initAssets() {
    if (!this.assetIn && !this.assetOut) {
      this.trade.assetIn = this.assets.map.get(this.stableCoinAssetId);
      this.trade.assetOut = this.assets.map.get(SYSTEM_ASSET_ID);
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
    this.validatePool();
  }

  protected onBlockChange(): void {
    this.syncBalances();
    this.recalculateTrade();
  }

  protected override async onAccountChange(prev: Account, curr: Account): Promise<void> {
    await super.onAccountChange(prev, curr);
    this.resetBalances();
    this.syncBalances();
    if (curr == null) {
      this.resetTrade();
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
    this.disconnectSubscribeNewHeads?.();
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
      <gc-trade-settings @slippage-changed=${() => this.recalculateTrade()}>
        <div class="header section" slot="header">
          <uigc-icon-button class="back" @click=${() => this.changeTab(TradeTab.TradeForm)}>
            <uigc-icon-back></uigc-icon-back>
          </uigc-icon-button>
          <uigc-typography variant="section">${i18n.t('trade.settings.title')}</uigc-typography>
          <span></span>
        </div>
      </gc-trade-settings>
    </uigc-paper>`;
  }

  selectAssetTab() {
    const classes = {
      tab: true,
      main: true,
      active: this.tab == TradeTab.SelectAsset,
    };
    return html` <uigc-paper class=${classMap(classes)}>
      <gc-select-asset
        .assets=${this.assets.list}
        .pairs=${this.assets.pairs}
        .locations=${this.assets.locations}
        .details=${this.assets.details}
        .balances=${this.assets.balance}
        .usdPrice=${this.assets.usdPrice}
        .assetIn=${this.trade.assetIn?.symbol}
        .assetOut=${this.trade.assetOut?.symbol}
        .switchAllowed=${this.isSwitchEnabled()}
        .selector=${this.asset.selector}
        @asset-clicked=${(e: CustomEvent) => {
          const { id, asset } = this.asset.selector;
          id == 'assetIn' && this.changeAssetIn(asset, e.detail);
          id == 'assetOut' && this.changeAssetOut(asset, e.detail);
          this.updateBalances();
          this.validatePool();
          updateQueryParams({
            assetIn: this.trade.assetIn?.id,
            assetOut: this.trade.assetOut?.id,
          });
          this.changeTab(TradeTab.TradeForm);
        }}
      >
        <div class="header section" slot="header">
          <uigc-icon-button class="back" @click=${() => this.changeTab(TradeTab.TradeForm)}>
            <uigc-icon-back></uigc-icon-back>
          </uigc-icon-button>
          <uigc-typography variant="section">${i18n.t('trade.selectAsset')}</uigc-typography>
          <span></span>
        </div>
      </gc-select-asset>
    </uigc-paper>`;
  }

  tradeFormTab() {
    const classes = {
      tab: true,
      main: true,
      active: this.tab == TradeTab.TradeForm,
    };
    return html` <uigc-paper class=${classMap(classes)} id="default-tab">
      <gc-trade-form
        .assets=${this.assets.map}
        .pairs=${this.assets.pairs}
        .locations=${this.assets.locations}
        .inProgress=${this.trade.inProgress}
        .disabled=${!this.isSwapSelected() || this.isSwapEmpty() || !this.hasAccount() || !this.tx}
        .switchAllowed=${this.isSwitchEnabled()}
        .tradeType=${this.trade.type}
        .twap=${this.tradeTwap.twap}
        .twapAllowed=${!!this.twap}
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
        @asset-input-changed=${({ detail: { id, asset, value } }: CustomEvent) => {
          this.asset.active = asset;
          id == 'assetIn' && this.updateAmountIn(value);
          id == 'assetOut' && this.updateAmountOut(value);
          this.validateEnoughBalance();
        }}
        @asset-max-clicked=${({ detail: { id, asset } }: CustomEvent) => {
          this.asset.active = asset.symbol;
          id == 'assetIn' && this.updateMaxAmountIn(asset);
          id == 'assetOut' && this.updateMaxAmountOut(asset);
        }}
        @asset-selector-clicked=${({ detail }: CustomEvent) => {
          this.asset.selector = detail;
          this.changeTab(TradeTab.SelectAsset);
        }}
        @asset-switch-clicked=${() => {
          this.switch();
          this.validatePool();
          updateQueryParams({
            assetIn: this.trade.assetIn?.id,
            assetOut: this.trade.assetOut?.id,
          });
        }}
        @swap-clicked=${() => this.swap()}
        @twap-clicked=${() => this.dca()}
      >
        <div class="header" slot="header">
          <uigc-typography variant="title" gradient>${i18n.t('trade.title')}</uigc-typography>
          <span class="grow"></span>
          <uigc-icon-button basic class="chart-btn" @click=${() => this.changeTab(TradeTab.TradeChart)}>
            <uigc-icon-chart></uigc-icon-chart>
          </uigc-icon-button>
          <uigc-icon-button basic @click=${() => this.changeTab(TradeTab.TradeSettings)}>
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
            .grafanaUrl=${this.grafanaUrl}
            .grafanaDsn=${this.grafanaDsn}
            .tradeType=${this.trade.type}
            .tradeProgress=${this.trade.inProgress}
            .assetIn=${this.trade.assetIn}
            .assetOut=${this.trade.assetOut}
            .spotPrice=${this.trade.spotPrice}
            .usdPrice=${this.assets.usdPrice}
            .details=${this.assets.details}
          >
            <div class="header section" slot="header">
              <uigc-icon-button class="back" @click=${() => this.changeTab(TradeTab.TradeForm)}>
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

  tradeOrdersSummary() {
    const account = this.account.state;
    if (this.twap) {
      return html`
        <gc-trade-orders
          class="orders"
          .meta=${this.assets.meta}
          .indexerUrl=${this.indexerUrl}
          .grafanaUrl=${this.grafanaUrl}
          .grafanaDsn=${this.grafanaDsn}
          .accountAddress=${account?.address}
          .accountProvider=${account?.provider}
          .accountName=${account?.name}
        >
          <uigc-typography slot="header" variant="title">Your Orders</uigc-typography>
        </gc-trade-orders>
      `;
    }
  }

  render() {
    return html`
      <div class="layout-root">
        ${this.tradeChartTab()} ${this.tradeFormTab()} ${this.tradeSettingsTab()} ${this.selectAssetTab()}
        ${this.tradeOrdersSummary()}
      </div>
    `;
  }
}
