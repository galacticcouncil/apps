import { PolkadotRegistry } from '@galacticcouncil/sdk';

const registry = new PolkadotRegistry();
const chains = registry.getChains();

export function getChainId(paraId: number) {
  const chain = chains.find((chain) => chain.paraID === paraId);
  if (chain) {
    return chain.id;
  }
  return null;
}
