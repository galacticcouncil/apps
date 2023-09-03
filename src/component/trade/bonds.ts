import { customElement } from 'lit/decorators.js';

import './form';
import './settings';
import '../chart';
import '../selector/asset';

import { LbpApp } from './lbp';

@customElement('gc-bonds-app')
export class BondsApp extends LbpApp {
  constructor() {
    super();
    this.shouldSelectByType = true;
    this.shouldUpdateQuery = false;
    this.headerTitle = 'Trade Bonds';
  }

  protected initAssets() {
    if (!this.assetIn && !this.assetOut) {
      this.trade.assetIn = this.assets.map.get(this.stableCoinAssetId);
      this.trade.assetOut = this.assets.map.get('1000018');
    } else {
      super.initAssets();
    }
  }
}
