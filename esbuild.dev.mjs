import esbuild from 'esbuild';
import { fixTalismanEsm } from './talisman.mjs';

fixTalismanEsm();

/**
 * Esbuild currently only inspects the following fields in tsconfig.json files
 * See https://esbuild.github.io/content-types/#tsconfig-json
 */
esbuild.build({
  entryPoints: ['src/index.ts'],
  bundle: true,
  format: 'esm',
  platform: 'browser',
  target: 'esnext',
  preserveSymlinks: true,
  treeShaking: true,
  sourcemap: true,
  watch: process.env.ESBUILD_WATCH === 'true' && {
    onRebuild(error, result) {
      if (error) {
        console.error('watch build failed:', error);
      } else {
        console.log('watch build succeeded:', result);
      }
    },
  },
  outdir: 'out/',
});
