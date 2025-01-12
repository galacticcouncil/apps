import { HYDRADX_SS58_PREFIX } from '@galacticcouncil/sdk';
import { decodeAddress, encodeAddress } from '@polkadot/util-crypto';

import { PublicKey } from '@solana/web3.js';

export function convertFromSol(
  h160Addr: string,
  ss58prefix = HYDRADX_SS58_PREFIX,
) {
  return encodeAddress(new PublicKey(h160Addr).toBytes(), ss58prefix);
}

export function convertToSol(ss58Addr: string) {
  const decodedBytes = decodeAddress(ss58Addr);
  return new PublicKey(decodedBytes).toBase58();
}

export function isSolanaAccount(address: string) {
  if (!address) return false;

  try {
    convertToSol(address);
    return true;
  } catch {
    return false;
  }
}
