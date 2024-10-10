import { HoudiniClient } from '$houdini'
import { SHOPIFY_STOREFRONT_TOKEN, SHOPIFY_STOREFRONT_URL } from '$env/static/private'

const headers = {
  headers: {
    'X-Shopify-Storefront-Access-Token': SHOPIFY_STOREFRONT_TOKEN,
  },
}

export default new HoudiniClient({
  url: SHOPIFY_STOREFRONT_URL,
  fetchParams() {
    return {
      ...headers,
    }
  },
})
