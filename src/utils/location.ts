import type { HydradxRuntimeXcmAssetLocation } from '@polkadot/types/lookup';

export function parseLocation(
  location: HydradxRuntimeXcmAssetLocation,
): number {
  if (!location) {
    return null;
  }

  const type = location.interior.type;
  if (type == 'Here') {
    return null;
  }

  const interior = location.interior[`as${type}`];
  return !Array.isArray(interior)
    ? interior.asParachain.unwrap().toNumber()
    : interior
        .find((el) => el.isParachain)
        .asParachain.unwrap()
        .toNumber();
}
