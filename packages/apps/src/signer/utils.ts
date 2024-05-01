import {
  AnyEvmChain,
  EvmParachain,
  Parachain,
} from '@galacticcouncil/xcm-core';
import { XCall, XCallEvm } from '@galacticcouncil/xcm-sdk';
import type { ISubmittableResult } from '@polkadot/types/types';
import { getWalletBySource } from '@talismn/connect-wallets';

import { convertToH160, DISPATCH_ADDRESS } from 'utils/evm';
import { TxInfo } from './types';

export async function signAndSend(
  chain: Parachain,
  tx: TxInfo,
  onStatusChange: (status: ISubmittableResult) => void,
  onError: (error: unknown) => void,
) {
  const { account, transaction } = tx;
  const { address, provider } = account;

  const api = await chain.api;
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
  chain: AnyEvmChain,
  txInfo: TxInfo,
  onTransactionSend: (hash: string) => void,
  onTransactionReceipt: (receipt: any) => void,
  onError: (error: unknown) => void,
) {
  const { account, transaction } = txInfo;
  const { address } = account;
  const { client } = chain;

  const evmAddress = convertToH160(address);
  const provider = client.getProvider();
  const signer = client.getSigner(evmAddress);
  await signer.switchChain({ id: client.chain.id });

  let data: `0x${string}` = null;
  let txHash: `0x${string}` = null;

  if (chain instanceof EvmParachain) {
    try {
      const api = await chain.api;
      const extrinsic = api.tx(transaction.hex);
      data = extrinsic.inner.toHex();
      console.log(extrinsic.inner.toHuman());
    } catch (error) {}
  }

  if (data) {
    const [gas, gasPrice] = await Promise.all([
      provider.estimateGas({
        account: evmAddress as `0x${string}`,
        chain: client.chain,
        data: data,
        to: DISPATCH_ADDRESS as `0x${string}`,
      }),
      provider.getGasPrice(),
    ]);

    const onePrc = gasPrice / 100n;
    const gasPricePlus = gasPrice + onePrc;

    txHash = await signer.sendTransaction({
      account: evmAddress as `0x${string}`,
      chain: client.chain,
      data: data,
      kzg: undefined,
      maxPriorityFeePerGas: gasPricePlus,
      maxFeePerGas: gasPricePlus,
      gasLimit: (gas * 11n) / 10n,
      to: DISPATCH_ADDRESS as `0x${string}`,
    });
  } else {
    const xcall = transaction.get<XCall>();
    const { data, to, value } = xcall as XCallEvm;

    txHash = await signer.sendTransaction({
      account: evmAddress as `0x${string}`,
      chain: client.chain,
      data: data,
      kzg: undefined,
      to: to as `0x${string}`,
      value: value,
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
