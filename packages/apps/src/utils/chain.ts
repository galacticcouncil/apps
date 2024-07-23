import { chainsMap } from '@galacticcouncil/xcm-cfg';
import { AnyChain, AnyParachain, Parachain } from '@galacticcouncil/xcm-core';

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

export function useH160AddressSpace(chain: AnyChain) {
  if (chain instanceof Parachain) {
    return chain.h160AccOnly;
  }
  return chain.isEvmChain();
}

export function useSs58AddressSpace(chain: AnyChain) {
  if (chain instanceof Parachain) {
    return !chain.h160AccOnly;
  }
  return false;
}
