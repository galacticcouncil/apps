import {
  Amount,
  Asset,
  AssetClient,
  BalanceClient,
  BigNumber,
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

  async getMetadata(): Promise<Map<string, Asset>> {
    const metadata = await this._assetClient.getOnChainMetadata();
    return new Map(metadata.map((m) => [m.id, m]));
  }

  async getLocations(assets: Asset[]): Promise<Map<string, number>> {
    const locations: [string, number][] = await Promise.all(
      assets.map(async (asset: Asset) => [
        asset.id,
        await this.getParachainId(asset.id),
      ]),
    );
    return pairs2Map(locations);
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

  private async getParachainId(assetId: string): Promise<number> {
    const locations = await this._api.query.assetRegistry.assetLocations(
      assetId,
    );
    const data = locations.unwrapOr(null);

    if (!data) {
      return null;
    }

    const type = data.interior.type;
    if (type == 'Here') {
      return null;
    }

    const interior = data.interior[`as${type}`];
    return !Array.isArray(interior)
      ? interior.asParachain.unwrap().toNumber()
      : interior
          .find((el) => el.isParachain)
          .asParachain.unwrap()
          .toNumber();
  }
}
