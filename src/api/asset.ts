import type { AssetMetadata } from '@polkadot/types/interfaces';
import { Amount, BigNumber, ZERO } from '@galacticcouncil/sdk';
import { SYSTEM_ASSET_ID } from '../utils/chain';
import { chainCursor, Account } from '../db';
import '@polkadot/api-augment';

export const EMPTY_AMOUNT = { amount: ZERO, decimals: 0 } as Amount;

function calculateFreeBalance(free: BigNumber, miscFrozen: BigNumber, feeFrozen: BigNumber): BigNumber {
  const maxFrozenBalance = miscFrozen.gt(feeFrozen) ? miscFrozen : feeFrozen;
  return free.minus(maxFrozenBalance);
}

async function getAssetMetadata(tokenKey: string): Promise<AssetMetadata> {
  const api = chainCursor.deref().api;
  return await api.query.assetRegistry.assetMetadataMap<AssetMetadata>(tokenKey);
}

async function getAssetBalance(account: string, id: string): Promise<BigNumber> {
  const api = chainCursor.deref().api;
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

export async function getBalance(account: Account, asset: string): Promise<Amount> {
  if (asset) {
    const balance = await getAssetBalance(account.address, asset);
    const meta = await getAssetMetadata(asset);
    const decimals = meta.toHuman().decimals.toString();
    return { amount: balance, decimals: parseInt(decimals) } as Amount;
  }
  return EMPTY_AMOUNT;
}
