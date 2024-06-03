import esbuild from 'esbuild';
import { minifyHTMLLiteralsPlugin } from 'esbuild-plugin-minify-html-literals';
import { readdirSync, writeFileSync } from 'fs';
import { esmConfig, getPackageJson } from '../../esbuild.config.mjs';

const packageJson = getPackageJson(import.meta.url);
const peerDependencies = packageJson.peerDependencies || {};
const dependencies = packageJson.dependencies || {};

const polkadotDeps = [];
readdirSync('../../node_modules/@polkadot').forEach((pckg) => {
  polkadotDeps.push('@polkadot/' + pckg);
});

const moonbeamDeps = [];
readdirSync('../../node_modules/@moonbeam-network').forEach((pckg) => {
  moonbeamDeps.push('@moonbeam-network/' + pckg);
});

esbuild
  .build({
    ...esmConfig,
    bundle: true,
    plugins: [minifyHTMLLiteralsPlugin()],
    external: [
      ...Object.keys(dependencies),
      ...Object.keys(peerDependencies),
      ...polkadotDeps,
      ...moonbeamDeps,
    ],
  })
  .then(({ metafile }) => {
    writeFileSync('build-meta.json', JSON.stringify(metafile));
  })
  .catch(() => process.exit(1));
