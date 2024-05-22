export type Transfer = {
  id: string;
  data: TransferData;
  sourceChain: TransferChain;
  targetChain: TransferChain;
  content: TransferContent;
};

type TransferData = {
  symbol: string;
  tokenAmount: string;
  usdAmount: string;
};

type TransferChain = {
  chainId: number;
  timestamp: string;
  transaction: TransferTx;
  from: `0x${string}`;
  status: string;
  to: `0x${string}`;
};

type TransferTx = {
  txHash: `0x${string}`;
};

type TransferContent = {
  standarizedProperties: TransferProps;
};

type TransferProps = {
  fromAddress: `0x${string}`;
  fromChain: number;
  toAddress: `0x${string}`;
  toChain: number;
};
