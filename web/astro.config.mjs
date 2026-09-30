import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  output: 'static',
  adapter: cloudflare({ platformProxy: { enabled: true } }),
  site: 'https://deutsch.aolingge.dev',
  security: { checkOrigin: false },
  image: { service: { entrypoint: 'astro/assets/services/noop' } },
});
