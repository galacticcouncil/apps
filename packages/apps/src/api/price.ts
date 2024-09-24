import { Amount, Asset, ONE, scale, TradeRouter } from '@galacticcouncil/sdk';
import { ApiPromise } from '@polkadot/api';

import { LRUCache } from '@thi.ng/cache';

export class PriceApi {
  private _api: ApiPromise;
  private _router: TradeRouter;
  private _cache: LRUCache<string, Amount>;

  private disconnectSubscribeNewHeads: (() => void) | null = null;

  public constructor(api: ApiPromise, router: TradeRouter) {
    this._api = api;
    this._router = router;

    this._cache = new LRUCache<string, Amount>(null);
    this._api.rpc.chain
      .subscribeNewHeads(async (_lastHeader) => {
        this._cache.release();
      })
      .then((subsFn) => {
        this.disconnectSubscribeNewHeads = subsFn;
      });
  }

  async getPrice(
    assetIn: Asset,
    assetOut: Asset,
    rate?: string,
  ): Promise<Amount> {
    if (assetIn.id === assetOut.id) {
      return {
        amount: scale(ONE, assetIn.decimals),
        decimals: assetIn.decimals,
      };
    }

    const key = [assetIn.id, assetOut.id].join('-');
    const hasKey = this._cache.has(key);
    if (hasKey) {
      return this._cache.get(key);
    }

    const price = await this._router.getBestSpotPrice(assetIn.id, assetOut.id);
    if (price && rate) {
      const withRate = { ...price, amount: price.amount.times(rate) };
      this._cache.set(key, withRate);
      return withRate;
    }

    this._cache.set(key, price);
    return price;
  }

  async destroy(): Promise<void> {
    console.log(`Destroying price cache! \nItems: [${this._cache.length}]`);
    this._cache.release();
    this.disconnectSubscribeNewHeads?.();
  }
}
