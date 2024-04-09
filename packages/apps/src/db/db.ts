import { Wallet } from '@galacticcouncil/xcm-sdk';

import { Cursor } from '@thi.ng/atom';
import { defAtom } from '@thi.ng/atom/atom';
import { defCursor } from '@thi.ng/atom/cursor';
import { TLRUCache } from '@thi.ng/cache';

import { getObj, setObj } from './storage';
import {
  Account,
  Chain,
  DcaConfig,
  ExternalAssetConfig,
  TradeConfig,
  TradeData,
} from './types';

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
  config: {
    trade: TradeConfig;
    dca: DcaConfig;
    external: ExternalAssetConfig;
  };
  data: {
    trade: TLRUCache<string, TradeData>;
  };
  wallet: Wallet;
}

const db = defAtom<State>({
  account: null,
  chain: null,
  config: {
    trade: null,
    dca: null,
    external: null,
  },
  data: {
    trade: new TLRUCache<string, TradeData>(null, TRADE_DATA_OPTS),
  },
  wallet: null,
});

export const Database = {
  account: defCursor(db, ['account']),
  chain: defCursor(db, ['chain']),
  config: {
    dca: defCursor(db, ['config', 'dca']),
    external: defCursor(db, ['config', 'external']),
    trade: defCursor(db, ['config', 'trade']),
  },
  data: {
    trade: defCursor(db, ['data', 'trade']),
  },
};

export const DatabaseStorageKey = {
  account: 'trade.account',
  config: {
    dca: 'dca.settings',
    trade: 'trade.settings',
    external: 'external-tokens',
  },
};

// Cursors (Direct & Immutable access to a nested value)
export const AccountCursor = defCursor(db, ['account']);
export const ChainCursor = defCursor(db, ['chain']);
export const DcaConfigCursor = defCursor(db, ['config', 'dca']);
export const ExternalAssetCursor = defCursor(db, ['config', 'external']);
export const TradeConfigCursor = defCursor(db, ['config', 'trade']);
export const TradeDataCursor = defCursor(db, ['data', 'trade']);
export const WalletCursor = defCursor(db, ['wallet']);

// Storage keys
const ACCOUNT_KEY = 'trade.account';
const TRADE_CONFIG_KEY = 'trade.settings';
const DCA_CONFIG_KEY = 'dca.settings';
const EXTERNAL_TOKENS_KEY = 'external-tokens';

export const StorageKeys = {
  ACCOUNT_KEY,
  TRADE_CONFIG_KEY,
  DCA_CONFIG_KEY,
  EXTERNAL_TOKENS_KEY,
};

// Load current config
const currentAccount = getObj<Account>(ACCOUNT_KEY);
const currentTradeConfig = getObj<TradeConfig>(TRADE_CONFIG_KEY);
const currentDcaConfig = getObj<DcaConfig>(DCA_CONFIG_KEY);
const externalAssetConfig = getObj<ExternalAssetConfig>(EXTERNAL_TOKENS_KEY);

// Initialize state from current config
AccountCursor.reset(currentAccount);
ExternalAssetCursor.reset(externalAssetConfig);
DcaConfigCursor.reset({ ...DEFAULT_DCA_CONFIG, ...currentDcaConfig });
TradeConfigCursor.reset({ ...DEFAULT_TRADE_CONFIG, ...currentTradeConfig });

/**
 * Create watchdog to update storage on state change
 *
 * @param cursor - Database cursor
 * @param key - Storage key
 * @param watchId - Unique watch id
 */
function addWatch<T>(cursor: Cursor<T>, key: string, watchId: string) {
  cursor.addWatch(watchId, (id, prev, curr) => {
    const prevJson = JSON.stringify(prev);
    const currJson = JSON.stringify(curr);
    if (prevJson !== currJson) {
      console.log(`${id}: ${prevJson} -> ${currJson}`);
      setObj(key, curr);
    }
  });
}

// Register watchdogs
addWatch(AccountCursor, ACCOUNT_KEY, 'account-update');
addWatch(DcaConfigCursor, DCA_CONFIG_KEY, 'dca-settings-update');
addWatch(TradeConfigCursor, TRADE_CONFIG_KEY, 'trade-settings-update');
addWatch(ExternalAssetCursor, EXTERNAL_TOKENS_KEY, 'external-assets-update');
