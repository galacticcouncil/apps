import {
  type Asset,
  type Trade,
  buildRoute,
  Transaction,
} from '@galacticcouncil/sdk';
import { SubmittableExtrinsic } from '@polkadot/api/promise/types';

import { TradeApi } from 'api/trade';
import { DcaConfig } from 'db';
import { formatAmount, toBn } from 'utils/amount';
import { DAY_MS } from 'utils/time';

import { DcaYieldOrder } from './types';

const MIN_TRADE_SIZE = 0.33;
const MAX_TRADE_SIZE = 10;

export class DcaYieldApi extends TradeApi<DcaConfig> {
  /**
   * Get DCA Yield execution info & build order tx
   *
   * @param amountIn - yield from (user input)
   * @param assetIn - asset in
   * @param assetOut - asset out
   * @param apy - annual percentage yield
   * @param apyDenominator - annual percentage yield denominator
   * @param period - order execution period (ms)
   * @param blockTime - avg block time (ms)
   * @returns yield dca order
   */
  async getYieldOrder(
    amountIn: string,
    assetIn: Asset,
    assetOut: Asset,
    apy: number,
    apyDenominator: number,
    period: number,
    blockTime: number,
  ): Promise<DcaYieldOrder> {
    const { slippage } = this._config.deref();

    const apyMultiplier = 1 + apy / 100;
    const investment = Number(amountIn);
    const futureValue = investment * apyMultiplier;
    const gain = futureValue - investment;

    const amountInYield = gain / apyDenominator;
    const amountInYieldBN = toBn(amountInYield, assetIn.decimals);

    const budget = Number(amountInYield);

    let noOfTrades = Math.round(period / DAY_MS) || 1;
    let tradeSize = budget / noOfTrades;

    if (tradeSize < MIN_TRADE_SIZE) {
      noOfTrades = Math.floor(budget / MIN_TRADE_SIZE);
      tradeSize = budget / noOfTrades;
    }

    if (tradeSize > MAX_TRADE_SIZE) {
      noOfTrades = Math.round(budget / MAX_TRADE_SIZE);
      tradeSize = budget / noOfTrades;
    }

    const amountInPerTrade = tradeSize.toFixed(4);
    const amountInPerTradeBN = toBn(amountInPerTrade, assetIn.decimals);

    const orderTx = (
      address: string,
      maxRetries: number,
      trade: Trade,
    ): Transaction => {
      const tx: SubmittableExtrinsic = this._api.tx.dca.schedule(
        {
          owner: address,
          period: this.toBlockPeriod(period, blockTime),
          maxRetries,
          totalAmount: amountInYieldBN.toFixed(),
          slippage: Number(slippage) * 10000,
          order: {
            Sell: {
              assetIn: assetIn.id,
              assetOut: assetOut.id,
              amountIn: amountInPerTradeBN.toFixed(),
              minLimit: '0',
              route: buildRoute(trade.swaps),
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

    return {
      amountIn: amountInPerTradeBN,
      amountInYield: amountInYieldBN,
      tradesNo: noOfTrades,
      toTx: orderTx,
      toHuman() {
        return {
          amountIn: formatAmount(amountInPerTradeBN, assetIn.decimals),
          amountInYield: formatAmount(amountInYieldBN, assetIn.decimals),
          tradesNo: noOfTrades,
        };
      },
    } as DcaYieldOrder;
  }
}
