import {
  type Asset,
  type Trade,
  buildRoute,
  BigNumber,
  Transaction,
} from '@galacticcouncil/sdk';
import { SubmittableExtrinsic } from '@polkadot/api/promise/types';

import { TradeApi } from 'api/trade';
import { TradeConfig } from 'db';
import { formatAmount } from 'utils/amount';
import { getTradeMaxAmountIn, getTradeMinAmountOut } from 'utils/slippage';
import { HOUR_MS, SECOND_MS } from 'utils/time';

import { TwapOrder, TwapError } from './types';

const TWAP_BLOCK_PERIOD = 6;
const TWAP_MAX_PRICE_IMPACT = -5;
const TWAP_MAX_DURATION = 6 * HOUR_MS;
const TWAP_TX_MULTIPLIER = 3;

export class TwapApi extends TradeApi<TradeConfig> {
  /**
   * Get TWAP sell execution info & build order tx
   *
   * @param amountInMin - minimum budget to schedule an order, specified in native currency
   * @param assetIn - asset in
   * @param assetOut - asset out
   * @param trade - trade execution info
   * @param txFee - trade transaction fee
   * @param blockTime - avg block time (ms)
   * @returns twap sell order
   */
  async getSellTwap(
    amountInMin: BigNumber,
    assetIn: Asset,
    assetOut: Asset,
    trade: Trade,
    txFee: BigNumber,
    blockTime: number,
  ): Promise<TwapOrder> {
    const { slippageTwap } = this._config.deref();
    const { amountIn } = trade;
    const priceDifference = this.getSellPriceDifference(trade);
    const tradesNumber = this.getOptimizedTradesNo(
      priceDifference.toNumber(),
      blockTime,
    );
    const txFees = this.getFees(tradesNumber, txFee);
    const executionTime = this.getExecutionTime(tradesNumber, blockTime);

    const amountInPerTrade = amountIn.minus(txFees).dividedBy(tradesNumber);
    const bestSell = await this._router.getBestSell(
      assetIn.id,
      assetOut.id,
      formatAmount(amountInPerTrade, assetIn.decimals),
    );

    const amountOutTotal = bestSell.amountOut.multipliedBy(tradesNumber);
    const minAmountOut = getTradeMinAmountOut(bestSell, slippageTwap);
    const minAmountOutTotal = minAmountOut.amount.multipliedBy(tradesNumber);

    const isSingleTrade = tradesNumber === 1;
    const isLessThanMinimalAmount = amountInPerTrade.isLessThan(amountInMin);
    const isOrderImpactTooBig = bestSell.priceImpactPct < TWAP_MAX_PRICE_IMPACT;

    let tradeError: TwapError = null;
    if (isLessThanMinimalAmount || isSingleTrade) {
      tradeError = TwapError.OrderTooSmall;
    } else if (isOrderImpactTooBig) {
      tradeError = TwapError.OrderImpactTooBig;
    }

    const orderTx = (address: string, maxRetries: number): Transaction => {
      const tx: SubmittableExtrinsic = this._api.tx.dca.schedule(
        {
          owner: address,
          period: TWAP_BLOCK_PERIOD,
          maxRetries,
          totalAmount: amountIn.toFixed(),
          slippage: Number(slippageTwap) * 10000,
          order: {
            Sell: {
              assetIn: assetIn.id,
              assetOut: assetOut.id,
              amountIn: bestSell.amountIn.toFixed(),
              minAmountOut: minAmountOut.amount.toFixed(),
              route: buildRoute(bestSell.swaps),
            },
          },
        },
        null,
      );
      return {
        hex: tx.toHex(),
        name: 'dcaSchedule',
        get: (): SubmittableExtrinsic => {
          return tx;
        },
      } as Transaction;
    };

    const estimateFee = (fee: BigNumber) => {
      return this.getFees(tradesNumber, fee);
    };

    const { tradeFee, priceImpactPct } = bestSell;
    const fee = tradeFee.multipliedBy(tradesNumber);
    return {
      amountInPerTrade: bestSell.amountIn,
      amountIn: amountIn,
      amountOut: amountOutTotal,
      minAmountOut: minAmountOutTotal,
      priceImpactPct: priceImpactPct,
      reps: tradesNumber,
      time: executionTime,
      tradeFee: fee,
      error: tradeError,
      estimateFee: estimateFee.bind(this),
      toTx: orderTx,
      toHuman() {
        return {
          amountInPerTrade: formatAmount(bestSell.amountIn, assetIn.decimals),
          amountIn: formatAmount(amountIn, assetIn.decimals),
          amountOut: formatAmount(amountOutTotal, assetOut.decimals),
          minAmountOut: formatAmount(minAmountOutTotal, assetOut.decimals),
          priceImpactPct: priceImpactPct,
          reps: tradesNumber,
          time: executionTime,
          tradeFee: formatAmount(fee, assetOut.decimals),
          error: tradeError,
        };
      },
    } as TwapOrder;
  }

