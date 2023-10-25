import { PoolBase, PoolType, TradeRouter } from '@galacticcouncil/sdk';
import { ApiPromise } from '@polkadot/api';

export class LbpApi {
  private _api: ApiPromise;
  private _router: TradeRouter;

  public constructor(api: ApiPromise, router: TradeRouter) {
    this._api = api;
    this._router = router;
  }

  async getBonds(): Promise<string[]> {
    const bondKeys = await this._api.query.bonds.bonds.keys();
    return bondKeys.map(({ args: [id] }) => id.toString());
  }

  async getPools(): Promise<PoolBase[]> {
    const pools = await this._router.getPools();
    return pools.filter((pool: PoolBase) => pool.type == PoolType.LBP);
  }
}
