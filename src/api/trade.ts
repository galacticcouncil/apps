import {
  type PoolToken,
  type Transaction,
  type Trade,
  calculateDiffToRef,
  bnum,
  BigNumber,
  TradeRouter,
  buildRoute,
} from '@galacticcouncil/sdk';
import type { PalletDcaOrder } from '@polkadot/types/lookup';

import { tradeSettingsCursor } from '../db';
import { formatAmount, multipleAmounts } from '../utils/amount';
import { getTradeMaxAmountIn, getTradeMinAmountOut } from '../utils/slippage';

import { HOUR_MS } from './time';

export const TWAP_BLOCK_PERIOD = 5;
export const TWAP_MAX_PRICE_IMPACT = -5;
export const TWAP_RETRIES = 1;

const TWAP_MAX_DURATION = 3 * HOUR_MS;
const TWAP_TX_MULTIPLIER = 3;

export type TradeInfo = {
  trade: Trade;
  transaction: Transaction;
  slippage: string;
};

export type TradeTwap = {
  trade: Trade;
  tradeReps: number;
  tradeTime: number;
  tradeError: TradeTwapError;
  budget: number;
  amountIn: number;
  amountInUsd: string;
  amountOut: number;
  amountOutUsd: string;
  orderSlippage: number;
  orderSlippageUsd: string;
  order: PalletDcaOrder;
};

export enum TradeTwapError {
  OrderTooSmall = 'OrderTooSmall',
  OrderTooBig = 'OrderTooBig',
  OrderImpactTooBig = 'OrderImpactTooBig',
}

export class TradeApi {
  private _router: TradeRouter;

  public constructor(router: TradeRouter) {
    this._router = router;
  }

  async getSell(
    assetIn: PoolToken,
    assetOut: PoolToken,
    amountIn: string,
    slippage: string,
  ): Promise<TradeInfo> {
    const bestSell = await this._router.getBestSell(
      assetIn.id,
      assetOut.id,
      amountIn,
    );
    const minAmountOut = getTradeMinAmountOut(bestSell, slippage);
    const minAmountOutHuman = formatAmount(
      minAmountOut.amount,
      minAmountOut.decimals,
    );
    const transaction = bestSell.toTx(minAmountOut.amount);

    return {
      trade: bestSell,
      transaction: transaction,
      slippage: minAmountOutHuman,
    } as TradeInfo;
  }

  async getBuy(
    assetIn: PoolToken,
    assetOut: PoolToken,
    amountOut: string,
    slippage: string,
  ): Promise<TradeInfo> {
    const bestBuy = await this._router.getBestBuy(
      assetIn.id,
      assetOut.id,
      amountOut,
    );
    const maxAmountIn = getTradeMaxAmountIn(bestBuy, slippage);
    const maxAmountInHuman = formatAmount(
      maxAmountIn.amount,
      maxAmountIn.decimals,
    );
    const transaction = bestBuy.toTx(maxAmountIn.amount);

    return {
      trade: bestBuy,
      transaction: transaction,
      slippage: maxAmountInHuman,
    } as TradeInfo;
  }

  getSellPriceDifference(
    amountIn: number,
    spotPrice: number,
    swaps: [],
  ): BigNumber {
    const lastSwap = swaps[swaps.length - 1];
    const calculatedOut = lastSwap['calculatedOut'];
    const calculatedOutBN = bnum(calculatedOut);
    const swapAmount = amountIn * spotPrice;
    const swapAmountBN = bnum(swapAmount);
    return calculateDiffToRef(swapAmountBN, calculatedOutBN);
  }

