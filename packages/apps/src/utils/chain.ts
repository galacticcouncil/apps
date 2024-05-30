import { chainsMap } from '@galacticcouncil/xcm-cfg';
import { AnyParachain } from '@galacticcouncil/xcm-core';

import { Ecosystem } from '../db';

const chains = Array.from(chainsMap.values());

export function getChainKey(paraId: number, ecosystem: Ecosystem) {
  const chainEcosystem = ecosystem ?? Ecosystem.Polkadot;
  const chain = chains.find(
    (chain: AnyParachain) =>
      chain.parachainId === paraId &&
      chain.ecosystem.toString() === chainEcosystem,
  );
  if (chain) {
    return chain.key;
  }
  return null;
}
