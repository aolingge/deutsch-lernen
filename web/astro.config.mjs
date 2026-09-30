import { defineConfig } from 'astro/config';

export default defineConfig({
  output: 'static',
  site: 'https://deutsch-lernen-resource-hub.pirostonelsonrx688.workers.dev',
  security: { checkOrigin: false },
  image: { service: { entrypoint: 'astro/assets/services/noop' } },
});
