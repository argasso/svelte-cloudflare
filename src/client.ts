// import { clientAddress } from './hooks.server'
// import { PUBLIC_SHOPIFY_STOREFRONT_TOKEN, PUBLIC_SHOPIFY_STOREFRONT_URL } from '$env/static/public'
import { cacheExchange, Client, fetchExchange, mapExchange } from '@urql/core'

const logExchange = mapExchange({
  onOperation(operation) {
    // console.log('logExchange onOperation context', operation.context.meta?.cacheOutcome)
  },
  onResult(result) {
    // console.log('logExchange onResult meta', result.operation.context.meta)
  },
})

export const client = new Client({
  url: 'https://argasso.myshopify.com/api/2024-10/graphql',
  exchanges: [logExchange, cacheExchange, fetchExchange],
  fetchOptions: () => {
    return {
      headers: {
        'X-Shopify-Storefront-Access-Token': 'ff151810f966c1536e2d3b4fd437f38e',
        // 'Shopify-Storefront-Buyer-IP': clientAddress,
      },
    }
  },
})
