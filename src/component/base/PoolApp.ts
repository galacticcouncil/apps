import { property, state } from 'lit/decorators.js';

import { AssetApi } from '../../api/asset';
import { PaymentApi } from '../../api/payment';
import { TimeApi } from '../../api/time';
import { createApi } from '../../chain';
import { Account, Chain, Ecosystem, chainCursor } from '../../db';
import { DatabaseController } from '../../db.ctrl';
import { multipleAmounts } from '../../utils/amount';

import {
  Amount,
  AssetMetadata,
  BalanceClient,
  BigNumber,
  PoolToken,
  PoolType,
  SYSTEM_ASSET_DECIMALS,
  SYSTEM_ASSET_ID,
  bnum,
} from '@galacticcouncil/sdk';
import { UnsubscribePromise, VoidFn } from '@polkadot/api/types';

import { BaseApp } from './BaseApp';

export abstract class PoolApp extends BaseApp {
  protected chain = new DatabaseController<Chain>(this, chainCursor);

  protected disconnectSubscribeNewHeads: () => void = null;
  protected disconnectSubscribeBalance: VoidFn[] = [];

  protected blockNumber: number = null;
  protected blockTime: number = null;

  protected assetApi: AssetApi = null;
  protected paymentApi: PaymentApi = null;
  protected timeApi: TimeApi = null;
  protected balanceClient: BalanceClient = null;

  @property({ type: String }) assetIn: string = null;
  @property({ type: String }) assetOut: string = null;
  @property({ type: String }) apiAddress: string = null;
  @property({ type: String }) pools: string = null;
  @property({ type: String }) stableCoinAssetId: string = null;
  @property({ type: String }) ecosystem: Ecosystem = null;

  @state() assets = {
    list: [] as PoolToken[],
    map: new Map<string, PoolToken>([]),
    pairs: new Map<string, PoolToken[]>([]),
    meta: new Map<string, AssetMetadata>([]),
    locations: new Map<string, number>([]),
    usdPrice: new Map<string, Amount>([]),
    nativePrice: new Map<string, Amount>([]),
    balance: new Map<string, Amount>([]),
  };

  protected abstract onInit(): void;
  protected abstract onBlockChange(blockNumber: number): void;
  protected abstract onBalanceUpdate(): void;

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
        this.ecosystem,
        pools as PoolType[],
        () => this._init(),
        () => {},
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
    if (this.disconnectSubscribeBalance.length > 0) {
      const account = this.account.state;
      this.unsubscribeBalance(account);
    }
    super.disconnectedCallback();
  }

  private async _init() {
    await this.init();
    await this.subscribe();
    this.subscribeBalance();
  }

  private async init() {
    const { router, api } = this.chain.state;
    this.assetApi = new AssetApi(api, router);
    this.paymentApi = new PaymentApi(api, router);
    this.timeApi = new TimeApi(api);
    this.balanceClient = new BalanceClient(api);

    const assets = await router.getAllAssets();
    const [assetsMeta, assetsPairs, assetsLocations] = await Promise.all([
      this.assetApi.getMetadata(),
      this.assetApi.getPairs(assets),
      this.assetApi.getLocations(assets),
    ]);

    this.assets = {
      ...this.assets,
      list: assets,
      map: new Map<string, PoolToken>(assets.map((i) => [i.id, i])),
      meta: assetsMeta,
      pairs: assetsPairs,
      locations: assetsLocations,
    };
    this.timeApi.getBlockTime().then((time: number) => {
      this.blockTime = time;
    });
    this.onInit();
  }

  private async subscribe() {
    const { api } = this.chain.state;
    this.disconnectSubscribeNewHeads = await api.rpc.chain.subscribeNewHeads(
      async (lastHeader) => {
        const blockNumber = lastHeader.number.toNumber();
        console.log('Current block: ' + blockNumber);
        this.blockNumber = blockNumber;
        this.syncDolarPrice();
        this.syncNativePrice();
        this.onBlockChange(blockNumber);
      },
    );
  }

  protected async subscribeBalance() {
    const account = this.account.state;
    if (account) {
      this.disconnectSubscribeBalance = [
        await this.subscribeTokensAccountBalance(),
        await this.subscribeSystemAccountBalance(),
      ];
      const addrAbrev = this.getShortened(account.address);
      console.log(`Account [${addrAbrev}] balance subscribed`);
    }
  }

  protected unsubscribeBalance(account: Account) {
    this.disconnectSubscribeBalance.forEach((unsub) => {
      unsub();
    });
    if (account) {
      const addrAbrev = this.getShortened(account.address);
      console.log(`Account [${addrAbrev}] balance unsubscribed`);
    }
  }

  private subscribeTokensAccountBalance(): UnsubscribePromise {
    const account = this.account.state;
    const meta = this.assets.meta;
    const balances = this.assets.balance;
    const subsTokens = [...meta.values()].map((t) => t.id);
    const last = subsTokens[subsTokens.length - 1];
    return this.balanceClient.subscribeTokenBalance(
      account.address,
      subsTokens,
      (token: string, balance: BigNumber) => {
        const asset: AssetMetadata = meta.get(token);
        const newBalance: Amount = {
          amount: balance,
          decimals: asset.decimals,
        } as Amount;
        balances.set(token, newBalance);
        if (last === token) {
          this.assets.balance = new Map(balances);
          this.onBalanceUpdate();
        }
      },
    );
  }

  private subscribeSystemAccountBalance(): UnsubscribePromise {
    const account = this.account.state;
    const balances = this.assets.balance;
    return this.balanceClient.subscribeSystemBalance(
      account.address,
      (token: string, balance: BigNumber) => {
        const newBalance: Amount = {
          amount: balance,
          decimals: SYSTEM_ASSET_DECIMALS,
        } as Amount;
        balances.set(token, newBalance);
        this.assets.balance = new Map(balances);
        this.onBalanceUpdate();
      },
    );
  }

  protected async onAccountChange(
    prev: Account,
    _curr: Account,
  ): Promise<void> {
    this.assets.balance = new Map([]);
    if (this.isApiReady()) {
      this.unsubscribeBalance(prev);
      this.subscribeBalance();
    }
  }

  protected async syncDolarPrice() {
    this.assets.usdPrice = await this.assetApi.getPrice(
      this.assets.list,
      this.stableCoinAssetId,
    );
  }

  protected async syncNativePrice() {
    this.assets.nativePrice = await this.assetApi.getPrice(
      this.assets.list,
      SYSTEM_ASSET_ID,
    );
  }

  /**
   * Get pool asset balance in $
   *
   * @param asset - asset entry
   * @param amount - asset amount
   * @returns - asset amount represented by $ (stablecoin)
   */
  protected calculateDollarPrice(asset: PoolToken, amount: string) {
    if (this.stableCoinAssetId == asset.id) {
      return Number(amount).toFixed(2);
    }
    const usdPrice = this.assets.usdPrice.get(asset.id);
    return multipleAmounts(amount, usdPrice).toFixed(2);
  }

  /**
   * Calculate asset balance from native amount
   *
   * @param asset - asset entry
   * @param nativeAmount - asset amount represented by native token value
   * @returns - asset amount represented by token value
   */
  protected calculateAssetPrice(asset: PoolToken, nativeAmount: string) {
    if (SYSTEM_ASSET_ID == asset.id) {
      return bnum(nativeAmount).shiftedBy(-1 * SYSTEM_ASSET_DECIMALS);
    }
    const assetNativePrice = this.assets.nativePrice.get(asset.id);
    return new BigNumber(nativeAmount).div(assetNativePrice.amount);
  }
}
