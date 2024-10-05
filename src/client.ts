import { HoudiniClient } from '$houdini'
import { PUBLIC_SHOPIFY_STOREFRONT_TOKEN, PUBLIC_SHOPIFY_STOREFRONT_URL } from '$env/static/public'

const headers = {
  headers: {
    'X-Shopify-Storefront-Access-Token': 'ff151810f966c1536e2d3b4fd437f38e',
  },
}

export default new HoudiniClient({
  url: 'https://argasso.myshopify.com/api/2024-10/graphql',
  fetchParams() {
    return {
      ...headers,
    }
  },
})
