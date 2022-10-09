import { ParamValue } from '@vaadin/router';
import { createApi } from './client/api';

export async function getChains(onSuccess: (options: []) => void) {
  await fetch(`assets/data/config.json`)
    .then((r) => r.json())
    .then((data) => {
      const options = data.chains.sort(function (a: { name: string }, b: { name: string }) {
        return a.name.localeCompare(b.name);
      });
      onSuccess(options);
    });
}

export async function changeApi(chain: ParamValue, chainOptions: any[]) {
  const rpc = chainOptions.filter((opt: { name: string; rpc: string }) => opt.name === chain.toString())[0].rpc;
  createApi(rpc, () => {});
}
