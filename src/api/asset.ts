import {
  Amount,
  AssetClient,
  AssetDetail,
  AssetMetadata,
  BalanceClient,
  PoolAsset,
  TradeRouter,
} from '@galacticcouncil/sdk';
import { ApiPromise } from '@polkadot/api';

import { pairs2Map } from '../utils/mapper';

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

  async getMetadata(assets: PoolAsset[]): Promise<Map<string, AssetMetadata>> {
    const details: [string, AssetMetadata][] = await Promise.all(
      assets.map(async (asset: PoolAsset) => [asset.id, await this._assetClient.getAssetMetadata(asset.id)])
    );
    return pairs2Map(details);
  }

  async getLocations(assets: PoolAsset[]): Promise<Map<string, number>> {
    const locations: [string, number][] = await Promise.all(
      assets.map(async (asset: PoolAsset) => [asset.id, await this.getParachainId(asset.id)])
    );
    return pairs2Map(locations);
  }

  async getDetails(assets: PoolAsset[]): Promise<Map<string, AssetDetail>> {
    const details: [string, AssetDetail][] = await Promise.all(
      assets.map(async (asset: PoolAsset) => [asset.id, await this._assetClient.getAssetDetail(asset.id)])
    );
    return pairs2Map(details);
  }

  async getBalance(address: string, assets: PoolAsset[]): Promise<Map<string, Amount>> {
    const balances: [string, Amount][] = await Promise.all(
      assets.map(async (asset: PoolAsset) => [asset.id, await this._balanceClient.getAccountBalance(address, asset.id)])
    );
    return pairs2Map(balances);
  }

  async getPrice(assets: PoolAsset[], stableCoinAssetId: string): Promise<Map<string, Amount>> {
    const prices: [string, Amount][] = await Promise.all(
      assets.map(async (asset: PoolAsset) => [
        asset.id,
        await this._router.getBestSpotPrice(asset.id, stableCoinAssetId),
      ])
    );
    return pairs2Map(prices);
  }

  async getPairs(assets: PoolAsset[]): Promise<Map<string, PoolAsset[]>> {
    const pairs: [string, PoolAsset[]][] = await Promise.all(
      assets.map(async (asset: PoolAsset) => [asset.id, await this._router.getAssetPairs(asset.id)])
    );
    return pairs2Map(pairs);
  }

  private async getParachainId(assetId: string): Promise<number> {
    const locations = await this._api.query.assetRegistry.assetLocations(assetId);
    const data = locations.unwrapOr(null);
    if (data) {
      const type = data.interior.type;
      const interior = data.interior[`as${type}`];
      return interior[0] ? interior[0].asParachain.toNumber() : null;
    }
    return null;
  }
}
