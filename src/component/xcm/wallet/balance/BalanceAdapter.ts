import {
  BaseConfig,
  CallType,
  ContractConfig,
  ExtrinsicConfig,
  SubstrateQueryConfig,
} from '@moonbeam-network/xcm-builder';
import { Asset, AssetAmount } from '@moonbeam-network/xcm-types';

import { Observable } from 'rxjs';

import { Erc20BalanceProvider } from './Erc20BalanceProvider';
import { NativeBalanceProvider } from './NativeBalanceProvider';

import { EvmClient } from '../evm';
import { SubstrateService } from '../substrate';

interface AdapterConfigs {
  evmClient?: EvmClient;
  substrate: SubstrateService;
}

export class BalanceAdapter {
  protected evmClient: EvmClient;
  protected substrate: SubstrateService;

  private erc20Provider: Erc20BalanceProvider;
  private nativeProvider: NativeBalanceProvider;

  constructor({ evmClient, substrate }: AdapterConfigs) {
    this.substrate = substrate;
    this.nativeProvider = new NativeBalanceProvider(substrate);

    if (evmClient) {
      this.evmClient = evmClient;
      this.erc20Provider = new Erc20BalanceProvider(evmClient);
    }
  }

  async getBalance(asset: Asset, config: BaseConfig): Promise<AssetAmount> {
    switch (config.type) {
      case CallType.Evm:
        return this.erc20Provider.getBalance(asset, config as ContractConfig);
      case CallType.Substrate:
        return this.nativeProvider.getBalance(
          asset,
          config as SubstrateQueryConfig,
        );
      default: {
        throw new Error('Balance provvider ' + config.type + ' not found');
      }
    }
  }

  async getFee(
    address: string,
    amount: bigint,
    feeBalance: AssetAmount,
    config: BaseConfig,
  ): Promise<AssetAmount> {
    switch (config.type) {
      case CallType.Evm:
        return this.erc20Provider.getFee(
          address,
          amount,
          feeBalance,
          config as ContractConfig,
        );
      case CallType.Substrate:
        return this.nativeProvider.getFee(
          address,
          amount,
          feeBalance,
          config as ExtrinsicConfig,
        );
      default: {
        throw new Error('Balance provvider ' + config.type + ' not found');
      }
    }
  }

  subscribeBalance(asset: Asset, config: BaseConfig): Observable<AssetAmount> {
    switch (config.type) {
      case CallType.Evm:
        return this.erc20Provider.subscribeBalance(
          asset,
          config as ContractConfig,
        );
      case CallType.Substrate:
        return this.nativeProvider.subscribeBalance(
          asset,
          config as SubstrateQueryConfig,
        );
      default: {
        throw new Error('Balance provvider ' + config.type + ' not found');
      }
    }
  }
}
