import { chains } from '@galacticcouncil/xcm';
import { Ecosystem } from '@moonbeam-network/xcm-types';

export function getChainKey(paraId: number, ecosystem: Ecosystem) {
  const chainEcosystem = ecosystem ?? Ecosystem.Polkadot;
  const chain = chains.find((chain) => chain.parachainId === paraId && chain.ecosystem === chainEcosystem);
  if (chain) {
    return chain.key;
  }
  return null;
}
