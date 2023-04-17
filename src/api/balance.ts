import type { Balance } from '@polkadot/types/interfaces/runtime';
import type { Struct } from '@polkadot/types-codec';
import { Amount, BigNumber, SYSTEM_ASSET_DECIMALS, SYSTEM_ASSET_ID, ZERO } from '@galacticcouncil/sdk';
import { getAssetMetadata } from './asset';
import { chainCursor } from '../db';

interface TokensAccountData extends Struct {
  readonly free: Balance;
  readonly reserved: Balance;
  readonly frozen: Balance;
}

interface AccountInfo extends Struct {
  readonly nonce: number;
  readonly consumers: number;
  readonly providers: number;
  readonly sufficients: number;
  readonly data: AccountData;
}

interface AccountData extends Struct {
  readonly free: Balance;
  readonly reserved: Balance;
  readonly miscFrozen: Balance;
  readonly feeFrozen: Balance;
}

export const EMPTY_AMOUNT = { amount: ZERO, decimals: 0 } as Amount;
const ED_FACTOR = 0.5; // ED Factor 50%

function calculateFreeBalance(free: string, miscFrozen: string, feeFrozen: string): BigNumber {
  const freeBN = new BigNumber(free);
  const miscFrozenBN = new BigNumber(miscFrozen);
  const feeFrozenBN = new BigNumber(feeFrozen);
  const maxFrozenBN = miscFrozenBN.gt(feeFrozenBN) ? miscFrozenBN : feeFrozenBN;
  return freeBN.minus(maxFrozenBN);
}

async function getSystemAccountBalance(accountId: string): Promise<BigNumber> {
  const api = chainCursor.deref().api;
  const {
    data: { free, miscFrozen, feeFrozen },
  } = await api.query.system.account<AccountInfo>(accountId);
  return calculateFreeBalance(free.toString(), miscFrozen.toString(), feeFrozen.toString());
}

async function getTokenAccountBalance(accountId: string, tokenKey: string): Promise<BigNumber> {
  const api = chainCursor.deref().api;
  const { free, reserved, frozen } = await api.query.tokens.accounts<TokensAccountData>(accountId, tokenKey);
  return calculateFreeBalance(free.toString(), ZERO.toFixed(), frozen.toString());
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
  return { amount: balance, decimals: metadataJson?.decimals || SYSTEM_ASSET_DECIMALS } as Amount;
}

export function calculateEffectiveBalance(
  free: string,
  asset: string,
  assetEd: string,
  txFeeAsset: string,
  txFee: string
) {
  if (asset == txFeeAsset) {
    const balance = new BigNumber(free);
    const fee = new BigNumber(txFee);
    const edFactor = new BigNumber(assetEd).multipliedBy(ED_FACTOR);
    const minDeposit = fee.plus(edFactor);
    if (balance.gt(minDeposit)) {
      return balance.minus(minDeposit).toFixed();
    } else {
      return balance.toFixed();
    }
  }
  return free;
}
