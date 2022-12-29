export const SYSTEM_ASSET_ID = '0';

export function getMap(types: Record<string, string>): Map<string, string> {
  const map = new Map<string, string>();
  Object.keys(types).forEach((type) => {
    map.set(type, types[type]);
  });
  return map;
}