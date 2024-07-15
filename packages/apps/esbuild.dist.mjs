import esbuild from 'esbuild';
import minifyHtml from 'esbuild-plugin-lit-minify-html';
import { readdirSync, writeFileSync } from 'fs';
import { esmConfig, getPackageJson } from '../../esbuild.config.mjs';
import { cssPlugin } from '../../esbuild.plugin.mjs';

const packageJson = getPackageJson(import.meta.url);
const peerDependencies = packageJson.peerDependencies || {};
const dependencies = packageJson.dependencies || {};

const polkadotDeps = [];
readdirSync('../../node_modules/@polkadot').forEach((pckg) => {
  polkadotDeps.push('@polkadot/' + pckg);
});

esbuild
  .build({
    ...esmConfig,
    bundle: true,
    minify: true,
    plugins: [cssPlugin, minifyHtml()],
    external: [
      ...Object.keys(dependencies),
      ...Object.keys(peerDependencies),
      ...polkadotDeps,
    ],
  })
  .then(({ metafile }) => {
    writeFileSync('build-meta.json', JSON.stringify(metafile));
  })
  .catch(() => process.exit(1));
