export type PastTransactions = {
  date: number;
  amount: string;
  price: string;
  balance: string;
};

export type Position = {
  assetIn: string;
  assetOut: string;
  interval: string;
  amount: string;
  status: string;
  nextExecution: number;
  budget: {
    remaining: string;
    total: string;
  };
  transactions: PastTransactions[];
};

export const defaultData: Position[] = [
  {
    assetIn: 'HDX',
    assetOut: 'DAI',
    interval: 'Monthly',
    amount: '250',
    status: 'Active',
    nextExecution: 1683721069,
    budget: {
      remaining: '10',
      total: '50',
    },
    transactions: [
      { date: 125, price: '50', amount: '120', balance: '114' },
      { date: 125, price: '50', amount: '120', balance: '114' },
      { date: 125, price: '50', amount: '120', balance: '114' },
      { date: 125, price: '50', amount: '120', balance: '114' },
      { date: 125, price: '50', amount: '120', balance: '114' },
      { date: 125, price: '50', amount: '120', balance: '114' },
    ],
  },
  {
    assetIn: 'HDX',
    assetOut: 'DAI',
    interval: 'Monthly',
    amount: '250',
    status: 'Active',
    nextExecution: 1683721069,
    budget: {
      remaining: '10',
      total: '50',
    },
    transactions: [
      { date: 125, price: '50', amount: '120', balance: '114' },
      { date: 125, price: '50', amount: '120', balance: '114' },
      { date: 125, price: '50', amount: '120', balance: '114' },
    ],
  },
  {
    assetIn: 'HDX',
    assetOut: 'DAI',
    interval: 'Monthly',
    amount: '250',
    status: 'Active',
    nextExecution: 1683721069,
    budget: {
      remaining: '10',
      total: '50',
    },
    transactions: [
      { date: 125, price: '50', amount: '120', balance: '114' },
      { date: 125, price: '50', amount: '120', balance: '114' },
      { date: 125, price: '50', amount: '120', balance: '114' },
    ],
  },
];
