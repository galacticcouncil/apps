import { chainsMap } from '@galacticcouncil/xcm-cfg';
import {
  AnyChain,
  AnyParachain,
  Asset,
  EvmChain,
  Parachain,
} from '@galacticcouncil/xcm-core';

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
    return chain.usesH160Acc;
  }
  return chain.isEvmChain();
}

export function useSs58AddressSpace(chain: AnyChain) {
  if (chain instanceof Parachain) {
    return !chain.usesH160Acc;
  }
  return false;
}

export function getChainAssetId(chain: AnyChain, asset: Asset) {
  if (chain instanceof Parachain) {
    return chain.getMetadataAssetId(asset) || 0;
  }
  return chain.getAssetId(asset);
}

export function getChainId(chain: AnyChain) {
  if (chain instanceof EvmChain) {
    return chain.evmChain.id;
  }
  if (chain instanceof Parachain) {
    return chain.parachainId;
  }
  throw new Error('Unsupported chain type: ' + chain);
}

export function getChainEcosystem(chain: AnyChain) {
  return chain.ecosystem.toLowerCase();
}
