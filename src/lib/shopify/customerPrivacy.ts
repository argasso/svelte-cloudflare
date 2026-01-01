// src/lib/shopify/customerPrivacy.ts
// import {
//   PUBLIC_SHOPIFY_CHECKOUT_DOMAIN,
//   PUBLIC_SHOPIFY_STOREFRONT_ROOT_DOMAIN,
//   PUBLIC_SHOPIFY_STOREFRONT_TOKEN,
// } from '$env/static/public'

declare global {
  interface Window {
    Shopify?: {
      customerPrivacy?: ShopifyCustomerPrivacy
    }
  }
}

export type RawConsentState = {
  marketing: '' | 'yes' | 'no'
  analytics: '' | 'yes' | 'no'
  preferences: '' | 'yes' | 'no'
  sale_of_data: '' | 'yes' | 'no'
}

export type TrackingConsentInput = {
  marketing?: boolean
  analytics?: boolean
  preferences?: boolean
  sale_of_data?: boolean
}

export interface ShopifyCustomerPrivacy {
  // Check what processing is allowed (combines region + settings + consent)
  preferencesProcessingAllowed(): boolean
  analyticsProcessingAllowed(): boolean
  marketingAllowed(): boolean
  saleOfDataAllowed(): boolean

  // Check raw consent state
  currentVisitorConsent(): RawConsentState

  // Custom storefronts: we’ll call setTrackingConsent with extra params
  setTrackingConsent(
    args: Record<string, unknown>,
    callback?: (result?: { error?: string }) => void,
  ): void

  // Utilities
  shouldShowBanner(): boolean
  getRegion(): string
  consentId(): string
}

/**
 * Load the Shopify Customer Privacy API from the CDN into the browser.
 * Docs: https://shopify.dev/docs/api/customer-privacy#installation-on-a-custom-storefront
 */
export async function loadCustomerPrivacy(): Promise<ShopifyCustomerPrivacy> {
  if (typeof window === 'undefined') {
    throw new Error('Customer Privacy API must be used in the browser.')
  }

  if (window.Shopify?.customerPrivacy) {
    return window.Shopify.customerPrivacy
  }

  // Script from the official docs
  const SRC =
    'https://cdn.shopify.com/shopifycloud/consent-tracking-api/v0.1/consent-tracking-api.js'

  await new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${SRC}"]`)

    if (existing) {
      if (window.Shopify?.customerPrivacy) {
        resolve()
        return
      }
      existing.addEventListener('load', () => resolve())
      existing.addEventListener('error', () =>
        reject(new Error('Failed to load Shopify Customer Privacy script')),
      )
      return
    }

    const script = document.createElement('script')
    script.src = SRC
    script.async = true
    script.defer = true

    script.onload = () => resolve()
    script.onerror = () => reject(new Error('Failed to load Shopify Customer Privacy script'))

    document.head.appendChild(script)
  })

  if (!window.Shopify?.customerPrivacy) {
    throw new Error('Shopify Customer Privacy API not available after load.')
  }

  return window.Shopify.customerPrivacy
}

/**
 * Helper: get the raw visitor consent object.
 * Docs: https://shopify.dev/docs/api/customer-privacy#collect-and-register-consent
 */
export async function getCurrentConsent(): Promise<RawConsentState> {
  const cp = await loadCustomerPrivacy()
  console.log('current consent', cp.currentVisitorConsent())

  return cp.currentVisitorConsent()
}

/**
 * Helper: should we show a banner in this region?
 * Docs: https://shopify.dev/docs/api/customer-privacy#check-if-a-consent-banner-should-be-displayed
 */
export async function shouldShowBanner(): Promise<boolean> {
  const cp = await loadCustomerPrivacy()
  return cp.shouldShowBanner()
}

/**
 * Set consent for a headless / custom storefront.
 * Docs (custom storefront extras):
 * https://shopify.dev/docs/api/customer-privacy#collect-and-register-consent (custom storefronts section)
 */
export async function setTrackingConsentForHeadless(consent: TrackingConsentInput): Promise<void> {
  const cp = await loadCustomerPrivacy()

  return new Promise((resolve, reject) => {
    cp.setTrackingConsent(
      {
        ...consent,
        headlessStorefront: true,
        checkoutRootDomain: 'shop.argasso.se',
        storefrontRootDomain: 'argasso.se',
        storefrontAccessToken: 'ff151810f966c1536e2d3b4fd437f38e',
      },
      (result?: { error?: string }) => {
        if (result?.error) {
          reject(new Error(result.error))
        } else {
          console.log('saved!, result:', result)

          resolve()
        }
      },
    )
  })
}

/**
 * Convenience: check what processing is allowed.
 * Docs: https://shopify.dev/docs/api/customer-privacy#check-data-processing-permissions
 */
export async function getProcessingAllowed() {
  const cp = await loadCustomerPrivacy()
  return {
    analyticsAllowed: cp.analyticsProcessingAllowed(),
    marketingAllowed: cp.marketingAllowed(),
    preferencesAllowed: cp.preferencesProcessingAllowed(),
    saleOfDataAllowed: cp.saleOfDataAllowed(),
  }
}
