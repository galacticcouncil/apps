import esbuild from 'esbuild';
import { esmConfig } from '../../esbuild.config.mjs';
import { cssPlugin } from '../../esbuild.plugin.mjs';

const plugins = [cssPlugin];

const options = {
  ...esmConfig,
  bundle: true,
  sourcemap: true,
  packages: 'external',
};

const ctx = await esbuild.context({ ...options, plugins });
await ctx.rebuild();
await ctx.watch();
