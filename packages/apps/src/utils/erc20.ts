import { Abi } from '@galacticcouncil/xcm-core';
import { XCall, XCallEvm } from '@galacticcouncil/xcm-sdk';

import { decodeFunctionData } from 'viem';

const APPROVE_LEADING_BYTES = '0x095ea7b3';

export function isApprove(call: XCall): boolean {
  const { abi, data } = call as XCallEvm;
  if (!abi) {
    return false;
  }

  const { functionName } = decodeFunctionData({
    abi: JSON.parse(abi),
    data: data,
  });
  return functionName === 'approve' && data.startsWith(APPROVE_LEADING_BYTES);
}

export function parseSpender(data: `0x${string}`): string {
  const { args } = decodeFunctionData({
    abi: Abi.Erc20,
    data: data,
  });
  const [spender] = args;
  return spender as string;
}

export function parseAmount(data: `0x${string}`): bigint {
  const { args } = decodeFunctionData({
    abi: Abi.Erc20,
    data: data,
  });
  const [_spender, amount] = args;
  return amount as bigint;
}
