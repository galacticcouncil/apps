import { hexToU8a, isHex, u8aToHex } from '@polkadot/util';
import {
  decodeAddress,
  encodeAddress,
  validateAddress,
} from '@polkadot/util-crypto';

import { HYDRADX_SS58_PREFIX } from '@galacticcouncil/sdk';

import { Buffer } from 'buffer';

const ETH_PREFIX = 'ETH\0';

export const EVM_PROVIDERS = ['metamask'];
export const EVM_CHAINS = ['hydradx', 'moonbeam'];

export function convertAddressSS58(
  address: string,
  ss58prefix = HYDRADX_SS58_PREFIX,
): string {
  try {
    return encodeAddress(decodeAddress(address), ss58prefix);
  } catch {
    return null;
  }
}

export function convertFromH160(
  evmAddress: string,
  ss58prefix = HYDRADX_SS58_PREFIX,
) {
  const addressBytes = Buffer.from(evmAddress.slice(2), 'hex');
  const prefixBytes = Buffer.from(ETH_PREFIX);
  return encodeAddress(
    new Uint8Array(Buffer.concat([prefixBytes, addressBytes, Buffer.alloc(8)])),
    ss58prefix,
  );
}

export function convertToH160(address: string) {
  const decodedBytes = decodeAddress(address);
  const prefixBytes = Buffer.from(ETH_PREFIX);
  const addressBytes = decodedBytes.slice(prefixBytes.length, -8);
  return '0x' + Buffer.from(addressBytes).toString('hex');
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
    const sub1 = isEthAddress(address1) ? convertFromH160(address1) : address1;
    const sub2 = isEthAddress(address2) ? convertFromH160(address2) : address2;
    const decodedAddress1 = decodeAddress(sub1)?.toString();
    const decodedAddress2 = decodeAddress(sub2)?.toString();
    return decodedAddress1 === decodedAddress2;
  } catch {
    return false;
  }
}

export function isValidAddress(address: string): boolean {
  try {
    return validateAddress(address);
  } catch {
    return false;
  }
}

export function isNativeAddress(address: string) {
  try {
    encodeAddress(isHex(address) ? hexToU8a(address) : decodeAddress(address));
    return true;
  } catch (error) {
    return false;
  }
}

export function isEthAddress(address: string) {
  if (address) {
    return address.length === 42 && address.startsWith('0x');
  }
  return false;
}

export function isEvmAccount(address: string) {
  if (!address) return false;

  try {
    const prefixBytes = Buffer.from(ETH_PREFIX);
    const pub = decodeAddress(address, true);
    return Buffer.from(pub.subarray(0, prefixBytes.length)).equals(prefixBytes);
  } catch {
    return false;
  }
}
