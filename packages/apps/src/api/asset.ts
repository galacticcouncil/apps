import {
  Amount,
  Asset,
  AssetClient,
  BalanceClient,
  BigNumber,
  TradeRouter,
} from '@galacticcouncil/sdk';
import { ApiPromise } from '@polkadot/api';

import { pairs2Map } from 'utils/mapper';

export class AssetApi {
  private _api: ApiPromise;
  private _router: TradeRouter;
  private _assetClient: AssetClient;
  private _balanceClient: BalanceClient;

  public constructor(api: ApiPromise, router: TradeRouter) {
    this._api = api;
    this._router = router;
    this._assetClient = new AssetClient(api);
    this._balanceClient = new BalanceClient(api);
  }

  async getAssets(): Promise<Map<string, Asset>> {
    const assets = await this._assetClient.getOnChainAssets();
    return new Map(assets.map((a) => [a.id, a]));
  }

  async getBalance(
    address: string,
    assets: Asset[],
  ): Promise<Map<string, BigNumber>> {
    const ids = assets.map(({ id }) => id);
    return this.getBalanceById(address, ids);
  }

  async getBalanceById(
    address: string,
    ids: string[],
  ): Promise<Map<string, BigNumber>> {
    const balances: [string, BigNumber][] = await Promise.all(
      ids.map(async (id: string) => [
        id,
        await this._balanceClient.getBalance(address, id),
      ]),
    );
    return pairs2Map(balances);
  }

  async getPrice(
    assets: Asset[],
    stableCoinAssetId: string,
  ): Promise<Map<string, Amount>> {
    const prices: [string, Amount][] = await Promise.all(
      assets.map(async (asset: Asset) => [
        asset.id,
        await this._router.getBestSpotPrice(asset.id, stableCoinAssetId),
      ]),
    );
    return pairs2Map(prices);
  }

  async getPairs(assets: Asset[]): Promise<Map<string, Asset[]>> {
    const pairs: [string, Asset[]][] = await Promise.all(
      assets.map(async (asset: Asset) => [
        asset.id,
        await this._router.getAssetPairs(asset.id),
      ]),
    );
    return pairs2Map(pairs);
  }
}