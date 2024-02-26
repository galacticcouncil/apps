import {
  type Asset,
  type Trade,
  buildRoute,
  BigNumber,
  Transaction,
} from '@galacticcouncil/sdk';
import { SubmittableExtrinsic } from '@polkadot/api/promise/types';

import { TradeApi } from 'api/trade';
import { DcaConfig } from 'db';
import { formatAmount } from 'utils/amount';

import { Dca } from './types';
import { MINUTE_MS } from 'utils/time';

export class DcaApi extends TradeApi<DcaConfig> {
  /**
   * Get DCA sell execution info & build order tx
   *
   * @param amountInMin - Minimum budget to be able to schedule an order, specified in native currency
   * @param assetIn - Asset In
   * @param assetOut - Asset Out
   * @param trade - Swap execution info
   * @param blockTime - Block time in ms
   * @returns
   */
  async getSellOrder(
    amountInMin: BigNumber,
    assetIn: Asset,
    assetOut: Asset,
    trade: Trade,
    period: number,
    blockTime: number,
    frequency?: number,
  ): Promise<Dca> {
    const { slippage } = this._config.deref();
    const { amountIn, swaps } = trade;
    const priceDifference = this.getSellPriceDifference(trade).toNumber();

    const periodMinutes = period / MINUTE_MS;
    const minTradesNo = this.getMinimumTradesNo(amountIn, amountInMin);
    const optTradesNo = this.getOptimizedTradesNo(priceDifference);
    const tradeNo = frequency
      ? Math.round(periodMinutes / frequency)
      : optTradesNo;
    console.log(frequency);
    console.log(optTradesNo);

    const minFreq = Math.ceil(periodMinutes / minTradesNo);
    const optFreq = Math.round(periodMinutes / optTradesNo);
    const freq = Math.round(periodMinutes / tradeNo);

    const amountInPerTrade = amountIn.dividedBy(tradeNo);

    const orderTx = (address: string, maxRetries: number): Transaction => {
      const tx: SubmittableExtrinsic = this._api.tx.dca.schedule(
        {
          owner: address,
          period: this.toBlockPeriod(period, blockTime),
          maxRetries,
          totalAmount: amountIn.toFixed(),
          slippage: Number(slippage) * 10000,
          order: {
            Sell: {
              assetIn: assetIn.id,
              assetOut: assetOut.id,
              amountIn: amountInPerTrade.toFixed(),
              minAmountOut: '0',
              route: buildRoute(swaps),
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
    } as Dca;
  }

  /**
   * Calculate optimal no of trades for TWAP execution. We aim to achieve
   * price impact 0.1% per single execution.
   *
   * @param priceDifference - price difference of swap execution (single trade)
   * @returns optimal no of trades for dca execution
   */
  private getOptimizedTradesNo(priceDifference: number): number {
    const optTradesNo = Math.round(priceDifference * 10) || 1;
    return optTradesNo === 1 ? 2 : optTradesNo;
  }

  /**
   * Calculate optimal no of trades for TWAP execution. We aim to achieve
   * price impact 0.1% per single execution.
   *
   * @param amountIn - Total budget
   * @param amountInMin - Minimum budget to be able to schedule an order
   * @returns optimal no of trades for dca execution
   */
  private getMinimumTradesNo(
    amountIn: BigNumber,
    amountInMin: BigNumber,
  ): number {
    const minAmountIn = amountInMin.multipliedBy(0.2); // 20% from budget
    const res = amountIn.dividedBy(minAmountIn).toNumber();
    return Math.round(res);
  }
}
