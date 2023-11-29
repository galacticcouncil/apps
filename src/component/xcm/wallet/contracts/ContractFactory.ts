import { ContractConfig } from '@moonbeam-network/xcm-builder';

import { PublicClient } from 'viem';

import { Erc20 } from './Erc20';
import { XTokens } from './XTokens';

export function createContract(
  config: ContractConfig,
  signer: PublicClient,
): Erc20 | XTokens {
  if (config.module === 'Erc20') {
    return new Erc20(config, signer);
  }

  if (config.module === 'Xtokens') {
    return new XTokens(config, signer);
  }

  throw new Error(`Contract ${config.module} not found`);
}
