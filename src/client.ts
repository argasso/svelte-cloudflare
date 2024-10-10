import { HoudiniClient } from '$houdini'
import { PUBLIC_SHOPIFY_STOREFRONT_TOKEN, PUBLIC_SHOPIFY_STOREFRONT_URL } from '$env/static/public'

const headers = {
  headers: {
    'X-Shopify-Storefront-Access-Token': PUBLIC_SHOPIFY_STOREFRONT_TOKEN,
  },
}

export default new HoudiniClient({
  url: PUBLIC_SHOPIFY_STOREFRONT_URL,
  fetchParams() {
    return {
      ...headers,
    }
  },
})
