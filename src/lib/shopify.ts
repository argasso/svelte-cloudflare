import { writable } from 'svelte/store'
import {
  PUBLIC_SHOPIFY_STOREFRONT_TOKEN,
  PUBLIC_SHOPIFY_STOREFRONT_DOMAIN,
  PUBLIC_SHOPIFY_CHECKOUT_DOMAIN,
} from '$env/static/public'

export const flashCart = writable(false)
export const cartOpen = writable(false)

// Shopify concent banner
const bannerSettings = {
  storefrontAccessToken: PUBLIC_SHOPIFY_STOREFRONT_TOKEN,
  checkoutRootDomain: PUBLIC_SHOPIFY_CHECKOUT_DOMAIN,
  storefrontRootDomain: PUBLIC_SHOPIFY_STOREFRONT_DOMAIN,
  // Optional
  locale: 'se_SV',
  country: 'se',
}

export const tryInitConcentBanner = () => {
  if (!window.privacyBanner) return false

  console.log('Banner settings from env:', {
    PUBLIC_SHOPIFY_STOREFRONT_TOKEN,
    PUBLIC_SHOPIFY_STOREFRONT_DOMAIN,
    PUBLIC_SHOPIFY_CHECKOUT_DOMAIN,
  })

  window.privacyBanner
    .loadBanner(bannerSettings)
    .then(() => {
      console.log('Shopify cookie banner loaded')
    })
    .catch((err) => {
      console.error('Error loading Shopify cookie banner', err)
    })

  return true
}

export async function showCookiePreferences(): Promise<void> {
  if (typeof window === 'undefined') return

  if (!window.privacyBanner) {
    console.warn('Shopify privacyBanner not ready yet')
    return
  }

  await window.privacyBanner.showPreferences(bannerSettings)
}
