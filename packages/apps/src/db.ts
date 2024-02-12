import { IPoolService, TradeRouter } from '@galacticcouncil/sdk';
import { Wallet } from '@galacticcouncil/xcm-sdk';
import { ApiPromise } from '@polkadot/api';
import { Cursor } from '@thi.ng/atom';
import { defAtom } from '@thi.ng/atom/atom';
import { defCursor } from '@thi.ng/atom/cursor';
import { TLRUCache } from '@thi.ng/cache';
import { SingleValueData } from 'lightweight-charts';

import { getObj, setObj } from './storage';

const TRADE_DATA_OPTS = { ttl: 1000 * 60 * 60 };

export const DEFAULT_TRADE_CONFIG: TradeConfig = {
  slippage: '1',
  slippageTwap: '3',
  maxRetries: 5,
};

export const DEFAULT_DCA_CONFIG: DcaConfig = {
  slippage: '3',
};

export type TradeData = {
  primary: SingleValueData[];
  secondary: SingleValueData[];
};

export interface TradeConfig {
  slippage: string;
  slippageTwap: string;
  maxRetries: number;
}

export interface DcaConfig {
  slippage: string;
}

export enum Ecosystem {
  Kusama = 'kusama',
  Polkadot = 'polkadot',
  Testnet = 'testnet',
}

export interface Chain {
  api: ApiPromise;
  ecosystem: Ecosystem;
  poolService: IPoolService;
  router: TradeRouter;
}

export interface Account {
  name: string;
  address: string;
  provider: string;
}

interface State {
  account: Account;
  chain: Chain;
  dca: {
    config: DcaConfig;
  };
  trade: {
    config: TradeConfig;
    data: TLRUCache<string, TradeData>;
  };
  wallet: Wallet;
}

const db = defAtom<State>({
  account: null,
  chain: null,
  dca: {
    config: null,
  },
  trade: {
    config: null,
    data: new TLRUCache<string, TradeData>(null, TRADE_DATA_OPTS),
  },
  wallet: null,
});

// Cursors (Direct & Immutable access to a nested value)
export const AccountCursor = defCursor(db, ['account']);
export const ChainCursor = defCursor(db, ['chain']);
export const DcaConfigCursor = defCursor(db, ['dca', 'config']);
export const TradeConfigCursor = defCursor(db, ['trade', 'config']);
export const TradeDataCursor = defCursor(db, ['trade', 'data']);
export const WalletCursor = defCursor(db, ['wallet']);

// Storage keys
const ACCOUNT_KEY = 'trade.account';
const TRADE_CONFIG_KEY = 'trade.settings';
const DCA_CONFIG_KEY = 'dca.settings';

// Load current config
const currentAccount = getObj<Account>(ACCOUNT_KEY);
const currentTradeConfig = getObj<TradeConfig>(TRADE_CONFIG_KEY);
const currentDcaConfig = getObj<DcaConfig>(DCA_CONFIG_KEY);

// Initialize state from current config
AccountCursor.reset(currentAccount);
TradeConfigCursor.reset({ ...DEFAULT_TRADE_CONFIG, ...currentTradeConfig });
DcaConfigCursor.reset({ ...DEFAULT_DCA_CONFIG, ...currentDcaConfig });

/**
 * Create watchdog to update storage on state change
 *
 * @param cursor - Database cursor
 * @param key - Storage key
 * @param watchId - Unique watch id
 */
function addWatch<T>(cursor: Cursor<T>, key: string, watchId: string) {
  cursor.addWatch(watchId, (id, prev, curr) => {
    console.log(`${id}: ${JSON.stringify(prev)} -> ${JSON.stringify(curr)}`);
    setObj(key, curr);
  });
}

// Register watchdogs
addWatch(AccountCursor, ACCOUNT_KEY, 'account-update');
addWatch(TradeConfigCursor, TRADE_CONFIG_KEY, 'trade-settings-update');
addWatch(DcaConfigCursor, DCA_CONFIG_KEY, 'dca-settings-update');
