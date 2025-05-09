import type {
  ExternalAsset,
  PoolService,
  TradeRouter,
} from '@galacticcouncil/sdk';
import type { ApiPromise } from '@polkadot/api';
import type { SingleValueData, OhlcData } from 'lightweight-charts';

export interface Account {
  name: string;
  address: string;
  provider: string;
}

export interface Chain {
  api: ApiPromise;
  ecosystem: Ecosystem;
  isTestnet: boolean;
  unifiedAddressFormat: boolean;
  poolService: PoolService;
  router: TradeRouter;
}

export enum Ecosystem {
  Kusama = 'kusama',
  Polkadot = 'polkadot',
}

export interface TradeConfig {
  slippage: string;
  slippageTwap: string;
  maxRetries: number;
}

export interface DcaConfig {
  slippage: string;
  maxRetries: number;
}

export interface ExternalAssetConfig {
  state: {
    tokens: {
      testnet: ExternalAsset[];
      mainnet: ExternalAsset[];
    };
  };
  version: number;
}

export type XStore = { [K: string]: XItem[] };

export type XItem = {
  data: `0x${string}`;
  hash: `0x${string}`;
  nonce: number;
  to: `0x${string}`;
};

export type TradeData = {
  primary: SingleValueData[];
  primaryOhlc: OhlcData[];
  secondary: SingleValueData[];
};
