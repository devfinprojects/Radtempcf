// Astro Configuration
import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  // Site configuration
  site: 'https://radreport.org',
  base: '/',
  
  // Output configuration - static for deployment
  output: 'static',
  
  // Adapter for Cloudflare deployment
  adapter: cloudflare({
    imageService: 'cloudflare',
  }),
  
  // Build configuration
  build: {
    format: 'file',
    inlineStylesheets: 'auto',
  },
  
  // Server configuration
  server: {
    port: 3000,
    host: false,
  },
  
  // Markdown configuration
  markdown: {
    shikiConfig: {
      theme: 'github-dark',
    },
  },
  
  // Integrations
  integrations: [],
  
  // Prefetch configuration
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'viewport',
  },
  
  // Image optimization
  image: {
    service: {
      entrypoint: 'astro/assets/services/sharp',
    },
  },
  
  // Security headers
  security: {
    checkOrigin: true,
  },
  
  // Compression
  compressHTML: true,
  
  // Redirects
  redirects: {},
  
  // Assets
  assets: 'inline',
});