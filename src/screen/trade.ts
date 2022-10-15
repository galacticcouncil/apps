import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { choose } from 'lit/directives/choose.js';

import { baseStyles } from '../base.css';

import { DatabaseController } from '../db.ctrl';
import { apiCursor, Api, readyCursor } from '../db';

import '../component/paper';

import './trade/select-token';
import './trade/settings';
import './trade/trade-tokens';
import './trade/trade-tokens';

import { BigNumber, bnum, PoolAsset, TradeType } from '@galacticcouncil/sdk';
import { SubmittableExtrinsic } from '@polkadot/api/promise/types';

enum TradeScreen {
  Settings,
  SelectToken,
  TradeTokens,
}

const SYSTEM_ASSET_ID = '0';

@customElement('app-trade')
export class Trade extends LitElement {
  private db = new DatabaseController<Api>(this, apiCursor);

  @state() screen = {
    active: TradeScreen.TradeTokens,
    detail: null,
  };

  @state() assets = {
    active: null,
    list: [],
    map: {},
  };

  @state() tradeRaw = null;
  @state() trade = {
    calculating: false,
    type: TradeType.Sell,
    afterSlippage: '0',
    transactionFee: '-',
    assetIn: null,
    amountIn: null,
    amountInUsd: '0',
    assetOut: null,
    amountOut: null,
    amountOutUsd: '0',
    spotPrice: '0',
    swaps: [],
  };

  static styles = [
    baseStyles,
    css`
      :host {
        display: block;
        max-width: 520px;
        margin-left: auto;
        margin-right: auto;
        position: relative;
      }

      ui-paper {
        max-height: 650px;
        width: 100%;
        display: block;
      }
    `,
  ];

  changeScreen(active: TradeScreen, detail: any) {
    this.screen = { active: active, detail: detail };
  }

  setProgress() {
    this.trade = {
      ...this.trade,
      calculating: true,
    };
  }

  async calculateSpotPrice(assetInId: string, assetOutId: string) {
    const spotPrice = await this.db.state.router.getBestSpotPrice(assetInId, assetOutId);
    return spotPrice.amount.shiftedBy(-1 * spotPrice.decimals).toString();
  }

  calculateSlippage(amount: BigNumber) {
    const slippagePct = window.localStorage.getItem('trade.settings.slippage');
    const slippage = amount.div(bnum('100')).multipliedBy(slippagePct);
    return slippage.decimalPlaces(0, 1);
  }

  async calculateBestSell(assetIn: PoolAsset, assetOut: PoolAsset, amountIn: string) {
    const bestSell = await this.db.state.router.getBestSell(assetIn.id, assetOut.id, amountIn);
    const bestSellHuman = bestSell.toHuman();
    const assetOutDecimals = bestSell.swaps[bestSell.swaps.length - 1].assetOutDecimals;

    const slippage = this.calculateSlippage(bestSell.amountOut);
    const minAmountOut = bestSell.amountOut.minus(slippage);
    const minAmountOutHuman = minAmountOut.shiftedBy(-1 * assetOutDecimals).toString();

    const transaction = bestSell.toTx(minAmountOut);
    const transactionExtrinsic = transaction.get<SubmittableExtrinsic>();
    const { partialFee } = await transactionExtrinsic.paymentInfo('bXn8P59QmseUpCWTw4rf46bBL1VFP48qmvKSoUJefVMTKR9Jp');

    this.trade = {
      ...this.trade,
      calculating: false,
      afterSlippage: minAmountOutHuman,
      transactionFee: partialFee.toHuman(),
      assetIn: assetIn,
      assetOut: assetOut,
      ...bestSellHuman,
    };
    this.tradeRaw = bestSell;
    this.assets.active = assetIn.symbol;
    console.log(bestSellHuman);
  }

  async calculateBestBuy(assetIn: PoolAsset, assetOut: PoolAsset, amountOut: string) {
    const bestBuy = await this.db.state.router.getBestBuy(assetIn.id, assetOut.id, amountOut);
    const bestBuyHuman = bestBuy.toHuman();
    const assetInDecimals = bestBuy.swaps[0].assetInDecimals;

    const slippage = this.calculateSlippage(bestBuy.amountIn);
    const maxAmountIn = bestBuy.amountIn.plus(slippage);
    const maxAmountInHuman = maxAmountIn.shiftedBy(-1 * assetInDecimals).toString();

    const transaction = bestBuy.toTx(maxAmountIn);
    const transactionExtrinsic = transaction.get<SubmittableExtrinsic>();
    const { partialFee } = await transactionExtrinsic.paymentInfo('bXn8P59QmseUpCWTw4rf46bBL1VFP48qmvKSoUJefVMTKR9Jp');

    this.trade = {
      ...this.trade,
      calculating: false,
      afterSlippage: maxAmountInHuman,
      transactionFee: partialFee.toHuman(),
      assetIn: assetIn,
      assetOut: assetOut,
      ...bestBuyHuman,
    };
    this.tradeRaw = bestBuy;
    this.assets.active = assetOut.symbol;
    console.log(bestBuyHuman);
  }

  switchAndReCalculateSell() {
    this.trade = {
      ...this.trade,
      calculating: true,
      assetIn: this.trade.assetOut,
      assetOut: this.trade.assetIn,
      amountIn: this.trade.amountOut,
      amountOut: null,
    };
    this.calculateBestSell(this.trade.assetIn, this.trade.assetOut, this.trade.amountIn);
  }

