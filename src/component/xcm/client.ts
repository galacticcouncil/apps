import {
  createPublicClient,
  createWalletClient,
  defineChain,
  http,
  webSocket,
  custom,
} from 'viem';

import { mainnet, moonbeam } from 'viem/chains';

const acalaWs = webSocket('wss://eth-rpc-acala.aca-api.network/ws');
const moonbeamRpc = http('https://rpc.api.moonbeam.network');

const acala = defineChain({
  id: 1934,
  name: 'Acala',
  network: 'acala',
  nativeCurrency: {
    decimals: 12,
    name: 'ACA',
    symbol: 'ACA',
  },
  rpcUrls: {
    public: {
      http: ['https://eth-rpc-acala.aca-api.network'],
      webSocket: ['wss://eth-rpc-acala.aca-api.network'],
    },
    default: {
      http: ['https://eth-rpc-acala.aca-api.network'],
      webSocket: ['wss://eth-rpc-acala.aca-api.network'],
    },
  },
  testnet: false,
});

const moonbeam2 = defineChain({
  id: 1284,
  name: 'Moonbeam',
  network: 'moonbeam',
  nativeCurrency: {
    decimals: 18,
    name: 'GLMR',
    symbol: 'GLMR',
  },
  rpcUrls: {
    public: {
      http: ['https://rpc.api.moonbeam.network'],
      webSocket: ['wss://rpc.api.moonbeam.network'],
    },
    default: {
      http: ['https://rpc.api.moonbeam.network'],
      webSocket: ['wss://rpc.api.moonbeam.network'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Moonscan',
      url: 'https://moonscan.io',
    },
    etherscan: {
      name: 'Moonscan',
      url: 'https://moonscan.io',
    },
  },
  contracts: {
    multicall3: {
      address: '0xcA11bde05977b3631167028862bE2a173976CA11',
      blockCreated: 609002,
    },
  },
  testnet: false,
});

export const acalaWalletClient = createWalletClient({
  chain: acala,
  transport: acalaWs,
});

export const moonbeamWalletClient = createWalletClient({
  account: '0x26f5c2370e563e9f4dda435f03a63d7c109d8d04',
  chain: moonbeam,
  transport: moonbeamRpc,
});

export const moonbeamPublicClient = createPublicClient({
  chain: moonbeam,
  transport: moonbeamRpc,
});

export const publicClient = createPublicClient({
  chain: mainnet,
  transport: http(),
});
