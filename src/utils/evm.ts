import { HYDRADX_SS58_PREFIX } from '@galacticcouncil/sdk';

import {
  decodeAddress,
  encodeAddress,
  validateAddress,
} from '@polkadot/util-crypto';

import { Buffer } from 'buffer';

const prefixBytes = Buffer.from('ETH\0');

export function isEvmAccount(address: string) {
  if (!address) return false;

  try {
    const pub = decodeAddress(address, true);
    return Buffer.from(pub.subarray(0, prefixBytes.length)).equals(prefixBytes);
  } catch {
    return false;
  }
}