  switchAndReCalculateBuy() {
    this.trade = {
      ...this.trade,
      calculating: true,
      assetIn: this.trade.assetOut,
      assetOut: this.trade.assetIn,
      amountIn: null,
      amountOut: this.trade.amountIn,
    };
    this.calculateBestBuy(this.trade.assetIn, this.trade.assetOut, this.trade.amountOut);
  }

  switchAssets() {
    if (this.trade.assetOut.symbol == this.assets.active) {
      this.switchAndReCalculateSell();
    } else if (this.trade.assetIn.symbol == this.assets.active) {
      this.switchAndReCalculateBuy();
    }
  }

  changeAssetIn(changeDetail: any, asset: any) {
    if (changeDetail.id == 'assetIn') {
      const assetIn = asset;
      const assetOut = this.trade.assetOut;

      if (changeDetail.asset == this.assets.active) {
        this.trade = {
          ...this.trade,
          calculating: true,
          assetIn: asset,
          amountOut: null,
        };
        this.calculateBestSell(assetIn, assetOut, this.trade.amountIn);
      } else {
        this.trade = {
          ...this.trade,
          calculating: true,
          assetIn: asset,
          amountIn: null,
        };
        this.calculateBestBuy(assetIn, assetOut, this.trade.amountOut);
      }
    }
  }

  changeAssetOut(changeDetail: any, asset: any) {
    if (changeDetail.id == 'assetOut') {
      const assetIn = this.trade.assetIn;
      const assetOut = asset;

      if (changeDetail.asset == this.assets.active) {
        this.trade = {
          ...this.trade,
          calculating: true,
          assetOut: asset,
          amountIn: null,
        };
        this.calculateBestBuy(assetIn, assetOut, this.trade.amountOut);
      } else {
        this.trade = {
          ...this.trade,
          calculating: true,
          assetOut: asset,
          amountOut: null,
        };
        this.calculateBestSell(assetIn, assetOut, this.trade.amountIn);
      }
    }
  }

  updateAmountIn(updateDetail: any) {
    if (updateDetail.id == 'assetIn') {
      this.trade = {
        ...this.trade,
        calculating: true,
        amountOut: null,
      };
      this.calculateBestSell(this.trade.assetIn, this.trade.assetOut, updateDetail.value);
    }
  }

  updateAmountOut(updateDetail: any) {
    if (updateDetail.id == 'assetOut') {
      this.trade = {
        ...this.trade,
        calculating: true,
        amountIn: null,
      };
      this.calculateBestBuy(this.trade.assetIn, this.trade.assetOut, updateDetail.value);
    }
  }

  async updated() {
    if (this.db.state && !readyCursor.deref()) {
      console.log('Initialization...');
      const assets = await this.db.state.router.getAllAssets();
      const systemAsset = assets.filter((a: PoolAsset) => a.id == SYSTEM_ASSET_ID)[0];
      const systemAssetPairs = await this.db.state.router.getAssetPairs(SYSTEM_ASSET_ID);

      const assetIn = systemAsset;
      const assetOut = systemAssetPairs[0];
      const spotPrice = await this.calculateSpotPrice(assetIn.id, assetOut.id);

      this.trade = {
        ...this.trade,
        assetIn: assetIn,
        assetOut: assetOut,
        spotPrice: spotPrice,
      };

      const assetMap = new Map<string, string>(assets.map((i) => [i.id, i.symbol]));
      this.assets = {
        ...this.assets,
        list: assets,
        map: assetMap,
      };
      readyCursor.reset(true);
    }
  }

  settingsTenplate() {
    return html`<app-settings
      @back-clicked=${(e: CustomEvent) => this.changeScreen(TradeScreen.TradeTokens, e.detail)}
    ></app-settings>`;
  }

  selectTokenTenplate(detail: any) {
    return html`<app-select-token
      .assets=${this.assets.list}
      @back-clicked=${(e: CustomEvent) => this.changeScreen(TradeScreen.TradeTokens, e.detail)}
      @asset-clicked=${(e: CustomEvent) => {
        this.changeAssetIn(detail, e.detail);
        this.changeAssetOut(detail, e.detail);
        this.changeScreen(TradeScreen.TradeTokens, null);
      }}
    ></app-select-token>`;
  }

  tradeTokensTenplate() {
    return html`<app-trade-tokens
      .assets=${this.assets.map}
      .assetIn=${this.trade.assetIn?.symbol}
      .amountIn=${this.trade.amountIn}
      .assetOut=${this.trade.assetOut?.symbol}
      .amountOut=${this.trade.amountOut}
      .spotPrice=${this.trade.spotPrice}
      .tradeType=${this.trade.type}
      .afterSlippage=${this.trade.afterSlippage}
      .transactionFee=${this.trade.transactionFee}
      .swaps=${this.trade.swaps}
      .calculating=${this.trade.calculating}
      @asset-input-changed=${(e: CustomEvent) => {
        this.updateAmountIn(e.detail);
        this.updateAmountOut(e.detail);
      }}
      @asset-selector-clicked=${(e: CustomEvent) => {
        this.changeScreen(TradeScreen.SelectToken, e.detail);
      }}
      @asset-switch-clicked=${this.switchAssets}
      @settings-clicked=${(e: CustomEvent) => this.changeScreen(TradeScreen.Settings, e.detail)}
    ></app-trade-tokens>`;
  }

  render() {
    return html`
      <ui-paper>
        ${choose(
          this.screen.active,
          [
            [TradeScreen.Settings, () => this.settingsTenplate()],
            [TradeScreen.SelectToken, () => this.selectTokenTenplate(this.screen.detail)],
          ],
          () => this.tradeTokensTenplate()
        )}
      </ui-paper>
    `;
  }
}
