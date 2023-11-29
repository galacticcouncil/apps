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
  getSourceData,
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

import {
  firstValueFrom,
  merge,
  switchMap,
  map,
  concatMap,
  Observable,
} from 'rxjs';
import {
  Chain,
  PublicClient,
  WalletClient,
  createPublicClient,
  createWalletClient,
  http,
} from 'viem';

import { EvmBalanceAdapter, SubstrateBalanceAdapter } from './balance';
import { Balance } from './types';
import { convertAddressSS58, convertToH160 } from '../../../utils/account';

import {
  AcalaEvmProvider,
  DefaultEvmProvider,
  EvmProvider,
  acala,
  hydradx,
  moonbeam,
} from './evm';
import { PolkadotService } from './PolkadotService';
import { XTokens } from './contracts/XTokens';

export interface EvmChains {
  [key: string]: Chain;
}

export interface XcmWalletOptions {
  configService: IConfigService;
  evmChains: EvmChains;
}

export class XcmWallet {
  private readonly configService: IConfigService = null;
  private readonly evmProviders: Record<string, EvmProvider> = {};

  private readonly evmChains: Record<string, Chain> = {};
  private readonly publicClients: Record<string, PublicClient> = {};
  private readonly transfer: (
    params: SdkTransferParams,
  ) => Promise<TransferData> = null;

  constructor({ configService, evmChains }: XcmWalletOptions) {
    this.configService = configService;
    this.initChains(evmChains);
    this.transfer = Sdk({ configService }).getTransferData;
  }

  private async initChains(evmChains: EvmChains) {
    Object.entries(evmChains).forEach(([name, chain]) => {
      this.evmChains[name] = chain;
      this.publicClients[name] = createPublicClient({
        chain: chain,
        transport: http(),
      });

      let provider: EvmProvider;
      if (name === 'acala') {
        provider = new AcalaEvmProvider(chain);
      } else {
        provider = new DefaultEvmProvider(chain);
      }
      this.evmProviders[name] = provider;
    });
  }

  private isEvmChain(chain: AnyChain) {
    const isParachain = chain.isEvmParachain();
    const evmProvider = this.evmProviders[chain.key];
    return isParachain || evmProvider;
  }

