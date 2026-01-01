import type { Handle } from '@sveltejs/kit'
import { dev } from '$app/environment'

// export let clientAddress: string
const SHOPIFY_CHECKOUT_DOMAIN = 'https://shop.argasso.se'
const SHOPIFY_CDN = 'https://cdn.shopify.com'

export const handle: Handle = async ({ event, resolve }) => {
  // clientAddress = event.getClientAddress()

  event.locals.cartId = event.cookies.get('cartId')

  // In dev: don't set CSP at all (or use a very relaxed one)
  if (dev) {
    return await resolve(event)
  }

  const response = await resolve(event, {
    filterSerializedResponseHeaders(name) {
      // allow cookies, CSP, etc. to propagate
      const allowed = ['content-type', 'set-cookie', 'location']
      return allowed.includes(name.toLowerCase())
    },
  })
  // Start from a reasonably strict default CSP and extend as needed.
  const cspDirectives: Record<string, string[]> = {
    'default-src': ["'self'"],
    // Allow your own scripts + Shopify CDN (Customer Privacy script / banner)
    'script-src': ["'self'", SHOPIFY_CDN],
    // Where XHR / fetch / POST requests are allowed to go
    'connect-src': ["'self'", SHOPIFY_CHECKOUT_DOMAIN],
    // Example: allow styles from self and inline (adjust for your setup)
    'style-src': ["'self'", "'unsafe-inline'"],
    // Example: images from self, data: URLs, and Shopify CDN if needed
    'img-src': ["'self'", 'data:', SHOPIFY_CDN],
    // Example: fonts (adjust as needed)
    'font-src': ["'self'", 'data:'],
    // Frame/iframe sources (if you embed anything)
    'frame-src': ["'self'"],
  }

  // response.headers.set('x-custom-header', 'potato');

  const cspHeader = Object.entries(cspDirectives)
    .map(([key, values]) => `${key} ${values.join(' ')}`)
    .join('; ')

  const newHeaders = new Headers(response.headers)
  newHeaders.set('Content-Security-Policy', cspHeader)

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: newHeaders,
  })
}
