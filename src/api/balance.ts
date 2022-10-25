import { BigNumber } from '@galacticcouncil/sdk';
import { ApiPromise } from '@polkadot/api';
import { SYSTEM_ASSET_ID } from '../utils/chain';
import '@polkadot/api-augment';

function calculateFreeBalance(free: BigNumber, miscFrozen: BigNumber, feeFrozen: BigNumber): BigNumber {
  const maxFrozenBalance = miscFrozen.gt(feeFrozen) ? miscFrozen : feeFrozen;
  return free.minus(maxFrozenBalance);
}

export async function getAssetBalance(api: ApiPromise, account: string, id: string): Promise<BigNumber> {
  if (id == SYSTEM_ASSET_ID) {
    const res = await api.query.system.account(account);
    const freeBalance = new BigNumber(res.data.free.toHex());
    const miscFrozenBalance = new BigNumber(res.data.miscFrozen.toHex());
    const feeFrozenBalance = new BigNumber(res.data.feeFrozen.toHex());
    return calculateFreeBalance(freeBalance, miscFrozenBalance, feeFrozenBalance);
  }

  const res = (await api.query.tokens.accounts(account, id)) as any;
  const freeBalance = new BigNumber(res.free.toHex());
  const reservedBalance = new BigNumber(res.reserved.toHex());
  const frozenBalance = new BigNumber(res.frozen.toHex());
  return calculateFreeBalance(freeBalance, reservedBalance, frozenBalance);
}
