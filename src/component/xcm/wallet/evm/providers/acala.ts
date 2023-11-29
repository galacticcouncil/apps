import { ApiPromise } from '@polkadot/api';

import { EvmProvider } from '../EvmProvider';

export class AcalaEvmProvider extends EvmProvider {
  async toEvmAddress(api: ApiPromise, address: string): Promise<string> {
    const h160Addr = await api.query.evmAccounts.evmAddresses(address);
    return h160Addr.toString();
  }
}
