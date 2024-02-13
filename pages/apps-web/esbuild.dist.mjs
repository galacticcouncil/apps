import esbuild from 'esbuild';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { htmlPlugin } from '@craftamap/esbuild-plugin-html';
import { parse } from 'node-html-parser';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const indexTemplate = fs.readFileSync(
  path.resolve(__dirname, 'public/index.html'),
  'utf8',
);

const indexDOM = parse(indexTemplate);
indexDOM.getElementsByTagName('script').forEach((script) => {
  if (!script.hasAttribute('id')) {
    script.remove();
  }
});

const common = {
  preserveSymlinks: true,
  treeShaking: true,
  metafile: true,
  minify: true,
  bundle: true,
  format: 'esm',
  platform: 'browser',
  target: 'esnext',
};

esbuild.build({
  ...common,
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
