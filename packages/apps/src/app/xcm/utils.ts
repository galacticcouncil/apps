import { XCall, XCallEvm } from '@galacticcouncil/xcm-sdk';

import { decodeFunctionData } from 'viem';

export function isApproval(call: XCall): boolean {
  const { abi, data } = call as XCallEvm;
  if (!abi) {
    return false;
  }

  const { functionName } = decodeFunctionData({
    abi: JSON.parse(abi),
    data: data,
  });
  return functionName === 'approve' && data.startsWith('0x095ea7b3');
}
