import { defAtom } from '@thi.ng/atom/atom';
import { defCursorUnsafe } from '@thi.ng/atom/cursor';
import { TLRUCache } from '@thi.ng/cache';

import {
  Account,
  Chain,
  DcaConfig,
  ExternalAssetConfig,
  TradeConfig,
  TradeData,
  XStore,
  XItem,
} from './types';

const TRADE_DATA_OPTS = { ttl: 1000 * 60 * 60 };

export const TRADE_CONFIG: TradeConfig = {
  slippage: '1',
  slippageTwap: '3',
  maxRetries: 5,
};

export const DCA_CONFIG: DcaConfig = {
  slippage: '3',
  maxRetries: 5,
};

interface Schema {
  account: Account;
  chain: Chain;
  config: {
    trade: TradeConfig;
    dca: DcaConfig;
  };
  data: TLRUCache<string, TradeData>;
  external: ExternalAssetConfig;
  tx: {
    store: XStore;
    curr: XItem;
  };
}

const db = defAtom<Schema>({
  account: null,
  chain: null,
  config: {
    trade: TRADE_CONFIG,
    dca: DCA_CONFIG,
  },
  data: new TLRUCache<string, TradeData>(null, TRADE_DATA_OPTS),
  external: null,
  tx: {
    store: {},
    curr: null,
  },
});

function initCursor<T>(path: string) {
  return defCursorUnsafe<T>(db, path, { id: path });
}

// Cursors (Direct & Immutable access to a nested value)
export const AccountCursor = initCursor<Account>('account');
export const ChainCursor = initCursor<Chain>('chain');
export const DcaConfigCursor = initCursor<DcaConfig>('config.dca');
export const TradeConfigCursor = initCursor<TradeConfig>('config.trade');
export const TradeDataCursor = initCursor<TLRUCache<string, TradeData>>('data');
export const ExternalAssetCursor = initCursor<ExternalAssetConfig>('external');
export const XStoreCursor = initCursor<XStore>('tx.store');
export const XItemCursor = initCursor<XItem>('tx.curr');

// Local storage keys
export const StorageKey = {
  account: 'trade.account',
  config: {
    trade: 'trade.settings',
    dca: 'dca.settings',
  },
  tx: {
    store: 'tx.store',
  },
  external: 'external-tokens',
};
