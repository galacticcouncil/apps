import { Transfer } from './types';

export class WormholeApi {
  private _wormholeApi: string;

  public constructor(wormholeApi: string) {
    this._wormholeApi = wormholeApi;
  }

  async getOperations(address: string): Promise<Transfer[]> {
    const url =
      [this._wormholeApi, '/api/v1/operations', '?'].join('') +
      new URLSearchParams({
        address: address,
        page: '0',
        pageSize: '50',
        sortOrder: 'DESC',
      }).toString();

    const data = await fetch(url, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'GET',
    });

    const dataJson = await data.json();
    return dataJson['operations'] as Transfer[];
  }
}
