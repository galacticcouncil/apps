import { chains } from '@galacticcouncil/xcm';

export function getChainId(paraId: number) {
  const chain = chains.find((chain) => chain.parachainId === paraId);
  if (chain) {
    return chain.key;
  }
  return null;
}
