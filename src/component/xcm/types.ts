export enum TransferScreen {
  SelectChain,
  SelectToken,
  Transfer,
}

export type ScreenState = {
  active: TransferScreen;
  height: number;
};

export const DEFAULT_SCREEN_STATE: ScreenState = {
  active: TransferScreen.Transfer,
  height: null,
};

export type TransferState = {
  fromChain: string;
  toChain: string;
  asset: string;
  amount: string;
  balance: string;
};

export const DEFAULT_TRANSFER_STATE: TransferState = {
  fromChain: 'karura',
  toChain: 'basilisk',
  asset: null,
  amount: null,
  balance: null,
};

export type ChainState = {
  selector: string;
  list: string[];
  dest: string[];
  tokens: string[];
};

export const DEFAULT_CHAIN_STATE: ChainState = {
  selector: null,
  list: [],
  dest: [],
  tokens: [],
};
