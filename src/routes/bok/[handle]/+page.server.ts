import { error } from '@sveltejs/kit'
import { client } from '../../../client'
import { productQuery } from './page.gql'

const metafields = [
  book('category', 'Kategori'),
  book('binding', 'Bindning'),
  book('edited_by', 'Redigering'),
  book('illustrations_by', 'Illustrationer'),
  book('age', 'Rekommenderad ålder'),
  book('number_of_pages', 'Antal sidor'),
  book('publish_month', 'Utgivningsmånad'),
  translated('original_title', 'Orginaltitel'),
  translated('translated_by', 'Översättning'),
  audio('narrated_by', 'Uppläsare'),
  audio('duration', 'Speltid'),
  audio('contains', 'Innehåller'),
  book('reading_level', 'Lättlästnivå'),
]

const metafieldLabels = new Map(metafields.map((m) => [m.key, m.label]))

function book(key: string, label: string) {
  return { namespace: 'book', key, label }
}

function translated(key: string, label: string) {
  return { namespace: 'translated_book', key, label }
}

function audio(key: string, label: string) {
  return { namespace: 'audio_book', key, label }
}

const metafieldIds = metafields.map(({ key, namespace }) => ({ key, namespace }))

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