  private getTransferConfig(
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

  private getBalanceConfig(
    srcAddr: string,
    srcChain: AnyChain,
    srcChainConfig: ChainConfig,
  ) {
    return srcChainConfig.getAssetsConfigs().map(({ asset, balance }) => {
      const assetId = srcChain.getBalanceAssetId(asset);
      const config = balance.build({
        address: srcAddr,
        asset: assetId,
      });
      return { key: asset.key, config };
    });
  }

  private async getEvmBalance(
    asset: Asset,
    chain: AnyChain,
    config: ContractConfig,
  ): Promise<Balance> {
    const api = await getPolkadotApi(chain.ws);
    const evmProvider = this.evmProviders[chain.key];
    const evmAdapter = new EvmBalanceAdapter(evmProvider, api);
    const observer = evmAdapter.getObserver(
      asset.key,
      config as ContractConfig,
    );
    return await firstValueFrom(observer);
  }

  private async getSubstrateBalance(
    asset: Asset,
    chain: AnyChain,
    config: ContractConfig,
  ): Promise<Balance> {
    const api = await getPolkadotApi(chain.ws);
    const substrateAdapter = new SubstrateBalanceAdapter(api);
    const observer = substrateAdapter.getObserver(
      asset.key,
      config as SubstrateQueryConfig,
    );
    return await firstValueFrom(observer);
  }

  /**
   * Return source chain input asset balance
   *
   * @param address
   * @param transferConfig
   * @returns
   */
  public async getBalance(
    address: string,
    transferConfig: TransferConfig,
  ): Promise<AssetAmount> {
    const { source, asset } = transferConfig;
    const { chain } = source;

    const assetId = chain.getBalanceAssetId(asset);
    const assetConfig = source.config;
    const balanceConfig = assetConfig.balance.build({
      address: address,
      asset: assetId,
    });

    let balance: Balance;
    if (balanceConfig.type === CallType.Evm) {
      balance = await this.getEvmBalance(asset, chain, balanceConfig);
    } else {
      balance = await this.getSubstrateBalance(asset, chain, balanceConfig);
    }

    const polkadot = await PolkadotService.create(chain, this.configService);
    const decimals = await polkadot.getAssetDecimals(asset);
    return AssetAmount.fromAsset(asset, {
      amount: balance.balance,
      decimals: decimals,
    });
  }

  /**
   * Return source chain input asset fee balance
   *
   * @param address
   * @param transferConfig
   * @returns
   */
  public async getFeeBalance(
    address: string,
    transferConfig: TransferConfig,
  ): Promise<AssetAmount> {
    const { source, asset } = transferConfig;
    const { chain } = source;

    const assetId = chain.getBalanceAssetId(asset);
    const assetConfig = source.config;

    let balance: Balance;
    let feeAsset: Asset;
    if (assetConfig.fee) {
      const balanceConfig = assetConfig.fee.balance.build({
        address: address,
        asset: assetId,
      });
      feeAsset = assetConfig.fee.asset;
      balance = await this.getSubstrateBalance(asset, chain, balanceConfig);
    } else {
      feeAsset = asset;
      balance = {
        key: asset.key,
        balance: 0n,
      };
    }

    const polkadot = await PolkadotService.create(chain, this.configService);
    const decimals = await polkadot.getAssetDecimals(feeAsset);
    return AssetAmount.fromAsset(feeAsset, {
      amount: balance.balance,
      decimals: decimals,
    });
  }

  /**
   * Return destination chain fee
   *
   * @param config
   * @param chain
   * @returns
   */
  public async getDestinationFee(
    transferConfig: TransferConfig,
  ): Promise<AssetAmount> {
    const { source, destination } = transferConfig;
    const { config } = source;
    const { amount, asset } = config.destinationFee;

    const polkadot = await PolkadotService.create(
      destination.chain,
      this.configService,
    );
    const decimals = await polkadot.getAssetDecimals(asset);

    if (Number.isFinite(amount)) {
      return AssetAmount.fromAsset(asset, {
        amount: toBigInt(amount as number, decimals),
        decimals,
      });
    }

    const feeConfig = (amount as FeeConfigBuilder).build({
      api: polkadot.api,
      asset: polkadot.chain.getAssetId(asset),
    });
    const feeBalance: bigint = await feeConfig.call();
    return AssetAmount.fromAsset(asset, {
      amount: feeBalance,
      decimals,
    });
  }

  private async buildTransfer(
    amount: bigint,
    dstAddress: string,
    dstFee: AssetAmount,
    transferConfig: TransferConfig,
  ): Promise<ExtrinsicConfig | ContractConfig> {
    const { source, destination, asset } = transferConfig;
    const { config } = source;

    const assetId = source.chain.getAssetId(asset);
    const feeAssetId = source.chain.getAssetId(dstFee);

    if (config.extrinsic) {
      const palletInstance = source.chain.getAssetPalletInstance(asset);
      return config.extrinsic.build({
        address: dstAddress,
        amount: amount,
        asset: assetId,
        destination: destination.chain,
        fee: dstFee.amount,
        feeAsset: feeAssetId,
        palletInstance: palletInstance,
        source: source.chain,
      });
    }

    if (config.contract) {
      return config.contract.build({
        address: dstAddress,
        amount: amount,
        asset: assetId,
        destination: destination.chain,
        fee: dstFee.amount,
        feeAsset: feeAssetId,
      });
    }
    throw new Error('Either contract or extrinsic must be provided');
  }

  /**
   * Return source chain fee
   *
   * @param config
   * @param chain
   * @returns
   */
  public async getSourceFee(
    amount: bigint,
    srcAddress: string,
    dstAddress: string,
    dstFee: AssetAmount,
    transferConfig: TransferConfig,
  ) {
    const { source } = transferConfig;

    const polkadot = await PolkadotService.create(
      source.chain,
      this.configService,
    );
    const decimals = await polkadot.getAssetDecimals(dstFee);

    const transfer = await this.buildTransfer(
      amount,
      dstAddress,
      dstFee,
      transferConfig,
    );

    let fee: bigint;
    if (transfer.type === CallType.Evm) {
      const evmProvider = this.evmProviders[source.chain.key];
      const contract = new XTokens(
        transfer as ContractConfig,
        evmProvider.getPublicClient(),
      );
      fee = await contract.getFee(amount);
      fee = convertDecimals(fee, 18, decimals);
    } else {
      fee = await polkadot.getFee(srcAddress, transfer as ExtrinsicConfig);
    }

    return AssetAmount.fromAsset(dstFee, {
      amount: fee,
      decimals: decimals,
    });
  }

  public async getSourceData(
    srcAddr: string,
    srcChain: AnyChain,
    dstAddr: string,
    dstChain: AnyChain,
    asset: Asset,
  ) {
    const transferConfig = this.getTransferConfig(srcChain, dstChain, asset);

    const balance = await this.getBalance(srcAddr, transferConfig);
    const feeBalance = await this.getFeeBalance(srcAddr, transferConfig);
    const destinationFee = await this.getDestinationFee(transferConfig);

    console.log(balance);
    console.log(feeBalance);
    console.log(destinationFee);

    const sourceFee = await this.getSourceFee(
      balance.amount,
      srcAddr,
      dstAddr,
      destinationFee,
      transferConfig,
    );
    console.log(sourceFee);

    //console.log(min);
  }

  private async getMin(config: AssetConfig, chain: AnyChain): Promise<bigint> {
    const { asset } = config;
    if (config.min) {
      const minAssetId = chain.getMinAssetId(asset);
      const minConfig = config.min.build({
        asset: minAssetId,
      });
      const balance = await this.getSubstrateBalance(asset, chain, minConfig);
      return balance.balance;
    }

    const min = chain.getAssetMin(config.asset);
    if (min) {
      return toBigInt(min, 12);
    }
    return 0n;
  }

  private async getFee(config: AssetConfig, chain: AnyChain): Promise<bigint> {
    if (config.min) {
      const minAssetId = chain.getMinAssetId(config.asset);
      const cfg = config.min.build({
        asset: minAssetId,
      });
      const balance = await this.getSubstrateBalance(config.asset, chain, cfg);
      return balance.balance;
    }

    const min = chain.getAssetMin(config.asset);
    if (min) {
      return toBigInt(min, 12);
    }
    return 0n;
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
    chain: AnyChain,
    chainConfig: ChainConfig,
  ): Promise<Observable<Balance>> {
    const api = await getPolkadotApi(chain.ws);
    const balanceConfigs = this.getBalanceConfig(address, chain, chainConfig);

    let evmObservers: Observable<Balance>[] = [];
    const evmProvider = this.evmProviders[chain.key];
    if (evmProvider) {
      const evmAdapter = new EvmBalanceAdapter(evmProvider, api);
      evmObservers = balanceConfigs
        .filter(({ config }) => config.type === CallType.Evm)
        .map(({ key, config }) =>
          evmAdapter.getObserver(key, config as ContractConfig),
        );
    }

    const substrateAdapter = new SubstrateBalanceAdapter(api);
    const substrateObservers = balanceConfigs
      .filter(({ config }) => config.type === CallType.Substrate)
      .map(({ key, config }) =>
        substrateAdapter.getObserver(key, config as SubstrateQueryConfig),
      );
    return merge(...substrateObservers, ...evmObservers);
  }
}
