import { property, state } from 'lit/decorators.js';

import { createApi } from '../../chain';
import { Account, Chain, chainCursor } from '../../db';
import { DatabaseController } from '../../db.ctrl';
import { getAssetsBalance, getAssetsDetail, getAssetsPrice, getAssetsMeta, getAssetsPairs } from '../../api/asset';
import { multipleAmounts } from '../../utils/amount';

import {
  Amount,
  AssetDetail,
  AssetMetadata,
  BigNumber,
  PoolAsset,
  PoolType,
  SYSTEM_ASSET_DECIMALS,
  SYSTEM_ASSET_ID,
  bnum,
} from '@galacticcouncil/sdk';

import { BaseApp } from './BaseApp';
import { getBlockTime } from '../../api/time';

export abstract class PoolApp extends BaseApp {
  protected chain = new DatabaseController<Chain>(this, chainCursor);
  protected disconnectSubscribeNewHeads: () => void = null;

  protected blockNumber: number = null;
  protected blockTime: number = null;

  @state() assets = {
    list: [] as PoolAsset[],
    map: new Map<string, PoolAsset>([]),
    pairs: new Map<string, PoolAsset[]>([]),
    meta: new Map<string, AssetMetadata>([]),
    details: new Map<string, AssetDetail>([]),
    usdPrice: new Map<string, Amount>([]),
    nativePrice: new Map<string, Amount>([]),
    balance: new Map<string, Amount>([]),
  };

  @property({ type: String }) apiAddress: string = null;
  @property({ type: String }) pools: string = null;
  @property({ type: String }) stableCoinAssetId: string = null;

  protected abstract onInit(): void;
  protected abstract onBlockChange(blockNumber: number): void;

  isApiReady(): boolean {
    return !!this.chain.state;
  }

  override async firstUpdated() {
    if (this.isApiReady()) {
      this._init();
    } else {
      const pools = this.pools ? this.pools.split(',') : [];
      createApi(
        this.apiAddress,
        pools as PoolType[],
        () => this._init(),
        () => {}
      );
    }
  }

  override update(changedProperties: Map<string, unknown>) {
    super.update(changedProperties);
  }

  override async updated() {}

  override connectedCallback() {
    super.connectedCallback();
  }

  override disconnectedCallback() {
    this.disconnectSubscribeNewHeads?.();
    super.disconnectedCallback();
  }

  private async _init() {
    await this.init();
    await this.syncPoolBalances();
    await this.subscribe();
    this.onInit();
  }

  private async init() {
    const chain = this.chain.state;
    const assets = await chain.router.getAllAssets();
    const assetsPairs = await getAssetsPairs(assets);
    const assetsDetails = await getAssetsDetail(assets);
    const assetsMeta = await getAssetsMeta(assets);
    this.assets = {
      ...this.assets,
      list: assets,
      map: new Map<string, PoolAsset>(assets.map((i) => [i.id, i])),
      pairs: assetsPairs,
      details: assetsDetails,
      meta: assetsMeta,
    };
    getBlockTime().then((time: number) => {
      this.blockTime = time;
    });
  }

  private async subscribe() {
    const chain = this.chain.state;
    this.disconnectSubscribeNewHeads = await chain.api.rpc.chain.subscribeNewHeads(async (lastHeader) => {
      const blockNumber = lastHeader.number.toNumber();
      console.log('Current block: ' + blockNumber);
      this.blockNumber = blockNumber;
      this.syncPoolBalances();
      this.syncDolarPrice();
      this.syncNativePrice();
      this.onBlockChange(blockNumber);
    });
  }

  protected async onAccountChange(_prev: Account, _curr: Account): Promise<void> {
    this.assets.balance = new Map([]);
    if (this.isApiReady()) {
      await this.syncPoolBalances();
    }
  }

  protected async syncDolarPrice() {
    this.assets.usdPrice = await getAssetsPrice(this.assets.list, this.stableCoinAssetId);
  }

  protected async syncNativePrice() {
    this.assets.nativePrice = await getAssetsPrice(this.assets.list, SYSTEM_ASSET_ID);
  }

  protected async syncPoolBalances() {
    const account = this.account.state;
    if (account) {
      this.assets.balance = await getAssetsBalance(account.address, this.assets.list);
    }
  }

  /**
   * Get pool asset balance in $
   *
   * @param asset - asset entry
   * @param amount - asset amount
   * @returns - balance in $ (stablecoin)
   */
  protected calculateDollarPrice(asset: PoolAsset, amount: string) {
    if (this.stableCoinAssetId == asset.id) {
      return Number(amount).toFixed(2);
    }
    const usdPrice = this.assets.usdPrice.get(asset.id);
    return multipleAmounts(amount, usdPrice).toFixed(2);
  }

  /**
   * Get pool asset balance from native amount
   *
   * @param asset - asset entry
   * @param nativeAmount - asset amount represented by native token value
   * @returns - balance in pool asset
   */
  protected calculateAssetPrice(asset: PoolAsset, nativeAmount: string) {
    if (SYSTEM_ASSET_ID == asset.id) {
      return bnum(nativeAmount).shiftedBy(-1 * SYSTEM_ASSET_DECIMALS);
    }
    const assetNativePrice = this.assets.nativePrice.get(asset.id);
    return new BigNumber(nativeAmount).div(assetNativePrice.amount);
  }
}
