import { EvmClient, XCall } from '@galacticcouncil/xcm-sdk';
import type { ISubmittableResult } from '@polkadot/types/types';
import { ApiPromise } from '@polkadot/api';
import { getWalletBySource } from '@talismn/connect-wallets';

import { convertToH160 } from 'utils/evm';
import { TxInfo } from './types';

export const DISPATCH_ADDRESS = '0x0000000000000000000000000000000000000401';

export async function signAndSend(
  api: ApiPromise,
  tx: TxInfo,
  onStatusChange: (status: ISubmittableResult) => void,
  onError: (error: unknown) => void,
) {
  const { account, transaction } = tx;
  const { address, provider } = account;

  const extrinsic = api.tx(transaction.hex);

  const wallet = getWalletBySource(provider);
  await wallet.enable('HydraDX');
  const nextNonce = await api.rpc.system.accountNextIndex(address);

  extrinsic
    .signAndSend(
      account.address,
      { signer: wallet.signer, nonce: nextNonce },
      onStatusChange,
    )
    .catch((error: any) => {
      onError(error);
    });
}

export async function signAndSendEvm(
  api: ApiPromise,
  evmClient: EvmClient,
  txInfo: TxInfo,
  onTransactionSend: (hash: string) => void,
  onTransactionReceipt: (receipt: any) => void,
  onError: (error: unknown) => void,
) {
  const { account, transaction } = txInfo;
  const { address } = account;

  const evmAddress = convertToH160(address);
  const provider = evmClient.getProvider();
  const signer = evmClient.getSigner(evmAddress);
  await signer.switchChain({ id: evmClient.chain.id });

  let data: `0x${string}` = null;
  let txHash: `0x${string}` = null;
  try {
    const extrinsic = api.tx(transaction.hex);
    data = extrinsic.inner.toHex();
  } catch (error) {}

  if (data) {
    const [gas, gasPrice] = await Promise.all([
      provider.estimateGas({
        account: evmAddress as `0x${string}`,
        chain: evmClient.chain,
        data: data,
        to: DISPATCH_ADDRESS as `0x${string}`,
      }),
      provider.getGasPrice(),
    ]);

    txHash = await signer.sendTransaction({
      account: evmAddress as `0x${string}`,
      chain: evmClient.chain,
      data: data,
      maxPriorityFeePerGas: gasPrice,
      maxFeePerGas: gasPrice,
      to: DISPATCH_ADDRESS as `0x${string}`,
    });
  } else {
    const xcall = transaction.get<XCall>();
    txHash = await signer.sendTransaction({
      account: evmAddress as `0x${string}`,
      chain: evmClient.chain,
      data: xcall.data,
      to: xcall.to as `0x${string}`,
    });
  }

  onTransactionSend(txHash);
  provider
    .waitForTransactionReceipt({
      hash: txHash,
    })
    .then((receipt) => onTransactionReceipt(receipt))
    .catch((error: any) => {
      console.log(error);
      onError(error);
    });
}
