import {
  CallType,
  ContractConfig,
  ExtrinsicConfig,
  FeeConfigBuilder,
  SubstrateQueryConfig,
} from '@moonbeam-network/xcm-builder';
import {
  AssetConfig,
  ConfigBuilder,
  ChainConfig,
  IConfigService,
  TransferConfig,
} from '@moonbeam-network/xcm-config';
import {
  Sdk,
  SdkTransferParams,
  TransferData,
} from '@moonbeam-network/xcm-sdk';
import { Asset, AnyChain, AssetAmount } from '@moonbeam-network/xcm-types';
import {
  convertDecimals,
  getPolkadotApi,
  toBigInt,
} from '@moonbeam-network/xcm-utils';

import { ApiPromise } from '@polkadot/api';

import { merge, Subscription } from 'rxjs';
import { Chain, WalletClient, createWalletClient, http } from 'viem';

import { Erc20BalanceAdapter, SubstrateBalanceAdapter } from './balance';
import { Balance } from './types';

import { EvmClient } from './evm';
import { PolkadotService } from './polkadot/PolkadotService';
import { XTokens } from './contracts/XTokens';
import { getAssetBalance } from './transfer/getSourceData';

export interface EvmChains {
  [key: string]: Chain;
}

export interface WalletOptions {
  configService: IConfigService;
  evmChains: EvmChains;
}

export class Wallet {
  private readonly configService: IConfigService = null;
  private readonly evmCliets: Record<string, EvmClient> = {};
  private readonly evmChains: Record<string, Chain> = {};
  private readonly transfer: (
    params: SdkTransferParams,
  ) => Promise<TransferData> = null;

  constructor({ configService, evmChains }: WalletOptions) {
    this.configService = configService;
    this.initChains(evmChains);
    this.transfer = Sdk({ configService }).getTransferData;
  }

  private async initChains(evmChains: EvmChains) {
    Object.entries(evmChains).forEach(([name, chain]) => {
      this.evmChains[name] = chain;
      this.evmCliets[name] = new EvmClient(chain);
    });
  }

  public getEvmClient(chain: AnyChain): EvmClient {
    const client = this.evmCliets[chain.key];
    if (!client) {
      throw new Error(`No evm configuration found for "${chain}"`);
    }
    return client;
  }

  public async getPolkadotApi(chain: AnyChain): Promise<ApiPromise> {
    return getPolkadotApi(chain.ws);
  }

  public async getPolkadotService(chain: AnyChain): Promise<PolkadotService> {
    return await PolkadotService.create(chain, this.configService);
  }

  private async getErc20Balance(
    asset: Asset,
    chain: AnyChain,
    config: ContractConfig,
  ): Promise<AssetAmount> {
    const client = this.getEvmClient(chain);
    const polkadot = await this.getPolkadotService(chain);
    const adapter = new Erc20BalanceAdapter(client, config);
    const [balance, decimals] = await Promise.all([
      adapter.getBalance(asset.key),
      polkadot.getDecimals(asset),
    ]);

    return AssetAmount.fromAsset(asset, {
      amount: balance.amount,
      decimals: decimals,
    });
  }

  private async getSubstrateBalance(
    asset: Asset,
    chain: AnyChain,
    config: SubstrateQueryConfig,
  ): Promise<AssetAmount> {
    const polkadot = await this.getPolkadotService(chain);
    const adapter = new SubstrateBalanceAdapter(polkadot.api, config);
    const [balance, decimals] = await Promise.all([
      adapter.getBalance(asset.key),
      polkadot.getDecimals(asset),
    ]);

    return AssetAmount.fromAsset(asset, {
      amount: balance.amount,
      decimals: decimals,
    });
  }

  private async getBalance(
    asset: Asset,
    chain: AnyChain,
    config: ContractConfig | SubstrateQueryConfig,
  ): Promise<AssetAmount> {
    if (config.type === CallType.Evm) {
      return this.getErc20Balance(asset, chain, config as ContractConfig);
    }
    return this.getSubstrateBalance(
      asset,
      chain,
      config as SubstrateQueryConfig,
    );
  }

  private async getContractFee(
    amount: bigint,
    asset: Asset,
    chain: AnyChain,
    config: ContractConfig,
  ): Promise<AssetAmount> {
    const client = this.getEvmClient(chain);
    const polkadot = await this.getPolkadotService(chain);
    const contract = new XTokens(config, client.getProvider());

    const [fee, decimals] = await Promise.all([
      contract.getFee(amount),
      polkadot.getDecimals(asset),
    ]);

    return AssetAmount.fromAsset(asset, {
      amount: convertDecimals(fee, 18, decimals),
      decimals: decimals,
    });
  }