  async getSellTwap(
    assetIn: PoolToken,
    assetOut: PoolToken,
    amountIn: number,
    amountMin: number,
    txFee: number,
    priceDifference: number,
    blockTime: number,
  ): Promise<TradeTwap> {
    const tradesNo = this.getOptimizedTradesNo(priceDifference, blockTime);
    const tradeTime = this.getTwapExecutionTime(tradesNo, blockTime);
    const twapTxFees = TradeApi.getTwapTxFee(tradesNo, txFee);
    const amountInPerTrade = (amountIn - twapTxFees) / tradesNo;
    const bestSell = await this._router.getBestSell(
      assetIn.id,
      assetOut.id,
      amountInPerTrade.toString(),
    );
    const bestSellHuman = bestSell.toHuman();
    const bestSellRoute = buildRoute(bestSell.swaps);

    const amountOutTotal = Number(bestSellHuman.amountOut) * tradesNo;

    const minAmountOut = getTradeMinAmountOut(
      bestSell,
      tradeSettingsCursor.deref().slippage,
    );
    const minAmountOutTotal = multipleAmounts(
      tradesNo.toString(),
      minAmountOut,
    );

    const isSingleTrade = tradesNo == 1;
    const isLessThanMinimalAmount = amountInPerTrade < amountMin;
    const isOrderImpactTooBig = bestSell.priceImpactPct < TWAP_MAX_PRICE_IMPACT;

    let tradeError: TradeTwapError = null;
    if (isLessThanMinimalAmount || isSingleTrade) {
      tradeError = TradeTwapError.OrderTooSmall;
    } else if (isOrderImpactTooBig) {
      tradeError = TradeTwapError.OrderImpactTooBig;
    }

    return {
      trade: bestSell,
      tradeReps: tradesNo,
      tradeTime: tradeTime,
      tradeError: tradeError,
      budget: amountIn,
      amountIn: amountIn,
      amountOut: amountOutTotal,
      orderSlippage: minAmountOutTotal,
      order: {
        Sell: {
          assetIn: assetIn.id,
          assetOut: assetOut.id,
          amountIn: bestSell.amountIn.toString(),
          minAmountOut: minAmountOut.amount.toFixed(),
          route: bestSellRoute,
        },
      } as unknown as PalletDcaOrder,
    } as TradeTwap;
  }

  async getBuyTwap(
    assetIn: PoolToken,
    assetOut: PoolToken,
    amountOut: number,
    amountMin: number,
    txFee: number,
    priceDifference: number,
    blockTime: number,
  ): Promise<TradeTwap> {
    const tradesNo = this.getOptimizedTradesNo(priceDifference, blockTime);
    const tradeTime = this.getTwapExecutionTime(tradesNo, blockTime);
    const twapTxFees = TradeApi.getTwapTxFee(tradesNo, txFee);
    const amountOutPerTrade = amountOut / tradesNo;
    const bestBuy = await this._router.getBestBuy(
      assetIn.id,
      assetOut.id,
      amountOutPerTrade.toString(),
    );
    const bestBuyHuman = bestBuy.toHuman();
    const bestBuyRoute = buildRoute(bestBuy.swaps);

    const amountInTotal = Number(bestBuyHuman.amountIn) * tradesNo + twapTxFees;

    const maxAmountIn = getTradeMaxAmountIn(
      bestBuy,
      tradeSettingsCursor.deref().slippage,
    );
    const maxAmountInTotal =
      multipleAmounts(tradesNo.toString(), maxAmountIn) + twapTxFees;

    const isSingleTrade = tradesNo == 1;
    const isLessThanMinimalAmount = maxAmountInTotal < amountMin;
    const isOrderTooBig = priceDifference == 100;

    let tradeError: TradeTwapError = null;
    if (isLessThanMinimalAmount || isSingleTrade) {
      tradeError = TradeTwapError.OrderTooSmall;
    } else if (isOrderTooBig) {
      tradeError = TradeTwapError.OrderTooBig;
    }

    return {
      trade: bestBuy,
      tradeReps: tradesNo,
      tradeTime: tradeTime,
      tradeError: tradeError,
      budget: maxAmountInTotal,
      amountIn: amountInTotal,
      amountOut: amountOut,
      orderSlippage: maxAmountInTotal,
      order: {
        Buy: {
          assetIn: assetIn.id,
          assetOut: assetOut.id,
          amountOut: bestBuy.amountOut.toString(),
          maxAmountIn: maxAmountIn.amount.toFixed(),
          route: bestBuyRoute,
        },
      } as unknown as PalletDcaOrder,
    } as TradeTwap;
  }

  private getOptimizedTradesNo(
    priceDifference: number,
    blockTime: number,
  ): number {
    const noOfTrades = Math.round(priceDifference * 10) || 1;
    const executionTime = noOfTrades * TWAP_BLOCK_PERIOD * blockTime;

    if (executionTime > TWAP_MAX_DURATION) {
      const maxNoOfTrades = TWAP_MAX_DURATION / (blockTime * TWAP_BLOCK_PERIOD);
      return Math.round(maxNoOfTrades);
    }
    return noOfTrades;
  }

  private getTwapExecutionTime(tradesNo: number, blockTime: number): number {
    return tradesNo * TWAP_BLOCK_PERIOD * blockTime;
  }

  static getTwapTxFee(tradesNo: number, txFee: number): number {
    const twapTxFee = txFee * TWAP_TX_MULTIPLIER;
    const twapTxFeeWithRetries = twapTxFee * (TWAP_RETRIES + 1);
    return twapTxFeeWithRetries * tradesNo;
  }
}
