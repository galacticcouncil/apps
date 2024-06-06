import esbuild from 'esbuild';
import minifyHtml from 'esbuild-plugin-lit-minify-html';

import { writeFileSync } from 'fs';
import { esmConfig } from '../../esbuild.config.mjs';
import { cssPlugin } from '../../esbuild.plugin.mjs';

esbuild
  .build({
    ...esmConfig,
    bundle: true,
    plugins: [cssPlugin, minifyHtml()],
    packages: 'external',
  })
  .then(({ metafile }) => {
    writeFileSync('build-meta.json', JSON.stringify(metafile));
  })
  .catch(() => process.exit(1));
