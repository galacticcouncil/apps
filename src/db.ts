import { TradeRouter } from '@galacticcouncil/sdk';
import { ApiProvider, Bridge } from '@galacticcouncil/bridge';
import { ApiPromise } from '@polkadot/api';
import { Cursor } from '@thi.ng/atom';
import { defAtom } from '@thi.ng/atom/atom';
import { defCursor } from '@thi.ng/atom/cursor';
import { TLRUCache } from '@thi.ng/cache';
import { getObj, setObj } from './storage';
import { SingleValueData } from 'lightweight-charts';

export const DEFAULT_SLIPPAGE = '1';
const TRADE_DATA_OPTS = { ttl: 1000 * 60 * 60 };

export type TradeData = {
  price: SingleValueData[];
  volume: SingleValueData[];
};

export interface Chain {
  api: ApiPromise;
  router: TradeRouter;
}

export interface XChain {
  apiProvider: ApiProvider;
  bridge: Bridge;
}

export interface Settings {
  slippage: string;
}

export interface Account {
  name: string;
  address: string;
  provider: string;
}

export interface State {
  chain: Chain;
  xChain: XChain;
  settings: Settings;
  account: Account;
  tradeData: TLRUCache<string, TradeData>;
}

const db = defAtom<State>({
  chain: null,
  xChain: null,
  settings: null,
  account: null,
  tradeData: new TLRUCache<string, TradeData>(null, TRADE_DATA_OPTS),
});

// Cursors (Direct & Immutable access to a nested value)
export const chainCursor = defCursor(db, ['chain']);
export const xChainCursor = defCursor(db, ['xChain']);
export const settingsCursor = defCursor(db, ['settings']);
export const accountCursor = defCursor(db, ['account']);
export const tradeDataCursor = defCursor(db, ['tradeData']);

// Storage keys
const ACCOUNT_KEY = 'trade.account';
const SETTINGS_KEY = 'trade.settings';

// Load storage values
const storedAccount = getObj<Account>(ACCOUNT_KEY);
const storedSettings = getObj<Settings>(SETTINGS_KEY);

// Initialize state from storage
accountCursor.reset(storedAccount);
settingsCursor.resetIn(['slippage'], storedSettings?.slippage || DEFAULT_SLIPPAGE);

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
addWatch(settingsCursor, SETTINGS_KEY, 'settings-update');
addWatch(accountCursor, ACCOUNT_KEY, 'account-update');
