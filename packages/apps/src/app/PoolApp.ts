import { property, state } from 'lit/decorators.js';

import short from 'short-uuid';

import {
  Amount,
  Asset,
  BalanceClient,
  BigNumber,
  PoolType,
  SYSTEM_ASSET_DECIMALS,
  SYSTEM_ASSET_ID,
  toDecimals,
  ZERO,
} from '@galacticcouncil/sdk';

import { UnsubscribePromise, VoidFn } from '@polkadot/api/types';

import { AssetApi } from 'api/asset';
import { PaymentApi } from 'api/payment';
import { PriceApi } from 'api/price';
import { TimeApi } from 'api/time';
import { BaseApp } from 'app/BaseApp';

import { createApi } from 'chain';
import { Account, Chain, ChainCursor, DatabaseController } from 'db';
import { SECOND_MS } from 'utils/time';

export abstract class PoolApp extends BaseApp {
  protected chain = new DatabaseController<Chain>(this, ChainCursor);

  protected disconnectSubscribeNewHeads: () => void = null;
  protected disconnectSubscribeBalance: VoidFn[] = [];

  protected blockNumber: number = null;
  protected blockTime: number = 12 * SECOND_MS;

  protected assetApi: AssetApi = null;
  protected balanceClient: BalanceClient = null;
  protected paymentApi: PaymentApi = null;
  protected priceApi: PriceApi = null;
  protected timeApi: TimeApi = null;

  private chainWatchId: string;

  @property({ type: String }) apiAddress: string = null;
  @property({ type: String }) assetIn: string = null;
  @property({ type: String }) assetOut: string = null;
  @property({ type: String }) stableCoinAssetId: string = null;
  @property({ type: String }) stableCoinRate: string = null;

  @state() assets = {
    atokens: new Map<string, string>([]),
    balance: new Map<string, Amount>([]),
    registry: new Map<string, Asset>([]),
    tradeable: [] as Asset[],
    usdPrice: new Map<string, Amount>([]),
  };

  constructor() {
    super();
    this.chainWatchId = 'chain-watch-' + short.generate();
  }

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
      this.apiAddress &&
        createApi(
          this.apiAddress,
          this.ecosystem,
          () => this._init(),
          () => {},
          this.isTestnet,
          this.unifiedAddressFormat,
        );
    }
  }

  override update(changedProperties: Map<string, unknown>) {
    super.update(changedProperties);
  }

  override connectedCallback() {
    super.connectedCallback();
    this.channel.addEventListener('message', this.channelMessageListener);
    ChainCursor.addWatch(this.chainWatchId, (_id, prev, curr) => {
      if (this.apiAddress === null) {
        this._init();
      }
    });
  }

  override disconnectedCallback() {
    ChainCursor.removeWatch(this.chainWatchId);
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
    const { api, sdk } = this.chain.state;
    const { api: sdkApi, ctx } = sdk;

    this.assetApi = new AssetApi(api, sdkApi.router);
    this.paymentApi = new PaymentApi(api, sdkApi.router);
    this.priceApi = new PriceApi(api, sdkApi.router);
    this.timeApi = new TimeApi(api);
    this.balanceClient = new BalanceClient(api);

    const [pools, tradeable] = await Promise.all([
      sdkApi.router.getPools(),
      sdkApi.router.getAllAssets(),
    ]);

    const aTokens = pools
      .filter((p) => p.type === PoolType.Aave)
      .reduce((acc, p) => {
        const [reserve, atoken] = p.tokens;
        acc.set(atoken.id, reserve.id);
        return acc;
      }, new Map<string, string>());

    this.assets = {
      ...this.assets,
      atokens: aTokens,
      tradeable: tradeable,
      registry: new Map(ctx.pool.assets.map((a) => [a.id, a])),
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
      this.disconnectSubscribeBalance = await Promise.all([
        this.subscribeTokensAccountBalance(),
        this.subscribeErc20AccountBalance(),
        this.subscribeSystemAccountBalance(),
      ]);
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

  protected async resubscribeBalance() {
    const account = this.account.state;
    this.unsubscribeBalance(account);
    this.subscribeBalance();
  }

  private subscribeTokensAccountBalance(): UnsubscribePromise {
    const account = this.account.state;

    const { balance, registry } = this.assets;

    return this.balanceClient.subscribeTokenBalance(
      account.address,
      (balaces) => {
        balaces.forEach(([token, amount]) => {
          const asset: Asset = registry.get(token);
          const newAmount = {
            amount: amount,
            decimals: asset.decimals,
          } as Amount;
          balance.set(token, newAmount);
        });
        this.assets.balance = balance;
        this.onBalanceUpdate();
      },
      Array.from(registry.values())
        .filter((a) => a.type !== 'Erc20' && a.id !== SYSTEM_ASSET_ID)
        .map((a) => a.id),
    );
  }

  private subscribeErc20AccountBalance(): UnsubscribePromise {
    const account = this.account.state;
    const { sdk } = this.chain.state;
    const { atokens, balance, registry } = this.assets;

    const hasSignificantChange = (
      current: [string, BigNumber][],
      snapshot: Map<string, BigNumber>,
      thresholdPercent = 0.01,
    ) => {
      for (const [token, amount] of current) {
        const prevAmount = snapshot.get(token);

        const asset: Asset = registry.get(token);
        const decimals = asset.decimals;

        const prevBalance = Number(toDecimals(prevAmount, decimals));
        const currBalance = Number(toDecimals(amount, decimals));

        if (prevBalance === 0 && currBalance === 0) continue;

        const threshold = prevBalance * (thresholdPercent / 100);
        const diff = Math.abs(currBalance - prevBalance);

        if (diff >= threshold) {
          return true;
        }
      }
      return false;
    };

    const reserves = new Map<string, Amount>([]);
    const snapABalances = new Map<string, BigNumber>([]);

    return this.balanceClient.subscribeErc20Balance(
      account.address,
      async (balances) => {
        const newAbalances = balances.filter(([t]) => atokens.has(t));

        const shouldSyncReserves =
          snapABalances.size === 0 ||
          hasSignificantChange(newAbalances, snapABalances);

        if (shouldSyncReserves) {
          const max = await sdk.api.aave.getMaxWithdrawAll(account.address);
          Object.entries(max).forEach(([token, amount]) => {
            reserves.set(token, amount);
          });
          for (const [token, amount] of newAbalances) {
            snapABalances.set(token, amount);
          }
        }

        balances.forEach(([token, amount]) => {
          const asset: Asset = registry.get(token);
          const decimals = asset.decimals;

          let newAmount: Amount;

          const reserve = atokens.get(token);
          if (reserve) {
            newAmount = reserves.get(reserve);
          } else {
            newAmount = {
              amount: amount,
              decimals: decimals,
            };
          }
          balance.set(token, newAmount);
        });
        this.assets.balance = balance;
        this.onBalanceUpdate();
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

  protected async syncAssets() {
    const { sdk } = this.chain.state;
    const { api: sdkApi, ctx } = sdk;
    const tradeable = await sdkApi.router.getAllAssets();

    this.assets = {
      ...this.assets,
      tradeable: tradeable,
      registry: new Map(ctx.pool.assets.map((a) => [a.id, a])),
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
