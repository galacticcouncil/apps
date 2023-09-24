import { customElement, state } from 'lit/decorators.js';
import { PoolBase } from '@galacticcouncil/sdk';

import { BondsApi } from '../../api/bonds';

import { LbpApp } from '../lbp';

@customElement('gc-bonds-app')
export class BondsApp extends LbpApp {
  private bondsApi: BondsApi = null;

  @state() bonds = {
    poolId: undefined,
    list: [] as string[],
    pools: new Map<string, PoolBase>([]),
  };

  constructor() {
    super();
    this.shouldSelectByType = true;
    this.shouldUpdateQuery = true;
    this.headerTitle = 'Trade Bonds';
  }

  protected async onInit(): Promise<void> {
    const { api } = this.chain.state;
    this.bondsApi = new BondsApi(api, this.router);
    this.bonds.list = await this.bondsApi.getBonds();
    this.bonds.pools = await this.bondsApi.getPools();
    super.onInit();
  }

  protected async initAssets() {
    if (!this.assetIn && !this.assetOut) {
      this.bonds.list.forEach((bondId: string) => {
        const bondPool: PoolBase = this.bonds.pools[bondId];
        if (bondPool) {
          const [accumulated, distributed] = bondPool.tokens;
          this.updateAsset(accumulated.id, 'assetIn');
          this.updateAsset(distributed.id, 'assetOut');
        }
      });
    } else {
      this.updateAsset(this.assetIn, 'assetIn');
      this.updateAsset(this.assetOut, 'assetOut');
    }
  }
}
