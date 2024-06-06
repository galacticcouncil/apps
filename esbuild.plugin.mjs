import { litCssPlugin } from 'esbuild-plugin-lit-css';
import { transform } from 'lightningcss';

export const cssPlugin = litCssPlugin({
  filter: /.css$/,
  transform: (css, { filePath }) => {
    const { code, map } = transform({
      filename: filePath,
      code: Buffer.from(css),
      minify: true,
      sourceMap: false,
    });
    return code;
  },
});
