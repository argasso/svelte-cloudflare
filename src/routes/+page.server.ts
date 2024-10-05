import { error } from '@sveltejs/kit'
import { PageStore } from '$houdini'

import { PUBLIC_SHOPIFY_STOREFRONT_TOKEN, PUBLIC_SHOPIFY_STOREFRONT_URL } from '$env/static/public'

export async function load(event) {
  const myQuery = new PageStore()
  const Page = await myQuery.fetch({ event, variables: { handle: 'startsida' } })

  if (!Page.data?.page) {
    throw error(404, 'Oj, vi hittar inte sidan')
  }

  if (Page.errors) {
    throw error(500, Page.errors.map((e) => e.message).join(', '))
  }

  return { Page: Page.data.page }
}
