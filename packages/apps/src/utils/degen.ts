import { ExternalAsset } from '@galacticcouncil/sdk';
import { ApiPromise, WsProvider } from '@polkadot/api';

const ASSETHUB_TREASURY_ADDRESS =
  '13UVJyLnbVp9RBZYFwFGyDvVd1y27Tt8tkntv6Q7JVPhFsTB';

type RawAsset = Omit<ExternalAsset, 'internalId'>;

export const fetchHubAssets = async () => {
  const provider = new WsProvider('wss://asset-hub-polkadot-rpc.n.dwellir.com');
  const api = await ApiPromise.create({ provider });

  const [dataRaw, assetsRaw] = await Promise.all([
    api.query.assets.metadata.entries(),
    api.query.assets.asset.entries(),
  ]);

  const hubAssets = new Map<string, RawAsset>();
  dataRaw.forEach(([key, dataRaw]) => {
    const id = key.args[0].toString();
    const data = dataRaw;

    const asset = assetsRaw.find((asset) => asset[0].args.toString() === id);

    const supply = asset?.[1].unwrap().supply.toString();
    const admin = asset?.[1].unwrap().admin.toString();
    const owner = asset?.[1].unwrap().owner.toString();
    const isWhiteListed =
      admin === ASSETHUB_TREASURY_ADDRESS &&
      owner === ASSETHUB_TREASURY_ADDRESS;

    hubAssets.set(id, {
      id,
      decimals: data.decimals.toNumber(),
      symbol: Buffer.from(data.symbol.toHex().slice(2), 'hex').toString('utf8'),
      name: Buffer.from(data.name.toHex().slice(2), 'hex').toString('utf8'),
      supply,
      origin: 1000,
      isWhiteListed,
      admin,
      owner,
    } as RawAsset);
  });

  api.disconnect();
  return hubAssets;
};