  /**
   * Get TWAP buy execution info & build order tx
   *
   * @param amountInMin - minimum budget to schedule an order, specified in native currency
   * @param assetIn - asset in
   * @param assetOut - asset out
   * @param trade - trade execution info
   * @param txFee - trade transaction fee
   * @param blockTime - avg block time (ms)
   * @returns twap buy order
   */
  async getBuyTwap(
    amountInMin: BigNumber,
    assetIn: Asset,
    assetOut: Asset,
    trade: Trade,
    txFee: BigNumber,
    blockTime: number,
  ): Promise<TwapOrder> {
    const { slippageTwap } = this._config.deref();
    const { amountOut } = trade;

    const priceImpact = Number(trade.priceImpactPct);
    const priceDifference = Math.abs(priceImpact);

    const tradesNumber = this.getOptimizedTradesNo(priceDifference, blockTime);
    const txFees = this.getFees(tradesNumber, txFee);
    const executionTime = this.getExecutionTime(tradesNumber, blockTime);

    const amountOutPerTrade = amountOut.dividedBy(tradesNumber);
    const bestBuy = await this._router.getBestBuy(
      assetIn.id,
      assetOut.id,
      formatAmount(amountOutPerTrade, assetOut.decimals),
    );

    const amountInTotal = bestBuy.amountIn
      .multipliedBy(tradesNumber)
      .plus(txFees);

    const maxAmountIn = getTradeMaxAmountIn(bestBuy, slippageTwap);
    const maxAmountInTotal = maxAmountIn.amount
      .multipliedBy(tradesNumber)
      .plus(txFees);

    const isSingleTrade = tradesNumber === 1;
    const isLessThanMinimalAmount = maxAmountInTotal.isLessThan(amountInMin);
    const isOrderTooBig = priceDifference === 100;

    let tradeError: TwapError = null;
    if (isLessThanMinimalAmount || isSingleTrade) {
      tradeError = TwapError.OrderTooSmall;
    } else if (isOrderTooBig) {
      tradeError = TwapError.OrderTooBig;
    }

    const orderTx = (address: string, maxRetries: number): Transaction => {
      const tx: SubmittableExtrinsic = this._api.tx.dca.schedule(
        {
          owner: address,
          period: TWAP_BLOCK_PERIOD,
          maxRetries,
          totalAmount: maxAmountInTotal.toFixed(),
          slippage: Number(slippageTwap) * 10000,
          order: {
            Buy: {
              assetIn: assetIn.id,
              assetOut: assetOut.id,
              amountOut: bestBuy.amountOut.toString(),
              maxAmountIn: maxAmountIn.amount.toFixed(),
              route: buildRoute(bestBuy.swaps),
            },
          },
        },
        null,
      );
      return {
        hex: tx.toHex(),
        name: 'dcaSchedule',
        get: (): SubmittableExtrinsic => {
          return tx;
        },
      } as Transaction;
    };

    const estimateFee = (txfee: BigNumber) => {
      return this.getFees(tradesNumber, txfee);
    };

    const { tradeFee, priceImpactPct } = bestBuy;
    const fee = tradeFee.multipliedBy(tradesNumber);
    return {
      amountInPerTrade: bestBuy.amountIn,
      amountIn: amountInTotal,
      amountOut: amountOut,
      maxAmountIn: maxAmountInTotal,
      priceImpactPct: priceImpactPct,
      reps: tradesNumber,
      time: executionTime,
      tradeFee: fee,
      error: tradeError,
      estimateFee: estimateFee.bind(this),
      toTx: orderTx,
      toHuman() {
        return {
          amountInPerTrade: formatAmount(bestBuy.amountIn, assetIn.decimals),
          amountIn: formatAmount(amountInTotal, assetIn.decimals),
          amountOut: formatAmount(amountOut, assetOut.decimals),
          maxAmountIn: formatAmount(maxAmountInTotal, assetIn.decimals),
          reps: tradesNumber,
          time: executionTime,
          tradeFee: formatAmount(fee, assetIn.decimals),
          error: tradeError,
        };
      },
    } as TwapOrder;
  }

  /**
   * Calculate optimal no of trades for order execution. We aim to achieve
   * price impact 0.1% per single execution with max execution time 6 hours.
   *
   * @param priceDifference - price difference of swap execution (single trade)
   * @param blockTime - block time in ms
   * @returns optimal no of trades for twap execution
   */
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

  /**
   * Calculate approx. execution time
   *
   * @param tradesNo - number of trades required to execute order
   * @param blockTime - block time in ms
   * @returns unix representation of execution time
   */
  private getExecutionTime(tradesNo: number, blockTime: number): number {
    return tradesNo * TWAP_BLOCK_PERIOD * blockTime;
  }

  /**
   * Calculate approx. tx fees
   *
   * @param tradesNo - number of trades required to execute order
   * @param txFee - trade transaction fee (single trade)
   * @returns twap fees
   */
  private getFees(tradesNo: number, txFee: BigNumber): BigNumber {
    return txFee.multipliedBy(TWAP_TX_MULTIPLIER).multipliedBy(tradesNo);
  }
}
