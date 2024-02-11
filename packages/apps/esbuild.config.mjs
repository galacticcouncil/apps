import esbuild from 'esbuild';
import { readdirSync } from 'fs';
import { esmConfig, getPackageJson } from '../../esbuild.config.mjs';

const packageJson = getPackageJson(import.meta.url);
const peerDependencies = packageJson.peerDependencies || {};

const polkadotDeps = [];
readdirSync('../../node_modules/@polkadot').forEach((pckg) => {
  polkadotDeps.push('@polkadot/' + pckg);
});

esbuild
  .build({
    ...esmConfig,
    bundle: true,
    external: Object.keys(peerDependencies).concat(polkadotDeps),
  })
  .catch(() => process.exit(1));
