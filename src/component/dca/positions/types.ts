export type DcaStatus = {
  type: string;
  err?: string;
  desc?: string;
};

export type DcaTransactions = {
  date: number;
  amount: string;
  price: string;
  balance: string;
};

export type DcaPosition = {
  id: number;
  assetIn: string;
  assetOut: string;
  start: number;
  interval: number;
  amount: string;
  status: DcaStatus;
  transactions: DcaTransactions[];
};