  private async getExtrinsictFee(
    address: string,
    asset: Asset,
    chain: AnyChain,
    config: ExtrinsicConfig,
  ): Promise<AssetAmount> {
    const polkadot = await this.getPolkadotService(chain);
    const [fee, decimals] = await Promise.all([
      polkadot.getFee(address, config),
      polkadot.getDecimals(asset),
    ]);

    return AssetAmount.fromAsset(asset, {
      amount: fee,
      decimals: decimals,
    });
  }

  private async getFee(
    address: string,
    amount: bigint,
    asset: Asset,
    chain: AnyChain,
    config: ContractConfig | ExtrinsicConfig,
  ): Promise<AssetAmount> {
    if (config.type === CallType.Evm) {
      return this.getContractFee(
        amount,
        asset,
        chain,
        config as ContractConfig,
      );
    }
    return await this.getExtrinsictFee(
      address,
      asset,
      chain,
      config as ExtrinsicConfig,
    );
  }

  public getTransferConfig(
    srcChain: AnyChain,
    dstChain: AnyChain,
    asset: Asset,
  ): TransferConfig {
    return ConfigBuilder(this.configService)
      .assets()
      .asset(asset)
      .source(srcChain)
      .destination(dstChain)
      .build();
  }

  /**
   * Return source chain asset balance
   *
   * @param address
   * @param transferConfig
   * @returns
   */
  private async getSourceBalance(
    address: string,
    transferConfig: TransferConfig,
  ): Promise<AssetAmount> {
    const { source, asset } = transferConfig;
    const { chain } = source;

    const assetId = chain.getBalanceAssetId(asset);
    const balanceConfig = source.config.balance.build({
      address: address,
      asset: assetId,
    });
    return this.getBalance(asset, chain, balanceConfig);
  }

  /**
   * Return source chain fee balance
   *
   * @param address
   * @param transferConfig
   * @returns
   */
  private async getSourceFeeBalance(
    address: string,
    transferConfig: TransferConfig,
  ): Promise<AssetAmount> {
    const { source, asset } = transferConfig;
    const { chain } = source;

    const assetId = chain.getBalanceAssetId(asset);
    const feeConfig = source.config.fee;

    const feeBalanceConfig = feeConfig.balance.build({
      address: address,
      asset: assetId,
    });
    const feeAsset = feeConfig.asset;
    return await this.getSubstrateBalance(
      feeAsset,
      chain,
      feeBalanceConfig as SubstrateQueryConfig,
    );
  }

  /**
   * Return destination chain fee
   *
   * @param transferConfig
   * @returns
   */
  private async getDestinationFee(
    transferConfig: TransferConfig,
  ): Promise<AssetAmount> {
    const { source, destination } = transferConfig;
    const { config } = source;

    const { asset, amount } = config.destinationFee;

    const polkadot = await this.getPolkadotService(destination.chain);
    const decimals = await polkadot.getDecimals(asset);

    if (Number.isFinite(amount)) {
      return AssetAmount.fromAsset(asset, {
        amount: toBigInt(amount as number, decimals),
        decimals,
      });
    }

    const feeConfigBuilder = amount as FeeConfigBuilder;
    const feeConfig = feeConfigBuilder.build({
      api: polkadot.api,
      asset: polkadot.chain.getAssetId(asset),
    });
    const feeBalance = await feeConfig.call();
    return AssetAmount.fromAsset(asset, {
      amount: feeBalance,
      decimals,
    });
  }

  /**
   * Return source chain fee
   *
   * @param amount - asset balance
   * @param dstAddress - destination chain address
   * @param dstFee - destination chain fee
   * @param srcAddress - source chain address
   * @param srcFeeBalance - source chain fee asset balance
   * @param transferConfig - transfer configuration
   * @returns source chain fee
   */
  private async getSourceFee(
    amount: bigint,
    dstAddress: string,
    dstFee: AssetAmount,
    srcAddress: string,
    srcFeeBalance: AssetAmount,
    transferConfig: TransferConfig,
  ) {
    const { source } = transferConfig;
    const { chain } = source;

    const config = await this.buildTransferConfig(
      amount,
      dstAddress,
      dstFee,
      transferConfig,
    );
    return this.getFee(srcAddress, amount, srcFeeBalance, chain, config);
  }

