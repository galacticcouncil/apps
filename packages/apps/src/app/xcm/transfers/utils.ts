import { chainsMap } from '@galacticcouncil/xcm-cfg';
import { AnyChain, Wormhole } from '@galacticcouncil/xcm-core';

/**
 * Find Wormhole chain by id
 *
 * @param wormholeId - Wormhole chain id
 * @returns Wormhole EVM chain
 */
export function getChainById(id: number): AnyChain {
  return Array.from(chainsMap.values()).find(
    (c) => Wormhole.isKnown(c) && Wormhole.fromChain(c).getWormholeId() === id,
  );
}
