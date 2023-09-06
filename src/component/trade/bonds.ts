import { html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';
import { classMap } from 'lit/directives/class-map.js';

import * as i18n from 'i18next';

import './form';
import './settings';
import '../chart/lbp';
import '../selector/asset';

import { LbpApp } from './lbp';
import { BondsApi } from '../../api/bonds';
import { TradeTab } from './types';

@customElement('gc-bonds-app')
export class BondsApp extends LbpApp {
  private bondsApi: BondsApi = null;

  @state() bonds = {
    list: [] as string[],
    tradeable: new Map<string, string>([]),
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
    this.bonds.tradeable = await this.bondsApi.getTradeableBonds();
    super.onInit();
  }

  protected async initAssets() {
    if (!this.assetIn && !this.assetOut && this.bonds.list.length > 0) {
      this.bonds.list.forEach((distAssetId: string) => {
        const accuAssetId = this.bonds.tradeable[distAssetId];
        if (accuAssetId) {
          this.updateAsset(accuAssetId, 'assetIn');
          this.updateAsset(distAssetId, 'assetOut');
        }
      });
    } else {
      this.updateAsset(this.assetIn, 'assetIn');
      this.updateAsset(this.assetOut, 'assetOut');
    }
  }

  // tradeChartTab() {
  //   const classes = {
  //     tab: true,
  //     chart: true,
  //     active: this.tab == TradeTab.TradeChart,
  //   };
  //   return html` <uigc-paper class=${classMap(classes)}>
  //     ${when(
  //       this.chart,
  //       () => html`
  //         <gc-lbp-chart
  //           .squidUrl=${this.squidUrl}
  //           .tradeType=${this.trade.type}
  //           .tradeProgress=${this.trade.inProgress}
  //           .poolId=${'7KQy2tEsyJijQHdt2Fqfej9opKjs5MsFMiCK8sUVYfsXQtB8'}
  //           .assetIn=${this.trade.assetIn}
  //           .assetOut=${this.trade.assetOut}
  //           .spotPrice=${this.trade.spotPrice}
  //           .usdPrice=${this.assets.usdPrice}
  //           .details=${this.assets.details}
  //         >
  //           <div class="header section" slot="header">
  //             <uigc-icon-button class="back" @click=${() => this.changeTab(TradeTab.TradeForm)}>
  //               <uigc-icon-back></uigc-icon-back>
  //             </uigc-icon-button>
  //             <uigc-typography variant="section">${i18n.t('chart.title')}</uigc-typography>
  //             <span></span>
  //           </div>
  //         </gc-lbp-chart>
  //       `
  //     )}
  //   </uigc-paper>`;
  // }
}
