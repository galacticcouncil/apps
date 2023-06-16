import esbuild from 'esbuild';
import { readFileSync, readdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { htmlPlugin } from '@craftamap/esbuild-plugin-html';
import { parse } from 'node-html-parser';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const indexTemplate = readFileSync(resolve(__dirname, 'index.html'), 'utf8');
const packageJson = JSON.parse(readFileSync(resolve(__dirname, 'package.json'), 'utf-8'));

const polkadotDeps = [];
readdirSync('node_modules/@polkadot').forEach((pckg) => {
  polkadotDeps.push('@polkadot/' + pckg);
});

const acalaDeps = [];
readdirSync('node_modules/@acala-network').forEach((pckg) => {
  acalaDeps.push('@acala-network/' + pckg);
});

const indexDOM = parse(indexTemplate);
indexDOM.getElementsByTagName('script').forEach((script) => script.remove());

const common = {
  preserveSymlinks: true,
  treeShaking: true,
  minify: true,
  bundle: true,
  format: 'esm',
  platform: 'browser',
  target: 'esnext',
};

// Website bundle
esbuild.build({
  ...common,
  metafile: true,
  entryPoints: ['src/app.ts'],
  entryNames: 'bundle-[hash]',
  outdir: 'dist/',
  plugins: [
    htmlPlugin({
      files: [
        {
          entryPoints: ['src/app.ts'],
          filename: 'index.html',
          scriptLoading: 'module',
          htmlTemplate: indexDOM.toString(),
        },
      ],
    }),
  ],
});

// Library bundle
esbuild.build({
  ...common,
  entryPoints: ['src/index.ts'],
  outfile: 'dist/index.esm.js',
  external: Object.keys(packageJson.peerDependencies).concat(polkadotDeps).concat(acalaDeps),
});
