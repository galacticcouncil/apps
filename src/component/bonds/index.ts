import { customElement, state } from 'lit/decorators.js';

import { LbpApp } from '../lbp';

@customElement('gc-bonds-app')
export class BondsApp extends LbpApp {
  @state() bonds = [];

  constructor() {
    super();
    this.headerTitle = 'Trade Bonds';
  }

  protected async onInit(): Promise<void> {
    super.onInit();
    this.bonds = await this.lbpApi.getBonds();
  }

  protected async initAssets() {
    this.updateAsset(this.assetIn, 'assetIn');
    this.updateAsset(this.assetOut, 'assetOut');
  }
}
