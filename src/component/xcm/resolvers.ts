import { EvmResolver } from '@galacticcouncil/xcm-sdk';

export const acalaEvmResolver: EvmResolver = async (
  api: any,
  address: string,
) => {
  const h160Addr = await api.query.evmAccounts.evmAddresses(address);
  return h160Addr.toString();
};
