import { decodeAddress, encodeAddress } from '@polkadot/util-crypto';

export function convertAddressSS58(address: string, ss58prefix: number) {
  try {
    return encodeAddress(decodeAddress(address), ss58prefix);
  } catch {
    return null;
  }
}
