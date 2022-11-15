import { TradeRouter, Transaction } from '@galacticcouncil/sdk';
import { ApiPromise } from '@polkadot/api';
import { Cursor } from '@thi.ng/atom';
import { defAtom } from '@thi.ng/atom/atom';
import { defCursor } from '@thi.ng/atom/cursor';
import { getObj, setObj } from './storage';

const DEFAULT_SLIPPAGE = '0.5';

export interface Chain {
  api: ApiPromise;
  router: TradeRouter;
  url: string;
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
  ready: Boolean;
  transaction: Transaction;
  settings: Settings;
  account: Account;
}

export const db = defAtom<State>({
  chain: null,
  ready: false,
  transaction: null,
  settings: null,
  account: null,
});

// Cursors (Direct & Immutable access to a nested value)
export const chainCursor = defCursor(db, ['chain']);
export const readyCursor = defCursor(db, ['ready']);
export const transactionCursor = defCursor(db, ['transaction']);
export const settingsCursor = defCursor(db, ['settings']);
export const accountCursor = defCursor(db, ['account']);

// Storage keys
const ACCOUNT_KEY = 'trade.account';
const SETTINGS_KEY = 'trade.settings';
const TRANSACTION_KEY = 'trade.transaction';

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

/**
 * Remove watchdog
 *
 * @param cursor - Database cursor
 * @param watchId - Unique watch id
 */
function removeWatch<T>(cursor: Cursor<T>, watchId: string) {
  cursor.removeWatch(watchId);
}

/**
 * Initialized the storage with default values and merges them with
 * local storage entries
 *
 * @returns cleanup callback
 */
export const initDb = () => {
  db.reset({
    chain: null,
    ready: false,
    transaction: null,
    settings: null,
    account: null,
  });

  // Load storage values
  const storedAccount = getObj<Account>(ACCOUNT_KEY);
  const storedSettings = getObj<Settings>(SETTINGS_KEY);
  const storedTransaction = getObj<Transaction>(TRANSACTION_KEY);

  // Initialize state from storage
  accountCursor.reset(storedAccount);
  transactionCursor.reset(storedTransaction);
  settingsCursor.resetIn(['slippage'], storedSettings?.slippage || DEFAULT_SLIPPAGE);

  // Update storage on state change
  addWatch(transactionCursor, TRANSACTION_KEY, 'transaction-update');
  addWatch(settingsCursor, SETTINGS_KEY, 'settings-update');
  addWatch(accountCursor, ACCOUNT_KEY, 'account-update');

  return () => {
    removeWatch(transactionCursor, 'transaction-update');
    removeWatch(settingsCursor, 'settings-update');
    removeWatch(accountCursor, 'account-update');
  };
};
