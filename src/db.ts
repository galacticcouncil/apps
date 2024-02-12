import { IPoolService, TradeRouter } from '@galacticcouncil/sdk';
import { Wallet } from '@galacticcouncil/xcm-sdk';
import { ApiPromise } from '@polkadot/api';
import { Cursor } from '@thi.ng/atom';
import { defAtom } from '@thi.ng/atom/atom';
import { defCursor } from '@thi.ng/atom/cursor';
import { TLRUCache } from '@thi.ng/cache';
import { SingleValueData } from 'lightweight-charts';

import { getObj, setObj } from './storage';

export const TRADE_DATA_OPTS = { ttl: 1000 * 60 * 60 };

export const DEFAULT_TRADE_CONFIG: TradeConfig = {
  slippage: '1',
  slippageTwap: '3',
  maxRetries: 5,
};

export const DEFAULT_DCA_CONFIG: DcaConfig = {
  slippage: '3',
  maxRetries: 7,
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
  maxRetries: number;
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

export interface State {
  account: Account;
  chain: Chain;
  tradeSettings: TradeConfig;
  tradeData: TLRUCache<string, TradeData>;
  dcaSettings: DcaConfig;
  wallet: Wallet;
}

const db = defAtom<State>({
  account: null,
  chain: null,
  dcaSettings: null,
  tradeData: new TLRUCache<string, TradeData>(null, TRADE_DATA_OPTS),
  tradeSettings: null,
  wallet: null,
});

// Cursors (Direct & Immutable access to a nested value)
export const accountCursor = defCursor(db, ['account']);
export const chainCursor = defCursor(db, ['chain']);
export const dcaSettingsCursor = defCursor(db, ['dcaSettings']);
export const tradeSettingsCursor = defCursor(db, ['tradeSettings']);
export const tradeDataCursor = defCursor(db, ['tradeData']);
export const walletCursor = defCursor(db, ['wallet']);

// Storage keys
const ACCOUNT_KEY = 'trade.account';
const TRADE_SETTINGS_KEY = 'trade.settings';
const DCA_SETTINGS_KEY = 'dca.settings';

// Load storage values
const storedAccount = getObj<Account>(ACCOUNT_KEY);
const storedDcaSettings = getObj<DcaConfig>(DCA_SETTINGS_KEY);
const storedTradeSettings = getObj<TradeConfig>(TRADE_SETTINGS_KEY);

// Initialize state from storage
accountCursor.reset(storedAccount);
dcaSettingsCursor.reset({ ...DEFAULT_DCA_CONFIG, ...storedDcaSettings });
tradeSettingsCursor.reset({ ...DEFAULT_TRADE_CONFIG, ...storedTradeSettings });

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

// Update storage on state change
addWatch(accountCursor, ACCOUNT_KEY, 'account-update');
addWatch(dcaSettingsCursor, DCA_SETTINGS_KEY, 'dca-settings-update');
addWatch(tradeSettingsCursor, TRADE_SETTINGS_KEY, 'trade-settings-update');
