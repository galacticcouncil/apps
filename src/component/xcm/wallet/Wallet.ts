import { ConfigBuilder, ConfigService } from '@moonbeam-network/xcm-config';
import { Asset, AnyChain, AssetAmount } from '@moonbeam-network/xcm-types';

import { merge, Subscription } from 'rxjs';
import { Chain } from 'viem';

import { BalanceAdapter } from './balance';
import { EvmClient } from './evm';
import { SubstrateService } from './substrate';

import { DestinationDataResolver, SourceDataResolver } from './transfer';
import { TransferInput } from './types';

export interface EvmChains {
  [key: string]: Chain;
}

export interface WalletOptions {
  configService: ConfigService;
  evmChains: EvmChains;
}

export class Wallet {
  private readonly configService: ConfigService = null;
  private readonly evmClients: Record<string, EvmClient> = {};

  constructor({ configService, evmChains }: WalletOptions) {
    this.configService = configService;
    Object.entries(evmChains).forEach(([name, chain]) => {
      this.evmClients[name] = new EvmClient(chain);
    });
  }

  public getEvmClient(chain: string | AnyChain): EvmClient {
    const _chain = this.configService.getChain(chain);
    return this.evmClients[_chain.key];
  }

  public async getSubstrateService(
    chain: string | AnyChain,
  ): Promise<SubstrateService> {
    const _chain = this.configService.getChain(chain);
    return await SubstrateService.create(_chain, this.configService);
  }

  public async getTransferInput(
    asset: string | Asset,
    srcAddr: string,
    srcChain: string | AnyChain,
    destAddr: string,
    destChain: string | AnyChain,
  ): Promise<TransferInput> {
    const { source, destination } = ConfigBuilder(this.configService)
      .assets()
      .asset(asset)
      .source(srcChain)
      .destination(destChain)
      .build();

    const srcEvm = this.getEvmClient(srcChain);
    const srcSubstrate = await this.getSubstrateService(srcChain);
    const srcResolver = new SourceDataResolver(srcEvm, srcSubstrate);

    const destEvm = this.getEvmClient(destChain);
    const destSubstrate = await this.getSubstrateService(destChain);
    const destResolver = new DestinationDataResolver(destEvm, destSubstrate);

    const [srcBalance, srcFeeBalance, srcMin, destBalance, destFee, destMin] =
      await Promise.all([
        srcResolver.getBalance(srcAddr, source),
        srcResolver.getFeeBalance(srcAddr, source),
        srcResolver.getMin(source),
        destResolver.getBalance(destAddr, destination),
        destResolver.getFee(source),
        destResolver.getMin(destination),
      ]);

    const srcFee = await srcResolver.getFee(
      srcAddr,
      srcBalance.amount,
      srcFeeBalance,
      destAddr,
      destination.chain,
      destFee,
      source,
    );

    const [max, min] = await Promise.all([
      srcResolver.calculateMax(srcBalance, srcFee, srcMin),
      destResolver.calculateMin(destBalance, destFee, destMin),
    ]);

    return {
      balance: srcBalance,
      min,
      max,
      srcFee,
      destFee,
    } as TransferInput;
  }

  public async subscribeBalance(
    address: string,
    chain: string | AnyChain,
    observer: (balance: AssetAmount) => void,
  ): Promise<Subscription> {
    const chainConfig = this.configService.getChainConfig(chain);

    const evmClient = this.getEvmClient(chain);
    const substrate = await this.getSubstrateService(chain);
    const balanceAdapter = new BalanceAdapter({ evmClient, substrate });

    const observables = chainConfig.getAssetsConfigs().map((assetConfig) => {
      const { asset, balance } = assetConfig;
      const assetId = chainConfig.chain.getBalanceAssetId(asset);
      const balanceConfig = balance.build({
        address: address,
        asset: assetId,
      });
      return balanceAdapter.subscribeBalance(asset, balanceConfig);
    });

    const observable = merge(...observables);
    return observable.subscribe(observer);
  }
}
