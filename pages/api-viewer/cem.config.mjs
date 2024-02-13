export default {
  /** Globs to analyze (Only source code supported!!!) */
  globs: ['../../packages/ui/src/**/*.ts'],
  /** Globs to exclude */
  exclude: ['public/index.js'],
  /** Directory to output CEM to */
  outdir: 'public',
  /** Run in dev mode, provides extra logging */
  dev: false,
  /** Run in watch mode, runs on file changes */
  watch: true,
  /** Include third party custom elements manifests */
  dependencies: false,
  /** Enable special handling for litelement */
  litelement: true,
};
