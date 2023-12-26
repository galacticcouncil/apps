import { HYDRADX_SS58_PREFIX } from '@galacticcouncil/sdk';
import { decodeAddress, encodeAddress } from '@polkadot/util-crypto';

import { Buffer } from 'buffer';

const ETH_PREFIX = 'ETH\0';

export function convertFromH160(
  h160Addr: string,
  ss58prefix = HYDRADX_SS58_PREFIX,
) {
  const addressBytes = Buffer.from(h160Addr.slice(2), 'hex');
  const prefixBytes = Buffer.from(ETH_PREFIX);
  const convertBytes = Uint8Array.from(
    Buffer.concat([prefixBytes, addressBytes, Buffer.alloc(8)]),
  );
  return encodeAddress(convertBytes, ss58prefix);
}

export function convertToH160(ss58Addr: string) {
  const decodedBytes = decodeAddress(ss58Addr);
  const prefixBytes = Buffer.from(ETH_PREFIX);
  const addressBytes = decodedBytes.slice(prefixBytes.length, -8);
  return '0x' + Buffer.from(addressBytes).toString('hex');
}

export function isEvmAccount(address: string) {
  if (!address) return false;

  try {
    const pub = decodeAddress(address, true);
    const prefixBytes = Buffer.from(ETH_PREFIX);
    return Buffer.from(pub.subarray(0, prefixBytes.length)).equals(prefixBytes);
  } catch {
    return false;
  }
}
