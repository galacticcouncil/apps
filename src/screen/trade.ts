import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { choose } from 'lit/directives/choose.js';

import { baseStyles } from '../base.css';

import { DatabaseController } from '../db.ctrl';
import { Api, apiCursor, readyCursor, settingsCursor, accountCursor } from '../db';

import { formatAmount } from '../utils/amount';
import { pairsById, assetsById } from '../utils/assets';
import { SYSTEM_ASSET_ID } from '../utils/chain';
import { getMinAmountOut, getMaxAmountIn } from '../utils/slippage';
import { getTransactionFee } from '../utils/transaction';

import '../component/Paper';

import './trade/select-token';
import './trade/settings';
import './trade/trade-tokens';
import './trade/trade-tokens';

import { PoolAsset, TradeType } from '@galacticcouncil/sdk';

import { getWalletBySource } from '@talismn/connect-wallets';

enum TradeScreen {
  Settings,
  SelectToken,
  TradeTokens,
}

type ScreenState = {
  active: TradeScreen;
  detail: any;
};

type AssetsState = {
  active: String;
  list: PoolAsset[];
  map: Map<string, PoolAsset>;
  pairs: Map<string, PoolAsset[]>;
};

type TradeState = {
  calculating: boolean;
  type: TradeType;
  afterSlippage: string;
  transactionFee: string;
  assetIn: PoolAsset;
  amountIn: string;
  amountInUsd: string;
  assetOut: PoolAsset;
  amountOut: string;
  amountOutUsd: string;
  spotPrice: string;
  swaps: [];
};

@customElement('app-trade')
export class Trade extends LitElement {
  private api = new DatabaseController<Api>(this, apiCursor);

  @state() screen: ScreenState = {
    active: TradeScreen.TradeTokens,
    detail: null,
  };

  @state() assets: AssetsState = {
    active: null,
    list: [],
    map: new Map([]),
    pairs: new Map([]),
  };

