import { error } from '@sveltejs/kit'
import { client } from '../client'
import { pageQuery } from '$lib/gql/page.gql'

export async function load({ fetch }) {
  const pageResponse = await client.query(pageQuery, { handle: 'startsida' }, { fetch })
  if (pageResponse.error) {
    console.error('FiltersQuery failed', pageResponse.error)
    error(500, 'Oj, någonting gick snett när vi försökte ladda sidan')
  }
  const page = pageResponse.data?.page

  return { page }
}
