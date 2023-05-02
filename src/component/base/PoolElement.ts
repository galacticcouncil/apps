import { property, state } from 'lit/decorators.js';

import { createApi } from '../../chain';
import { Account, Chain, chainCursor } from '../../db';
import { DatabaseController } from '../../db.ctrl';
import { AssetDetail, getAssetsBalance, getAssetsDetail, getAssetsDollarPrice, getAssetsPairs } from '../../api/asset';
import { multipleAmounts } from '../../utils/amount';

import { Amount, PoolAsset, PoolType } from '@galacticcouncil/sdk';

import { AccountElement } from './AccountElement';

export abstract class PoolElement extends AccountElement {
  protected chain = new DatabaseController<Chain>(this, chainCursor);
  protected disconnectSubscribeNewHeads: () => void = null;

  @state() assets = {
    list: [] as PoolAsset[],
    map: new Map<string, PoolAsset>([]),
    pairs: new Map<string, PoolAsset[]>([]),
    details: new Map<string, AssetDetail>([]),
    usdPrice: new Map<string, Amount>([]),
    balance: new Map<string, Amount>([]),
  };

  @property({ type: String }) apiAddress: string = null;
  @property({ type: String }) pools: string = null;
  @property({ type: String }) stableCoinAssetId: string = null;

  protected abstract onInit(): void;
  protected abstract onBlockChange(): void;

  override async firstUpdated() {
    const pools = this.pools ? this.pools.split(',') : [];
    const chain = this.chain.state;
    if (chain) {
      this.oninit();
    } else {
      createApi(this.apiAddress, pools as PoolType[], () => {
        this.oninit();
      });
    }
  }

  override update(changedProperties: Map<string, unknown>) {
    super.update(changedProperties);
  }

  override async updated() {
    //console.log(this.assets);
  }

  override connectedCallback() {
    super.connectedCallback();
  }

  override disconnectedCallback() {
    this.disconnectSubscribeNewHeads?.();
    super.disconnectedCallback();
  }

  private async oninit() {
    await this.init();
    await this.subscribe();
  }

  private async init() {
    const router = this.chain.state.router;
    const assets = await router.getAllAssets();
    const assetsPairs = await getAssetsPairs(assets);
    const assetsDetails = await getAssetsDetail(assets);
    this.assets = {
      ...this.assets,
      list: assets,
      map: new Map<string, PoolAsset>(assets.map((i) => [i.id, i])),
      pairs: assetsPairs,
      details: assetsDetails,
    };
    this.onInit();
  }

  private async subscribe() {
    const api = this.chain.state.api;
    this.disconnectSubscribeNewHeads = await api.rpc.chain.subscribeNewHeads(async (lastHeader) => {
      console.log('Current block: ' + lastHeader.number.toString());
      this.syncPoolBalances();
      this.syncDolarPrice();
      this.onBlockChange();
    });
  }

  protected async onAccountChange(_prev: Account, _curr: Account): Promise<void> {
    this.assets.balance = new Map([]);
    await this.syncPoolBalances();
  }

  protected async syncDolarPrice() {
    this.assets.usdPrice = await getAssetsDollarPrice(this.assets.list, this.stableCoinAssetId);
  }

  protected async syncPoolBalances() {
    const account = this.account.state;
    if (account) {
      this.assets.balance = await getAssetsBalance(account.address, this.assets.list);
    }
  }

  protected calculateDollarPrice(asset: PoolAsset, amount: string) {
    if (this.stableCoinAssetId == asset.id) {
      return Number(amount).toFixed(2);
    }
    const usdPrice = this.assets.usdPrice.get(asset.id);
    return multipleAmounts(amount, usdPrice).toFixed(2);
  }
}
