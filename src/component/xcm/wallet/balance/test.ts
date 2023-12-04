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
import { Erc20a } from '../contracts';

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
    if (config.type === CallType.Evm) {
      const erc20 = new Erc20a(this.evmClient, config as ContractConfig);
      return this.erc20Provider.getBalance(asset, config as ContractConfig);
    }

    return this.nativeProvider.getBalance(
      asset,
      config as SubstrateQueryConfig,
    );
  }

  subscribeBalance(asset: Asset, config: BaseConfig): Observable<AssetAmount> {
    if (config.type === CallType.Evm) {
      return this.erc20Provider.subscribeBalance(
        asset,
        config as ContractConfig,
      );
    }

    return this.nativeProvider.subscribeBalance(
      asset,
      config as SubstrateQueryConfig,
    );
  }
}
