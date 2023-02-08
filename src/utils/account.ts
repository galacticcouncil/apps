import { decodeAddress, encodeAddress, validateAddress } from '@polkadot/util-crypto';

export function convertAddressSS58(address: string, ss58prefix: number): string {
  try {
    return encodeAddress(decodeAddress(address), ss58prefix);
  } catch {
    return null;
  }
}

export function isSameAddress(address1: string, address2: string): boolean {
  try {
    const decodedAddress1 = decodeAddress(address1)?.toString();
    const decodedAddress2 = decodeAddress(address2)?.toString();
    return decodedAddress1 === decodedAddress2;
  } catch {
    return false;
  }
}

export function isValidAddress(address: string): boolean {
  try {
    return address && validateAddress(address);
  } catch {
    return false;
  }
}
