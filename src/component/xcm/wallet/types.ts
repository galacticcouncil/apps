import {
  ContractConfig,
  SubstrateQueryConfig,
} from '@moonbeam-network/xcm-builder';
import { WalletClient } from 'viem';

export interface Balance {
  key: string;
  balance: bigint;
}

export interface BalanceQueryConfig {
  [key: string]: SubstrateQueryConfig | ContractConfig;
}

export interface XcmWalletClient {
  get(address: string): WalletClient;
}
