import { error } from '@sveltejs/kit'
import { client } from '../../../client'
import { productQuery } from './page.gql'
const namespace = 'book'

const metafieldLabels = new Map([
  ['category', 'Kategori'],
  ['binding', 'Bindning'],
  ['edited_by', 'Redigering'],
  ['illustrations_by', 'Illustrationer'],
  ['recommened_age', 'Rekommenderad ålder'],
  ['number_of_pages', 'Antal sidor'],
  ['publish_month', 'Utgivningsmånad'],
  ['original_title', 'Orginaltitel'],
  ['translated_by', 'Översättning'],
  ['narrated_by', 'Uppläsare'],
  ['duration', 'Speltid'],
  ['contains', 'Innehåller'],
  ['reading_level', 'Lättlästnivå'],
])

const metafieldIds = [...metafieldLabels.keys()].map((key) => ({ key, namespace }))

export async function load({ fetch, url }) {
  const handle = url.pathname.split('/').at(-1) ?? ''
  const variables = {
    handle,
    metafieldIds,
  }
  const response = await client.query(productQuery, variables, { fetch })
  if (response.error) {
    console.error('MainMenuQuery failed', response.error)
    error(500, 'Oj, någonting gick snett när vi försökte ladda sidan')
  }

  const product = response.data?.product

  return {
    maxage: 3600,
    product,
    metafieldLabels,
  }
}
