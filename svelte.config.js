import adapter from '@sveltejs/adapter-cloudflare'
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Consult https://kit.svelte.dev/docs/integrations#preprocessors
  // for more information about preprocessors
  preprocess: vitePreprocess(),

  kit: {
    // adapter-auto only supports some environments, see https://kit.svelte.dev/docs/adapter-auto for a list.
    // If your environment is not supported, or you settled on a specific environment, switch out the adapter.
    // See https://kit.svelte.dev/docs/adapters for more information about adapters.
    adapter: adapter(),
    csp: {
        // Use 'auto' mode to dynamically handle nonces/hashes for SSR and prerendered pages
        mode: 'auto',
        directives: {
          'default-src': ['self'], // Fallback for most unspecified directives
          'script-src': ['self', 'unsafe-inline', 'https://cdn.shopify.com', 'https://challenges.cloudflare.com'], // TODO: Remove unsafe-inline
          'style-src': ['self', 'unsafe-inline'],  // TODO: Remove unsafe-inline
          'img-src': ['self', 'data:', 'https://cdn.shopify.com'],
          'font-src': ['self'],
          'object-src': ['none'], // Disallow plugins
          'base-uri': ['none'],   // Disallow dynamic <base> tags
          'form-action': ['self'], // Restrict form submissions to same origin
          'frame-ancestors': ['none'], // Prevent app from being embedded in iframes
          'frame-src': ['https://challenges.cloudflare.com'], // Turnstile iframe
          'connect-src': ['self', 'https://shop.argasso.se']
        },
        // Use reportOnly initially to monitor violations
        // reportOnly: { /* same directives as above */ } 
    }
  },
}

export default config
