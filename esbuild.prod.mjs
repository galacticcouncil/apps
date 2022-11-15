import esbuild from 'esbuild';
import { fixTalismanEsm } from './talisman.mjs';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { htmlPlugin } from '@craftamap/esbuild-plugin-html';
import { parse } from 'node-html-parser';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const indexTemplate = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf8');
const packageJson = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'package.json'), 'utf-8'));

const indexDOM = parse(indexTemplate);
const script = indexDOM.getElementsByTagName('script')[0];
script.remove();

fixTalismanEsm();

const common = {
  entryPoints: ['src/index.ts'],
  preserveSymlinks: true,
  treeShaking: true,
  metafile: true,
  minify: true,
  bundle: true,
  format: 'esm',
  platform: 'browser',
  target: 'esnext',
};

// Website bundle
esbuild.build({
  ...common,
  entryNames: 'bundle-[hash]',
  outdir: 'dist/',
  plugins: [
    htmlPlugin({
      files: [
        {
          entryPoints: ['src/index.ts'],
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
  outfile: 'dist/index.esm.js',
  external: Object.keys(packageJson.peerDependencies),
});
