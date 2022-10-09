import { PoolAsset, TradeRouter } from '@galacticcouncil/sdk';
import { ApiPromise } from '@polkadot/api';
import { defAtom } from '@thi.ng/atom/atom';
import { defCursor } from '@thi.ng/atom/cursor';
import type { RouterLocation } from '@vaadin/router';

export interface Trade {
  assets: PoolAsset[];
  assetIn: string;
  assetOut: string;
}

export interface Api {
  promise: ApiPromise;
  router: TradeRouter;
  node: string;
}

export interface State {
  api: Api;
  location: RouterLocation;
  ready: Boolean;
  trade: Trade;
}

export const db = defAtom<State>({
  api: null,
  location: null,
  ready: false,
  trade: null,
});

export const apiCursor = defCursor(db, ['api']);
export const locationCursor = defCursor(db, ['location']);
export const readyCursor = defCursor(db, ['ready']);
export const tradeCursor = defCursor(db, ['trade']);
