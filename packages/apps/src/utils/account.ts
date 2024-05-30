import { addr } from '@galacticcouncil/xcm-core';
import { u8aToHex, hexToU8a, isHex } from '@polkadot/util';
import { decodeAddress, encodeAddress } from '@polkadot/util-crypto';

import { convertFromH160 } from './evm';

export const EVM_PROVIDERS = ['metamask'];
export const EVM_NATIVE_ASSET_ID = '20';

export function convertAddressSS58(address: string, ss58prefix = 42): string {
  try {
    return encodeAddress(decodeAddress(address), ss58prefix);
  } catch {
    return null;
  }
}

export function convertToHex(address: string): string {
  try {
    return u8aToHex(decodeAddress(address));
  } catch {
    return null;
  }
}

export function isSameAddress(address1: string, address2: string): boolean {
  try {
    const sub1 = addr.isH160(address1) ? convertFromH160(address1) : address1;
    const sub2 = addr.isH160(address2) ? convertFromH160(address2) : address2;
    const decodedAddress1 = decodeAddress(sub1)?.toString();
    const decodedAddress2 = decodeAddress(sub2)?.toString();
    return decodedAddress1 === decodedAddress2;
  } catch {
    return false;
  }
}

export function isValidAddress(address: string) {
  try {
    encodeAddress(isHex(address) ? hexToU8a(address) : decodeAddress(address));
    return true;
  } catch (error) {
    return false;
  }
}
