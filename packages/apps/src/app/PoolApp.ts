import { property, state } from 'lit/decorators.js';

import { AssetApi } from 'api/asset';
import { PaymentApi } from 'api/payment';
import { TimeApi } from 'api/time';
import { BaseApp } from 'app/BaseApp';
import { createApi } from 'chain';
import { Account, Chain, chainCursor } from 'db';
import { DatabaseController } from 'db.ctrl';
import { multipleAmounts } from 'utils/amount';

import {
  Amount,
  Asset,
  BalanceClient,
  BigNumber,
  SYSTEM_ASSET_DECIMALS,
  SYSTEM_ASSET_ID,
  bnum,
} from '@galacticcouncil/sdk';
import { UnsubscribePromise, VoidFn } from '@polkadot/api/types';

export abstract class PoolApp extends BaseApp {
  protected chain = new DatabaseController<Chain>(this, chainCursor);

  protected disconnectSubscribeNewHeads: () => void = null;
  protected disconnectSubscribeBalance: VoidFn[] = [];

  protected blockNumber: number = null;
  protected blockTime: number = null;

  protected assetApi: AssetApi = null;
  protected balanceClient: BalanceClient = null;
  protected paymentApi: PaymentApi = null;
  protected timeApi: TimeApi = null;

  @property({ type: String }) apiAddress: string = null;
  @property({ type: String }) assetIn: string = null;
  @property({ type: String }) assetOut: string = null;
  @property({ type: String }) stableCoinAssetId: string = null;

  @state() assets = {
    tradeable: [] as Asset[],
    registry: new Map<string, Asset>([]),
    pairs: new Map<string, Asset[]>([]),
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
      createApi(
        this.apiAddress,
        this.ecosystem,
        () => this._init(),
        () => {},
      );
    }
  }

  override update(changedProperties: Map<string, unknown>) {
    super.update(changedProperties);
  }

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

    const tradeable = await router.getAllAssets();
    const [assets, assetsPairs] = await Promise.all([
      this.assetApi.getAssets(),
      this.assetApi.getPairs(tradeable),
    ]);

    this.assets = {
      ...this.assets,
      tradeable: tradeable,
      registry: assets,
      pairs: assetsPairs,
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
    const assets = this.assets.registry;
    const balances = this.assets.balance;
    const subsTokens = [...assets.values()].map((t) => t.id);
    const last = subsTokens[subsTokens.length - 1];
    return this.balanceClient.subscribeTokenBalance(
      account.address,
      subsTokens,
      (token: string, balance: BigNumber) => {
        const asset: Asset = assets.get(token);
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
      this.assets.tradeable,
      this.stableCoinAssetId,
    );
  }

  protected async syncNativePrice() {
    this.assets.nativePrice = await this.assetApi.getPrice(
      this.assets.tradeable,
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
  protected calculateDollarPrice(asset: Asset, amount: string) {
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
  protected calculateAssetPrice(asset: Asset, nativeAmount: string) {
    if (SYSTEM_ASSET_ID == asset.id) {
      return bnum(nativeAmount).shiftedBy(-1 * SYSTEM_ASSET_DECIMALS);
    }
    const assetNativePrice = this.assets.nativePrice.get(asset.id);
    return bnum(nativeAmount).div(assetNativePrice.amount);
  }
}