  public async getSourceData(
    asset: Asset,
    dstAddr: string,
    dstChain: AnyChain,
    srcAddr: string,
    srcChain: AnyChain,
  ) {
    const transferConfig = this.getTransferConfig(srcChain, dstChain, asset);

    const [balance, dstFee] = await Promise.all([
      //this.getSourceBalance(srcAddr, transferConfig),
      getAssetBalance(srcAddr, transferConfig, this.getBalance.bind(this)),
      this.getDestinationFee(transferConfig),
    ]);

    const { source } = transferConfig;
    const assetFeeConfig = source.config.fee;

    const srcFeeBalance = assetFeeConfig
      ? await this.getSourceFeeBalance(srcAddr, transferConfig)
      : balance;

    const srcFee = await this.getSourceFee(
      balance.amount,
      dstAddr,
      dstFee,
      srcAddr,
      srcFeeBalance,
      transferConfig,
    );

    console.log(balance);
    console.log(srcFeeBalance);
    console.log(srcFee);
    console.log(dstFee);
  }

  public async getTransferData(
    srcAddr: string,
    srcChain: AnyChain,
    dstAddr: string,
    dstChain: AnyChain,
    asset: Asset,
  ): Promise<TransferData> {
    let evmSigner: WalletClient;
    if (srcChain.isEvmParachain()) {
      const evmChain = this.evmChains[srcChain.key];
      evmSigner = createWalletClient({
        account: srcAddr as `0x${string}`,
        chain: evmChain,
        transport: http(),
      });
    }

    if (dstChain.isEvmParachain()) {
      const evmChain = this.evmChains[dstChain.key];
      evmSigner = createWalletClient({
        account: dstAddr as `0x${string}`,
        chain: evmChain,
        transport: http(),
      });
    }

    return await this.transfer({
      destinationAddress: dstAddr,
      destinationKeyOrChain: dstChain,
      keyOrAsset: asset,
      sourceAddress: srcAddr,
      sourceKeyOrChain: srcChain,
      evmSigner: evmSigner,
    });
  }

  public async subscribeBalance(
    address: string,
    chainConfig: ChainConfig,
    observer: (balance: Balance) => void,
  ): Promise<Subscription> {
    const chain = chainConfig.chain;
    const api = await this.getPolkadotApi(chain);

    const balanceConfigs = chainConfig
      .getAssetsConfigs()
      .map((config) => this.buildBalanceConfig(address, chain, config));

    const erc20Observables = balanceConfigs
      .filter(({ config }) => config.type === CallType.Evm)
      .map(({ key, config }) => {
        const client = this.getEvmClient(chain);
        const adapter = new Erc20BalanceAdapter(client, config);
        return adapter.getObservable(key);
      });

    const substrateObservables = balanceConfigs
      .filter(({ config }) => config.type === CallType.Substrate)
      .map(({ key, config }) => {
        const cfg = config as SubstrateQueryConfig;
        const adapter = new SubstrateBalanceAdapter(api, cfg);
        return adapter.getObservable(key);
      });

    const observable = merge(...erc20Observables, ...substrateObservables);
    return observable.subscribe(observer);
  }

  private buildBalanceConfig(
    srcAddr: string,
    srcChain: AnyChain,
    assetConfig: AssetConfig,
  ) {
    const { asset } = assetConfig;
    const assetId = srcChain.getBalanceAssetId(asset);
    const config = assetConfig.balance.build({
      address: srcAddr,
      asset: assetId,
    });
    return { key: asset.key, config };
  }

  private async buildTransferConfig(
    amount: bigint,
    dstAddress: string,
    dstFee: AssetAmount,
    transferConfig: TransferConfig,
  ): Promise<ExtrinsicConfig | ContractConfig> {
    const { source, destination, asset } = transferConfig;
    const { config } = source;

    const srcChain = source.chain;
    const dstChain = destination.chain;

    const assetId = source.chain.getAssetId(asset);
    const feeAssetId = source.chain.getAssetId(dstFee);

    if (config.extrinsic) {
      const palletInstance = srcChain.getAssetPalletInstance(asset);
      return config.extrinsic.build({
        address: dstAddress,
        amount: amount,
        asset: assetId,
        destination: dstChain,
        fee: dstFee.amount,
        feeAsset: feeAssetId,
        palletInstance: palletInstance,
        source: srcChain,
      });
    }

    if (config.contract) {
      return config.contract.build({
        address: dstAddress,
        amount: amount,
        asset: assetId,
        destination: dstChain,
        fee: dstFee.amount,
        feeAsset: feeAssetId,
      });
    }
    throw new Error('Either contract or extrinsic must be provided');
  }
}
