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
