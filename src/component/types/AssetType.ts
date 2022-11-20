import { DataType } from './DataType';

export const AssetTypes = {
  aUSD: 'Acala USD',
  BSX: 'Basilisk',
  KSM: 'Kusama',
  PHA: 'Phala',
  TNKR: 'Tinkernet',
};

export class AssetType extends DataType {
  static isValid(value: any) {
    return !!AssetTypes[value];
  }
}
