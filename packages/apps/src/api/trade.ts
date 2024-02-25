import {
  type Trade,
  calculateDiffToRef,
  BigNumber,
  SellSwap,
  TradeRouter,
} from '@galacticcouncil/sdk';
import { ApiPromise } from '@polkadot/api';
import { Cursor } from '@thi.ng/atom';

export class TradeApi<T> {
  protected _api: ApiPromise;
  protected _router: TradeRouter;
  protected _config: Cursor<T>;

  public constructor(api: ApiPromise, router: TradeRouter, config: Cursor<T>) {
    this._api = api;
    this._router = router;
    this._config = config;
  }

  /**
   * Calculate difference between a final value (spot) and a reference
   * value in relation to the reference value (out)
   *
   * @param trade - swap info (single trade)
   * @returns Percentage difference between spot and calculated
   */
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

  /**
   * Convert unix execution period to block period
   *
   * @param periodMsec
   * @param blockTime
   * @returns
   */
  toBlockPeriod(periodMsec: number, blockTime: number): number {
    const noOfBlocks = periodMsec / blockTime;
    return Math.floor(noOfBlocks);
  }
}
