import { chainsMap } from '@galacticcouncil/xcm-cfg';
import { EvmChain } from '@galacticcouncil/xcm-core';

/**
 * Find Wormhole chain by id
 *
 * @param wormholeId - Wormhole chain id
 * @returns Wormhole EVM chain
 */
export function getChainById(wormholeId: number): EvmChain {
  return Array.from(chainsMap.values()).find(
    (c) => c.isWormholeChain() && c.getWormholeId() === wormholeId,
  ) as EvmChain;
}
