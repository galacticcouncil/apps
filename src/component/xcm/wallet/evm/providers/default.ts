import { ApiPromise } from '@polkadot/api';

import { EvmProvider } from '../EvmProvider';

export class DefaultEvmProvider extends EvmProvider {
  toEvmAddress(_api: ApiPromise, address: string): Promise<string> {
    return Promise.resolve(address);
  }
}
