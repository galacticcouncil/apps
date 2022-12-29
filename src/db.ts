import { TradeRouter } from '@galacticcouncil/sdk';
import { Bridge } from '@galacticcouncil/bridge/build';
import { ApiPromise } from '@polkadot/api';
import { Cursor } from '@thi.ng/atom';
import { defAtom } from '@thi.ng/atom/atom';
import { defCursor } from '@thi.ng/atom/cursor';
import { getObj, setObj } from './storage';

export const DEFAULT_SLIPPAGE = '0.5';

export interface Chain {
  api: ApiPromise;
  router: TradeRouter;
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
  bridge: Bridge;
  settings: Settings;
  account: Account;
}

export const db = defAtom<State>({
  chain: null,
  bridge: null,
  settings: null,
  account: null,
});

// Cursors (Direct & Immutable access to a nested value)
export const chainCursor = defCursor(db, ['chain']);
export const bridgeCursor = defCursor(db, ['bridge']);
export const settingsCursor = defCursor(db, ['settings']);
export const accountCursor = defCursor(db, ['account']);

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
