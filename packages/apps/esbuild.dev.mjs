import esbuild from 'esbuild';
import { litCssPlugin } from '@detra-lab/esbuild-plugin-lit-css';
import { readdirSync } from 'fs';
import { esmConfig, getPackageJson } from '../../esbuild.config.mjs';

const packageJson = getPackageJson(import.meta.url);
const peerDependencies = packageJson.peerDependencies || {};
const dependencies = packageJson.dependencies || {};

const polkadotDeps = [];
readdirSync('../../node_modules/@polkadot').forEach((pckg) => {
  polkadotDeps.push('@polkadot/' + pckg);
});

const plugins = [litCssPlugin({ debug: false })];

const options = {
  ...esmConfig,
  bundle: true,
  sourcemap: true,
  external: [
    ...Object.keys(dependencies),
    ...Object.keys(peerDependencies),
    ...polkadotDeps,
  ],
};

const ctx = await esbuild.context({ ...options, plugins });
await ctx.rebuild();
await ctx.watch();
