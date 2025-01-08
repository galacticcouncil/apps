export enum WalletProvider {
  'metamask',
  'talisman',
  'talisman-evm',
  'subwallet-js',
  'subwallet-evm',
  'polkadot-js',
  'nova-wallet',
  'trustwallet',
  'bravewallet',
  'coinbasewallet',
  'rabbywallet',
  'nightly',
  'nightly-evm',
  'phantom',
  'solflare',
  'enkrypt',
  'manta-wallet-js',
  'fearless-wallet',
  'polkagate',
  'aleph-zero',
  'walletconnect',
  'walletconnect-evm',
  'external',
}

export const EVM_PROVIDERS: WalletProvider[] = [
  WalletProvider.metamask,
  WalletProvider['talisman-evm'],
  WalletProvider['subwallet-evm'],
  WalletProvider['nightly-evm'],
  WalletProvider['coinbasewallet'],
  WalletProvider['rabbywallet'],
  WalletProvider.bravewallet,
  WalletProvider['walletconnect-evm'],
];

export const SUBSTRATE_PROVIDERS: WalletProvider[] = [
  WalletProvider.talisman,
  WalletProvider['subwallet-js'],
  WalletProvider.enkrypt,
  WalletProvider['polkadot-js'],
  WalletProvider['nova-wallet'],
  WalletProvider.nightly,
  WalletProvider['manta-wallet-js'],
  WalletProvider['fearless-wallet'],
  WalletProvider.polkagate,
  WalletProvider['aleph-zero'],
  WalletProvider.walletconnect,
];

export const SUBSTRATE_H160_PROVIDERS: WalletProvider[] = [
  WalletProvider['subwallet-js'],
  WalletProvider.talisman,
];

export const SOLANA_PROVIDERS: WalletProvider[] = [
  WalletProvider.phantom,
  WalletProvider.solflare,
];