  @state() trade: TradeState = {
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
    spotPrice: null,
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

  isSwapSelected(): boolean {
    return this.trade.assetIn != null && this.trade.assetOut != null;
  }

  isSwapEmpty(): boolean {
    return this.trade.amountIn == null && this.trade.amountOut == null;
  }

  isEmptyAmount(amount: string): boolean {
    return amount == '' || amount == '0';
  }

  async calculateBestSell(assetIn: PoolAsset, assetOut: PoolAsset, amountIn: string) {
    const bestSell = await apiCursor.deref().router.getBestSell(assetIn.id, assetOut.id, amountIn);
    const bestSellHuman = bestSell.toHuman();
    const slippage = settingsCursor.deref().slippage;
    const minAmountOut = getMinAmountOut(bestSell, slippage);
    const minAmountOutHuman = formatAmount(minAmountOut.amount, minAmountOut.decimals);
    const transaction = bestSell.toTx(minAmountOut.amount);

    const account = accountCursor.deref();
    let transactionFee = '-';
    if (account) {
      transactionFee = await getTransactionFee(transaction, account.address);
    }

    // const wallet = getWalletBySource('polkadot-js');
    // await wallet.enable('blabla');
    // console.log(wallet);
    // console.log(await wallet.getAccounts());

    // console.log('Spevak:');
    // console.log(wallet.signer);

    this.trade = {
      ...this.trade,
      calculating: false,
      assetIn: assetIn,
      assetOut: assetOut,
      afterSlippage: minAmountOutHuman,
      transactionFee: transactionFee,
      ...bestSellHuman,
    };
    console.log(bestSellHuman);
  }

  async calculateBestBuy(assetIn: PoolAsset, assetOut: PoolAsset, amountOut: string) {
    const bestBuy = await apiCursor.deref().router.getBestBuy(assetIn.id, assetOut.id, amountOut);
    const bestBuyHuman = bestBuy.toHuman();
    const slippage = settingsCursor.deref().slippage;
    const maxAmountIn = getMaxAmountIn(bestBuy, slippage);
    const maxAmountInHuman = formatAmount(maxAmountIn.amount, maxAmountIn.decimals);

    const transaction = bestBuy.toTx(maxAmountIn.amount);

    const account = accountCursor.deref();
    let transactionFee = '-';
    if (account) {
      transactionFee = await getTransactionFee(transaction, account.address);
    }

    this.trade = {
      ...this.trade,
      calculating: false,
      assetIn: assetIn,
      assetOut: assetOut,
      afterSlippage: maxAmountInHuman,
      transactionFee: transactionFee,
      ...bestBuyHuman,
    };
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
    if (!this.isSwapSelected() || this.isSwapEmpty()) {
      this.trade = {
        ...this.trade,
        assetIn: this.trade.assetOut,
        assetOut: this.trade.assetIn,
        amountIn: this.trade.amountOut,
        amountOut: this.trade.amountIn,
      };
    } else if (this.trade.assetOut.symbol == this.assets.active) {
      this.switchAndReCalculateSell();
    } else if (this.trade.assetIn.symbol == this.assets.active) {
      this.switchAndReCalculateBuy();
    }
  }

  changeAssetIn(changeDetail: any, asset: any) {
    if (changeDetail.id == 'assetIn') {
      const assetIn = asset;
      const assetOut = this.trade.assetOut;

      // Change asset without recalculation if amount not set or pair not specified
      if (assetOut == null || this.isSwapEmpty()) {
        this.trade = {
          ...this.trade,
          assetIn: asset,
        };
        return;
      }

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

      // Change asset without recalculation if amount not set or pair not specified
      if (assetIn == null || this.isSwapEmpty()) {
        this.trade = {
          ...this.trade,
          assetOut: asset,
        };
        return;
      }

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
      // Wipe the trade on input clear
      if (this.isEmptyAmount(updateDetail.value)) {
        this.trade = {
          ...this.trade,
          amountOut: null,
          spotPrice: null,
          swaps: [],
        };
        return;
      }

      if (this.isSwapSelected()) {
        this.trade = {
          ...this.trade,
          calculating: true,
          amountOut: null,
        };
        this.calculateBestSell(this.trade.assetIn, this.trade.assetOut, updateDetail.value);
      } else {
        this.trade.amountIn = updateDetail.value;
      }
    }
  }

  updateAmountOut(updateDetail: any) {
    if (updateDetail.id == 'assetOut') {
      // Wipe the trade on input clear
      if (this.isEmptyAmount(updateDetail.value)) {
        this.trade = {
          ...this.trade,
          amountIn: null,
          spotPrice: null,
          swaps: [],
        };
        return;
      }

      if (this.isSwapSelected()) {
        this.trade = {
          ...this.trade,
          calculating: true,
          amountIn: null,
        };
        this.calculateBestBuy(this.trade.assetIn, this.trade.assetOut, updateDetail.value);
      } else {
        this.trade.amountOut = updateDetail.value;
      }
    }
  }

  syncTrade() {
    if (!this.isSwapSelected() || this.isSwapEmpty()) {
      return;
    } else if (this.trade.assetIn.symbol == this.assets.active) {
      this.calculateBestSell(this.trade.assetIn, this.trade.assetOut, this.trade.amountIn);
    } else if (this.trade.assetOut.symbol == this.assets.active) {
      this.calculateBestBuy(this.trade.assetIn, this.trade.assetOut, this.trade.amountOut);
    }
  }

  async init() {
    const router = apiCursor.deref().router;
    const assets = await router.getAllAssets();
    const pairs: [string, PoolAsset[]][] = await Promise.all(
      assets.map(async (asset: PoolAsset) => [asset.id, await router.getAssetPairs(asset.id)])
    );

    this.assets = {
      ...this.assets,
      list: assets,
      map: assetsById(assets),
      pairs: pairsById(pairs),
    };

    this.trade.assetIn = this.assets.map.get(SYSTEM_ASSET_ID);
    readyCursor.reset(true);
  }

  async subscribe() {
    const api = apiCursor.deref().promise;
    await api.rpc.chain.subscribeNewHeads((lastHeader) => {
      console.log('Current block: ' + lastHeader.number.toString());
      // this.syncTrade();
    });
  }

  async updated() {
    if (this.api.state && !readyCursor.deref()) {
      console.log('Initialization...');
      await this.init();
      await this.subscribe();
      console.log('Done ✅');
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
      .pairs=${this.assets.pairs}
      .assetIn=${this.trade.assetIn?.symbol}
      .assetOut=${this.trade.assetOut?.symbol}
      .change=${detail}
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
        this.assets.active = e.detail.asset;
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
        ${choose(this.screen.active, [
          [TradeScreen.TradeTokens, () => this.tradeTokensTenplate()],
          [TradeScreen.Settings, () => this.settingsTenplate()],
          [TradeScreen.SelectToken, () => this.selectTokenTenplate(this.screen.detail)],
        ])}
      </ui-paper>
    `;
  }
}
