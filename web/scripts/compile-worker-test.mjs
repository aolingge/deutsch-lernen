import {build} from 'esbuild';
await build({entryPoints:['worker/index.ts'],outfile:'.wrangler/test-worker.mjs',bundle:true,platform:'node',format:'esm',packages:'external'});
