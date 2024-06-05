import esbuild from 'esbuild';
import minifyHtml from 'esbuild-plugin-lit-minify-html';

import { writeFileSync } from 'fs';
import { esmConfig } from '../../esbuild.config.mjs';

esbuild
  .build({
    ...esmConfig,
    bundle: true,
    plugins: [minifyHtml()],
    packages: 'external',
  })
  .then(({ metafile }) => {
    writeFileSync('build-meta.json', JSON.stringify(metafile));
  })
  .catch(() => process.exit(1));
