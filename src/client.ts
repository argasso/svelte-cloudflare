import { HoudiniClient } from '$houdini'
import {
  PRIVATE_SHOPIFY_STOREFRONT_TOKEN,
  PRIVATE_SHOPIFY_STOREFRONT_URL,
} from '$env/static/private'

const headers = {
  headers: {
    'X-Shopify-Storefront-Access-Token': PRIVATE_SHOPIFY_STOREFRONT_TOKEN,
  },
}

export default new HoudiniClient({
  url: PRIVATE_SHOPIFY_STOREFRONT_URL,
  fetchParams() {
    return {
      ...headers,
    }
  },
})
