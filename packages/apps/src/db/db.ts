import { Wallet } from '@galacticcouncil/xcm-sdk';

import { Cursor } from '@thi.ng/atom';
import { defAtom } from '@thi.ng/atom/atom';
import { defCursor } from '@thi.ng/atom/cursor';
import { TLRUCache } from '@thi.ng/cache';

import { getObj, setObj } from './storage';
import { Account, Chain, DcaConfig, TradeConfig, TradeData } from './types';

const TRADE_DATA_OPTS = { ttl: 1000 * 60 * 60 };

export const DEFAULT_TRADE_CONFIG: TradeConfig = {
  slippage: '1',
  slippageTwap: '3',
  maxRetries: 5,
};

export const DEFAULT_DCA_CONFIG: DcaConfig = {
  slippage: '3',
  maxRetries: 5,
};

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

// setObj('external-tokens', {
//   state: {
//     tokens: [
//       { decimals: 10, id: '30', name: 'DED', origin: 1000, symbol: 'DED' },
//       { decimals: 10, id: '23', name: 'PINK', origin: 1000, symbol: 'PINK' },
//     ],
//   },
//   version: 0.2,
// });
