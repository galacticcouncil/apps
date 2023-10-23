import { customElement, state } from 'lit/decorators.js';
import { PoolBase } from '@galacticcouncil/sdk';

import { LbpApi } from '../../api/lbp';

import { LbpApp } from '../lbp';

@customElement('gc-bonds-app')
export class BondsApp extends LbpApp {
  @state() bonds = [];

  constructor() {
    super();
    this.shouldSelectByType = true;
    this.shouldUpdateQuery = false;
    this.headerTitle = 'Trade Bonds';
  }

  protected async onInit(): Promise<void> {
    super.onInit();
    this.bonds = await this.lbpApi.getBonds();
  }

  protected async initAssets() {
    if (!this.assetIn && !this.assetOut) {
      this.bonds.forEach((bondId: string) => {
        const bondPool: PoolBase = this.lbp.pools[bondId];
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
