import esbuild from 'esbuild';

import { writeFileSync } from 'fs';
import { esmConfig } from '../../esbuild.config.mjs';

esbuild
  .build({
    ...esmConfig,
    bundle: true,
    //plugins: [minifyHTMLLiteralsPlugin()],
    packages: 'external',
  })
  .then(({ metafile }) => {
    writeFileSync('build-meta.json', JSON.stringify(metafile));
  })
  .catch(() => process.exit(1));
