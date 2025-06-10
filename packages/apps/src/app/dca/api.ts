import {
  type Asset,
  type Trade,
  BigNumber,
  SubstrateTransaction,
  TradeRouteBuilder,
} from '@galacticcouncil/sdk';
import { SubmittableExtrinsic } from '@polkadot/api/promise/types';

import { TradeApi } from 'api/trade';
import { DcaConfig } from 'db';
import { formatAmount } from 'utils/amount';
import { MINUTE_MS } from 'utils/time';

import { DcaOrder } from './types';

const MIN_BLOCK_PERIOD = 5;

export class DcaApi extends TradeApi<DcaConfig> {
  /**
   * Get DCA sell execution info & build order tx
   *
   * @param amountInMin - minimum budget to schedule an order, specified in native currency
   * @param assetIn - asset in
   * @param assetOut - asset out
   * @param trade - trade execution info
   * @param period - order execution period (ms)
   * @param blockTime - avg block time (ms)
   * @param frequency - interval between the trades in minutes specified by user
   * @returns dca order
   */
  async getSellOrder(
    amountInMin: BigNumber,
    assetIn: Asset,
    assetOut: Asset,
    trade: Trade,
    period: number,
    blockTime: number,
    frequency?: number,
  ): Promise<DcaOrder> {
    const { slippage } = this._config.deref();
    const { amountIn, swaps } = trade;
    const priceDifference = Math.abs(trade.priceImpactPct);

    const periodMinutes = period / MINUTE_MS;
    const minTradesNo = this.getMinimumTradesNo(amountIn, amountInMin);
    const optTradesNo = this.getOptimizedTradesNo(priceDifference);
    const tradeNo = frequency
      ? Math.round(periodMinutes / frequency)
      : optTradesNo;

    const minFreq = Math.ceil(periodMinutes / minTradesNo);
    const optFreq = Math.round(periodMinutes / optTradesNo);
    const freq = Math.round(periodMinutes / tradeNo);

    const amountInPerTrade = amountIn.dividedBy(tradeNo).decimalPlaces(0, 1);

    const orderTx = (
      address: string,
      maxRetries: number,
    ): SubstrateTransaction => {
      const f = freq * MINUTE_MS;
      const blockPeriod = this.toBlockPeriod(f, blockTime);
      const tx: SubmittableExtrinsic = this._api.tx.dca.schedule(
        {
          owner: address,
          period: Math.max(blockPeriod, MIN_BLOCK_PERIOD),
          maxRetries,
          totalAmount: amountIn.toFixed(),
          slippage: Number(slippage) * 10000,
          order: {
            Sell: {
              assetIn: assetIn.id,
              assetOut: assetOut.id,
              amountIn: amountInPerTrade.toFixed(),
              minAmountOut: '0',
              route: TradeRouteBuilder.build(swaps),
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
      } as SubstrateTransaction;
    };

    return {
      amountIn: amountInPerTrade,
      amountInBudget: amountIn,
      frequencyMin: minFreq,
      frequencyOpt: optFreq,
      frequency: freq,
      tradesNo: tradeNo,
      toTx: orderTx,
      toHuman() {
        return {
          amountIn: formatAmount(amountInPerTrade, assetIn.decimals),
          amountInBudget: formatAmount(amountIn, assetIn.decimals),
          frequency: freq,
          frequencyMin: minFreq,
          frequencyOpt: optFreq,
          tradesNo: tradeNo,
        };
      },
    } as DcaOrder;
  }

  /**
   * Calculate minimal no of trades for order execution. Single trade
   * execution amount must be at least 20% of minimal budget
   *
   * @param amountIn - user budget
   * @param amountInMin - minimum budget to schedule an order
   * @returns minimal no of trades
   */
  private getMinimumTradesNo(
    amountIn: BigNumber,
    amountInMin: BigNumber,
  ): number {
    const minAmountIn = amountInMin.multipliedBy(0.2);
    const res = amountIn.dividedBy(minAmountIn).toNumber();
    return Math.round(res);
  }
}
