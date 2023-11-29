import { HYDRADX_SS58_PREFIX } from '@galacticcouncil/sdk';
import {
  encodeAddress,
  decodeAddress,
  blake2AsHex,
} from '@polkadot/util-crypto';
import { Buffer } from 'buffer';

export class H160 {
  private PREFIX = 'ETH\0';

  toAccount(evmAddress: string) {
    const addressBytes = Buffer.from(evmAddress.slice(2), 'hex');
    const prefixBytes = Buffer.from(this.PREFIX);
    return encodeAddress(
      new Uint8Array(
        Buffer.concat([prefixBytes, addressBytes, Buffer.alloc(8)]),
      ),
      HYDRADX_SS58_PREFIX,
    );
  }

  fromAccount(substrateAddress: string) {
    const decodedBytes = decodeAddress(substrateAddress);
    const prefixBytes = Buffer.from(this.PREFIX);
    const addressBytes = decodedBytes.slice(prefixBytes.length, -8);
    return '0x' + Buffer.from(addressBytes).toString('hex');
  }

  toEvmAddress(substrateAddress: string) {
    const addressBytes = decodeAddress(substrateAddress);
    return '0x' + Buffer.from(addressBytes.subarray(0, 20)).toString('hex');
  }

  toSubstrateAddress(evmAddress: string, prefix = HYDRADX_SS58_PREFIX) {
    const addressBytes = Buffer.from(evmAddress.slice(2), 'hex');
    const prefixBytes = Buffer.from(this.PREFIX);
    const convertBytes = Uint8Array.from(
      Buffer.concat([prefixBytes, addressBytes]),
    );
    const finalAddressHex = blake2AsHex(convertBytes, 256);
    return encodeAddress(finalAddressHex, prefix);
  }
}
