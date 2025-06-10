import { PoolBase, PoolType, SdkCtx } from '@galacticcouncil/sdk';
import { ApiPromise } from '@polkadot/api';

export class BondsApi {
  private _api: ApiPromise;
  private _sdk: SdkCtx;

  public constructor(api: ApiPromise, sdk: SdkCtx) {
    this._api = api;
    this._sdk = sdk;
  }

  async getBonds(): Promise<string[]> {
    const bondKeys = await this._api.query.bonds.bonds.keys();
    return bondKeys.map(({ args: [id] }) => id.toString());
  }

  async getPools(): Promise<PoolBase[]> {
    const pools = await this._sdk.api.router.getPools();
    return pools.filter((pool: PoolBase) => pool.type == PoolType.LBP);
  }
}
