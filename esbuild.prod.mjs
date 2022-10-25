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

const indexDOM = parse(indexTemplate);
const script = indexDOM.getElementsByTagName('script')[0];
script.remove();

fixTalismanEsm();

esbuild.build({
  entryPoints: ['src/index.ts'],
  entryNames: 'bundle-[hash]',
  bundle: true,
  format: 'esm',
  platform: 'browser',
  target: 'es2021',
  preserveSymlinks: true,
  treeShaking: true,
  metafile: true,
  minify: true,
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
