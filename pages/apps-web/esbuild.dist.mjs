import esbuild from 'esbuild';
import { copy } from 'esbuild-plugin-copy';
import { wasmLoader } from 'esbuild-plugin-wasm';
import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { htmlPlugin } from '@craftamap/esbuild-plugin-html';
import { parse } from 'node-html-parser';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const indexTemplate = readFileSync(
  resolve(__dirname, 'public/index.html'),
  'utf8',
);

const indexDOM = parse(indexTemplate);
indexDOM.getElementsByTagName('script').forEach((script) => {
  if (!script.hasAttribute('id')) {
    script.remove();
  }
});

const plugins = [
  copy({
    resolveFrom: 'cwd',
    assets: [
      {
        from: ['./public/assets/**/*'],
        to: ['./dist/assets'],
      },
    ],
  }),
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
  wasmLoader({ mode: 'deferred' }),
];

const common = {
  preserveSymlinks: true,
  treeShaking: true,
  metafile: true,
  minify: true,
  metafile: true,
  bundle: true,
  format: 'esm',
  platform: 'browser',
  target: 'esnext',
};

esbuild
  .build({
    ...common,
    entryPoints: ['src/index.ts'],
    entryNames: 'bundle-[hash]',
    outdir: 'dist/',
    plugins: plugins,
  })
  .then(({ metafile }) => {
    writeFileSync('build-meta.json', JSON.stringify(metafile));
  })
  .catch(() => process.exit(1));
