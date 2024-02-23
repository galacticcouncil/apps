import {
  type Asset,
  type Trade,
  buildRoute,
  calculateDiffToRef,
  BigNumber,
  SellSwap,
  TradeRouter,
  Transaction,
} from '@galacticcouncil/sdk';
import { ApiPromise } from '@polkadot/api';
import { SubmittableExtrinsic } from '@polkadot/api/promise/types';
import { Cursor } from '@thi.ng/atom';

import { TradeConfig } from 'db';
import { formatAmount } from 'utils/amount';
import { getTradeMaxAmountIn, getTradeMinAmountOut } from 'utils/slippage';
import { HOUR_MS } from 'utils/time';

import { Twap, TwapError } from './types';

export const TWAP_BLOCK_PERIOD = 6;
export const TWAP_MAX_PRICE_IMPACT = -5;

const TWAP_MAX_DURATION = 6 * HOUR_MS;
const TWAP_TX_MULTIPLIER = 3;

export class TwapApi {
  private _api: ApiPromise;
  private _router: TradeRouter;
  private _config: Cursor<TradeConfig>;

  public constructor(
    api: ApiPromise,
    router: TradeRouter,
    config: Cursor<TradeConfig>,
  ) {
    this._api = api;
    this._router = router;
    this._config = config;
  }

  getSellPriceDifference(trade: Trade): BigNumber {
    const { amountIn, spotPrice, swaps } = trade;
    const fistSwap = swaps[0] as SellSwap;
    const lastSwap = swaps[swaps.length - 1] as SellSwap;
    const calculatedOut = lastSwap.calculatedOut;

    const swapAmount = amountIn
      .shiftedBy(-1 * fistSwap.assetInDecimals)
      .multipliedBy(spotPrice);
    return calculateDiffToRef(swapAmount, calculatedOut);
  }

  async getSellTwap(
    amountInMin: BigNumber,
    assetIn: Asset,
    assetOut: Asset,
    trade: Trade,
    txFee: BigNumber,
    blockTime: number,
  ): Promise<Twap> {
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

      console.log(tx.toHuman());

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
    } as Twap;
  }

  async getBuyTwap(
    amountInMin: BigNumber,
    assetIn: Asset,
    assetOut: Asset,
    trade: Trade,
    txFee: BigNumber,
    blockTime: number,
  ): Promise<Twap> {
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

      console.log(tx.toHuman());

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
          amountIn: formatAmount(amountInTotal, assetIn.decimals),
          amountOut: formatAmount(amountOut, assetOut.decimals),
          maxAmountIn: formatAmount(maxAmountInTotal, assetIn.decimals),
          reps: tradesNumber,
          time: executionTime,
          tradeFee: formatAmount(fee, assetIn.decimals),
          error: tradeError,
        };
      },
    } as Twap;
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

  private getExecutionTime(tradesNo: number, blockTime: number): number {
    return tradesNo * TWAP_BLOCK_PERIOD * blockTime;
  }

  private getFees(tradesNo: number, txFee: BigNumber): BigNumber {
    return txFee.multipliedBy(TWAP_TX_MULTIPLIER).multipliedBy(tradesNo);
  }
}
