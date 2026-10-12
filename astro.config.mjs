import { defineConfig } from 'astro/config';

import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://chistemalo.com',
  integrations: [sitemap()],
});