import esbuild from 'esbuild';
import { litCssPlugin } from '@detra-lab/esbuild-plugin-lit-css';
import { esmConfig } from '../../esbuild.config.mjs';

const plugins = [litCssPlugin({ debug: false, sourceMap: false })];

const options = {
  ...esmConfig,
  bundle: true,
  sourcemap: true,
  packages: 'external',
};

const ctx = await esbuild.context({ ...options, plugins });
await ctx.rebuild();
await ctx.watch();
