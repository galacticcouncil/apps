import { TradeRouter, TradeUtils } from '@galacticcouncil/sdk';
import { ApiPromise } from '@polkadot/api';
import { Cursor } from '@thi.ng/atom';

export class TradeApi<T> {
  protected _api: ApiPromise;
  protected _router: TradeRouter;
  protected _txUtils: TradeUtils;
  protected _config: Cursor<T>;

  public constructor(api: ApiPromise, router: TradeRouter, config: Cursor<T>) {
    this._api = api;
    this._router = router;
    this._config = config;
    this._txUtils = new TradeUtils(api);
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
    return Math.round(noOfBlocks);
  }

  /**
   * Calculate optimal no of trades for order execution. We aim to achieve
   * price impact 0.1% per single execution with at least 3 trades.
   *
   * @param priceDifference - price difference of swap execution (single trade)
   * @returns optimal no of trades
   */
  getOptimizedTradesNo(priceDifference: number): number {
    const optTradesNo = Math.round(priceDifference * 10) || 1;
    return optTradesNo < 3 ? 3 : optTradesNo;
  }
}
