export enum TransferScreen {
  SelectChain,
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
  fromChain: Chain;
  toChain: Chain;
  amount: string;
  asset: string;
  balance: string;
};

export const DEFAULT_TRANSFER_STATE: TransferState = {
  fromChain: { name: 'karura', asset: 'KAR' },
  toChain: { name: 'basilisk', asset: 'BSX' },
  amount: null,
  asset: 'KUSD',
  balance: null,
};

export type Chain = {
  name: string;
  asset: string;
};
