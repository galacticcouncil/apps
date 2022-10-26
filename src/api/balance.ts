import { Amount, BigNumber, ZERO } from '@galacticcouncil/sdk';
import { getAssetMetadata } from './asset';
import { chainCursor } from '../db';
import { SYSTEM_ASSET_ID } from '../utils/chain';

export const EMPTY_AMOUNT = { amount: ZERO, decimals: 0 } as Amount;

function calculateFreeBalance(free: BigNumber, miscFrozen: BigNumber, feeFrozen: BigNumber): BigNumber {
  const maxFrozenBalance = miscFrozen.gt(feeFrozen) ? miscFrozen : feeFrozen;
  return free.minus(maxFrozenBalance);
}

async function getSystemAccountBalance(address: string): Promise<BigNumber> {
  const api = chainCursor.deref().api;
  const res = await api.query.system.account(address);
  const freeBalance = new BigNumber(res.data.free.toHex());
  const miscFrozenBalance = new BigNumber(res.data.miscFrozen.toHex());
  const feeFrozenBalance = new BigNumber(res.data.feeFrozen.toHex());
  return calculateFreeBalance(freeBalance, miscFrozenBalance, feeFrozenBalance);
}

async function getTokenAccountBalance(address: string, assetId: string): Promise<BigNumber> {
  const api = chainCursor.deref().api;
  const res = (await api.query.tokens.accounts(address, assetId)) as any;
  const freeBalance = new BigNumber(res.free.toHex());
  const reservedBalance = new BigNumber(res.reserved.toHex());
  const frozenBalance = new BigNumber(res.frozen.toHex());
  return calculateFreeBalance(freeBalance, reservedBalance, frozenBalance);
}

export async function getAccountBalance(address: string, assetId: string): Promise<Amount> {
  if (assetId == null) {
    return EMPTY_AMOUNT;
  }

  const balance =
    assetId === SYSTEM_ASSET_ID
      ? await getSystemAccountBalance(address)
      : await getTokenAccountBalance(address, assetId);
  const metadata = await getAssetMetadata(assetId);
  const metadataJson = metadata.toHuman();
  return { amount: balance, decimals: metadataJson.decimals } as Amount;
}
