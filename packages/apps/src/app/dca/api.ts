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

export class DcaApi {
  private _api: ApiPromise;
  private _router: TradeRouter;

  public constructor(api: ApiPromise, router: TradeRouter) {
    this._api = api;
    this._router = router;
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
}
