import esbuild from 'esbuild';
import { esmConfig, getPackageJson } from '../../esbuild.config.mjs';

const packageJson = getPackageJson(import.meta.url);
const peerDependencies = packageJson.peerDependencies || {};

esbuild
  .build({
    ...esmConfig,
    bundle: true,
    external: Object.keys(peerDependencies),
  })
  .catch(() => process.exit(1));
