import esbuild from 'esbuild';
import http from 'node:http';
import { fixTalismanEsm } from './talisman.mjs';

fixTalismanEsm();

const plugins = [];

const options = {
  entryPoints: ['src/app.ts'],
  bundle: true,
  format: 'esm',
  platform: 'browser',
  target: 'esnext',
  preserveSymlinks: true,
  treeShaking: true,
  sourcemap: true,
  outdir: 'out/',
  logLevel: 'info',
};

const ctx = await esbuild.context({ ...options, plugins });
await ctx.rebuild();
await ctx.watch();
const localServer = await ctx.serve({ servedir: './',  host: '127.0.0.1' });

/**
 * Create proxy server that will forward requests to esbuild local server.
 * @see https://esbuild.github.io/api/#serve-proxy
 */
http.createServer((req, res) => {
  const forwardRequest = (path) => {
    const options = {
      hostname: localServer.host,
      port: localServer.port,
      path,
      method: req.method,
      headers: req.headers,
    };

    const proxyReq = http.request(options, (proxyRes) => {
      // If esbuild local server return 404, use SPA router config for fallback
      if (proxyRes.statusCode === 404) {
        return forwardRequest("/");
      }

      res.writeHead(proxyRes.statusCode, proxyRes.headers);
      proxyRes.pipe(res, { end: true });
    });

    req.pipe(proxyReq, { end: true });
  };
  forwardRequest(req.url);
}).listen(3000)

console.log('\x1b[1m\x1b[92m', `> Proxy: \x1b[4mhttp://${localServer.host}:3000/\x1b[0m`);