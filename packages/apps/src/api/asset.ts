import {
  Amount,
  Asset,
  BalanceClient,
  BigNumber,
  TradeRouter,
  ZERO,
} from '@galacticcouncil/sdk';
import { ApiPromise } from '@polkadot/api';
import { formatAmount } from 'utils/amount';

import { pairs2Map } from 'utils/mapper';

export class AssetApi {
  private _api: ApiPromise;
  private _router: TradeRouter;
  private _balanceClient: BalanceClient;

  public constructor(api: ApiPromise, router: TradeRouter) {
    this._api = api;
    this._router = router;
    this._balanceClient = new BalanceClient(api);
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
    balance: Map<string, Amount>,
    stableCoinAssetId: string,
    stableCoinRate?: string,
  ): Promise<Map<string, Amount>> {
    const prices: [string, Amount][] = await Promise.all(
      assets.map(async (asset: Asset) => {
        const assetBalance = balance.get(asset.id);
        if (assetBalance && assetBalance.amount > ZERO) {
          const price = await this._router.getBestSpotPrice(
            asset.id,
            stableCoinAssetId,
          );

          if (stableCoinRate && price) {
            return [
              asset.id,
              { ...price, amount: price.amount?.times(stableCoinRate) },
            ];
          }

          return [asset.id, price];
        } else {
          return [
            asset.id,
            {
              amount: ZERO,
              decimals: asset.decimals,
            },
          ];
        }
      }),
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
