import esbuild from 'esbuild';
import { minifyHTMLLiteralsPlugin } from 'esbuild-plugin-minify-html-literals';

import { writeFileSync } from 'fs';
import { esmConfig, getPackageJson } from '../../esbuild.config.mjs';

const packageJson = getPackageJson(import.meta.url);
const peerDependencies = packageJson.peerDependencies || {};

esbuild
  .build({
    ...esmConfig,
    bundle: true,
    plugins: [minifyHTMLLiteralsPlugin()],
    external: Object.keys(peerDependencies),
  })
  .then(({ metafile }) => {
    writeFileSync('build-meta.json', JSON.stringify(metafile));
  })
  .catch(() => process.exit(1));
