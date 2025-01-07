import { Abi } from '@galacticcouncil/xcm-core';
import { Call, EvmCall } from '@galacticcouncil/xcm-sdk';

import { decodeFunctionData } from 'viem';

const APPROVE_LEADING_BYTES = '0x095ea7b3';

export function isApprove(call: Call): boolean {
  const { abi, data } = call as EvmCall;
  if (!abi) {
    return false;
  }

  const { functionName } = decodeFunctionData({
    abi: JSON.parse(abi),
    data: data as `0x${string}`,
  });
  return functionName === 'approve' && data.startsWith(APPROVE_LEADING_BYTES);
}

export function parseSpender(data: string): string {
  const { args } = decodeFunctionData({
    abi: Abi.Erc20,
    data: data as `0x${string}`,
  });
  const [spender] = args;
  return spender as string;
}

export function parseAmount(data: string): bigint {
  const { args } = decodeFunctionData({
    abi: Abi.Erc20,
    data: data as `0x${string}`,
  });
  const [_spender, amount] = args;
  return amount as bigint;
}
