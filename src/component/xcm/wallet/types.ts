import {
  ContractConfig,
  SubstrateQueryConfig,
} from '@moonbeam-network/xcm-builder';
import { Asset, AnyChain } from '@moonbeam-network/xcm-types';

import { Observable } from 'rxjs';

export interface Balance {
  key: string;
  amount: bigint;
}

export interface BalanceParams {
  asset: Asset;
  chain: AnyChain;
  config: ContractConfig | SubstrateQueryConfig;
}

export interface BalanceAdapter {
  getObservable(assetKey: string): Observable<Balance>;
  getBalance(assetKey: string): Promise<Balance>;
}
