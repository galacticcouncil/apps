import { IPoolService } from '@galacticcouncil/sdk';
import { ApiProvider, Bridge } from '@galacticcouncil/bridge';
import { ApiPromise } from '@polkadot/api';
import { Cursor } from '@thi.ng/atom';
import { defAtom } from '@thi.ng/atom/atom';
import { defCursor } from '@thi.ng/atom/cursor';
import { TLRUCache } from '@thi.ng/cache';
import { getObj, setObj } from './storage';
import { SingleValueData } from 'lightweight-charts';

export const TRADE_DATA_OPTS = { ttl: 1000 * 60 * 60 };

export const DEFAULT_TRADE_CONFIG: TradeConfig = {
  slippage: '1',
};

export const DEFAULT_DCA_CONFIG: DcaConfig = {
  slippage: '1.5',
};

export type TradeData = {
  primary: SingleValueData[];
  secondary: SingleValueData[];
};

export interface TradeConfig {
  slippage: string;
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
}

export interface XChain {
  apiProvider: ApiProvider;
  bridge: Bridge;
}

export interface Account {
  name: string;
  address: string;
  provider: string;
}

export interface State {
  chain: Chain;
  xChain: XChain;
  account: Account;
  tradeSettings: TradeConfig;
  tradeData: TLRUCache<string, TradeData>;
  dcaSettings: DcaConfig;
}

const db = defAtom<State>({
  chain: null,
  xChain: null,
  account: null,
  tradeData: new TLRUCache<string, TradeData>(null, TRADE_DATA_OPTS),
  tradeSettings: null,
  dcaSettings: null,
});

// Cursors (Direct & Immutable access to a nested value)
export const chainCursor = defCursor(db, ['chain']);
export const xChainCursor = defCursor(db, ['xChain']);
export const accountCursor = defCursor(db, ['account']);
export const tradeSettingsCursor = defCursor(db, ['tradeSettings']);
export const tradeDataCursor = defCursor(db, ['tradeData']);
export const dcaSettingsCursor = defCursor(db, ['dcaSettings']);

// Storage keys
const ACCOUNT_KEY = 'trade.account';
const TRADE_SETTINGS_KEY = 'trade.settings';
const DCA_SETTINGS_KEY = 'dca.settings';

// Load storage values
const storedAccount = getObj<Account>(ACCOUNT_KEY);
const storedTradeSettings = getObj<TradeConfig>(TRADE_SETTINGS_KEY);
const storedDcaSettings = getObj<DcaConfig>(DCA_SETTINGS_KEY);

// Initialize state from storage
accountCursor.reset(storedAccount);
tradeSettingsCursor.reset(storedTradeSettings || DEFAULT_TRADE_CONFIG);
dcaSettingsCursor.reset(storedDcaSettings || DEFAULT_DCA_CONFIG);

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
addWatch(tradeSettingsCursor, TRADE_SETTINGS_KEY, 'trade-settings-update');
addWatch(dcaSettingsCursor, DCA_SETTINGS_KEY, 'dca-settings-update');
addWatch(accountCursor, ACCOUNT_KEY, 'account-update');
