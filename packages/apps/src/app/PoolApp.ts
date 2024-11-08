import { property, state } from 'lit/decorators.js';

import { AssetApi } from 'api/asset';
import { PaymentApi } from 'api/payment';
import { PriceApi } from 'api/price';
import { TimeApi } from 'api/time';
import { BaseApp } from 'app/BaseApp';

import { createApi } from 'chain';
import { Account, Chain, ChainCursor, DatabaseController } from 'db';
import { SECOND_MS } from 'utils/time';

import {
  Amount,
  Asset,
  BalanceClient,
  BigNumber,
  SYSTEM_ASSET_ID,
  ZERO,
} from '@galacticcouncil/sdk';
import { UnsubscribePromise } from '@polkadot/api/types';

export abstract class PoolApp extends BaseApp {
  protected chain = new DatabaseController<Chain>(this, ChainCursor);

  protected disconnectSubscribeNewHeads: () => void = null;
  protected disconnectSubscribeBalance: () => void = null;

  protected blockNumber: number = null;
  protected blockTime: number = 12 * SECOND_MS;

  protected assetApi: AssetApi = null;
  protected balanceClient: BalanceClient = null;
  protected paymentApi: PaymentApi = null;
  protected priceApi: PriceApi = null;
  protected timeApi: TimeApi = null;

  @property({ type: String }) apiAddress: string = null;
  @property({ type: String }) assetIn: string = null;
  @property({ type: String }) assetOut: string = null;
  @property({ type: String }) stableCoinAssetId: string = null;
  @property({ type: String }) stableCoinRate: string = null;

  @state() assets = {
    tradeable: [] as Asset[],
    registry: new Map<string, Asset>([]),
    usdPrice: new Map<string, Amount>([]),
    balance: new Map<string, Amount>([]),
  };

  private channelMessageListener = (event: MessageEvent<any>) => {
    this.onBroadcastMessage(event);
    if (event.data === 'external-sync') {
      this.syncAssets();
      this.resubscribeBalance();
    }
  };

  protected abstract onInit(): void;
  protected abstract onBlockChange(blockNumber: number): void;
  protected abstract onBalanceUpdate(): void;
  protected abstract onBroadcastMessage(event: MessageEvent): void;

  isApiReady(): boolean {
    return !!this.chain.state;
  }

  async getSpotPrice(assetIn: Asset, assetOut: Asset): Promise<Amount> {
    const usdPeggedAsset = this.assets.tradeable.find(
      (a) => a.id === this.stableCoinAssetId,
    );
    const [spotPrice, assetInUsd, assetOutUsd] = await Promise.all([
      this.priceApi.getPrice(assetIn, assetOut),
      this.priceApi.getPrice(assetIn, usdPeggedAsset, this.stableCoinRate),
      this.priceApi.getPrice(assetOut, usdPeggedAsset, this.stableCoinRate),
    ]);

    this.assets.usdPrice.set(assetIn.id, assetInUsd);
    this.assets.usdPrice.set(assetOut.id, assetOutUsd);
    return spotPrice;
  }

  async getNativePrice(asset: Asset): Promise<Amount> {
    const nativeAsset = this.assets.tradeable.find(
      (a) => a.id === SYSTEM_ASSET_ID,
    );
    return this.priceApi.getPrice(asset, nativeAsset);
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
        this.isTestnet,
      );
    }
  }

  override update(changedProperties: Map<string, unknown>) {
    super.update(changedProperties);
  }

  override connectedCallback() {
    super.connectedCallback();
    this.channel.addEventListener('message', this.channelMessageListener);
  }

  override disconnectedCallback() {
    const account = this.account.state;
    this.disconnectSubscribeNewHeads?.();
    this.unsubscribeBalance(account);
    this.channel.removeEventListener('message', this.channelMessageListener);
    this.priceApi.destroy();
    super.disconnectedCallback();
  }

  private async _init() {
    await this.init();
    await this.subscribe();
    this.subscribeBalance();
  }

  private async init() {
    const { api, poolService, router } = this.chain.state;
    this.assetApi = new AssetApi(api, router);
    this.paymentApi = new PaymentApi(api, router);
    this.priceApi = new PriceApi(api, router);
    this.timeApi = new TimeApi(api);
    this.balanceClient = new BalanceClient(api);

    const tradeable = await router.getAllAssets();
    this.assets = {
      ...this.assets,
      tradeable: tradeable,
      registry: new Map(poolService.assets.map((a) => [a.id, a])),
    };

    this.timeApi.getBlockTime().then((time: number) => {
      this.blockTime = time;
      console.log('Avg blockTime:', time);
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
        this.onBlockChange(blockNumber);
      },
    );
  }

  protected async subscribeBalance() {
    const account = this.account.state;
    if (account) {
      this.disconnectSubscribeBalance = await this.subscribeAccountBalance();
      const addrAbrev = this.getShortened(account.address);
      console.log(`Account [${addrAbrev}] balance subscribed`);
    }
  }

  protected unsubscribeBalance(account: Account) {
    this.disconnectSubscribeBalance?.();
    if (account) {
      const addrAbrev = this.getShortened(account.address);
      console.log(`Account [${addrAbrev}] balance unsubscribed`);
    }
  }

  protected async resubscribeBalance() {
    const account = this.account.state;
    this.unsubscribeBalance(account);
    this.subscribeBalance();
  }

  private subscribeAccountBalance(): UnsubscribePromise {
    const account = this.account.state;
    const assets = this.assets.registry;
    const balances = this.assets.balance;
    const token = [...assets.values()].map((t) => t.id);
    return this.balanceClient.subscribeBalances(
      account.address,
      (balance: [string, BigNumber][]) => {
        balance.forEach(([token, balance]) => {
          const asset: Asset = assets.get(token);
          if (asset) {
            const newBalance: Amount = {
              amount: balance,
              decimals: asset.decimals,
            } as Amount;
            balances.set(token, newBalance);
          }
        });

        const empty = token.filter((t) => !balances.get(t));
        empty.forEach((token) => {
          const asset: Asset = assets.get(token);
          const emptyBalance: Amount = {
            amount: ZERO,
            decimals: asset.decimals,
          } as Amount;
          balances.set(token, emptyBalance);
        });

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

  protected async syncAssets() {
    const { poolService, router } = this.chain.state;
    const tradeable = await router.getAllAssets();

    this.assets = {
      ...this.assets,
      tradeable: tradeable,
      registry: new Map(poolService.assets.map((a) => [a.id, a])),
    };
  }

  protected async syncDolarPrice() {
    const assets = this.assets.tradeable;
    const balances = this.assets.balance;
    const current = this.assets.usdPrice;
    const usdPeggedAsset = this.assets.tradeable.find(
      (a) => a.id === this.stableCoinAssetId,
    );

    const latest = new Map<string, Amount>([]);
    await Promise.all(
      assets.map(async (asset) => {
        const assetBalance = balances.get(asset.id);
        if (assetBalance && assetBalance.amount > ZERO) {
          const price = await this.priceApi.getPrice(
            asset,
            usdPeggedAsset,
            this.stableCoinRate,
          );
          latest.set(asset.id, price);
        }
      }),
    );

    this.assets.usdPrice = new Map([...current, ...latest]);
    this.requestUpdate();
  }
}
