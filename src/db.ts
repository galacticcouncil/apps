import { TradeRouter } from '@galacticcouncil/sdk';
import { ApiPromise } from '@polkadot/api';
import { defAtom } from '@thi.ng/atom/atom';
import { defCursor } from '@thi.ng/atom/cursor';

export interface Api {
  promise: ApiPromise;
  router: TradeRouter;
  node: string;
}

export interface State {
  api: Api;
  ready: Boolean;
}

export const db = defAtom<State>({
  api: null,
  ready: false,
});

export const apiCursor = defCursor(db, ['api']);
export const readyCursor = defCursor(db, ['ready']);
