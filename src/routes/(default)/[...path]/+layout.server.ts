import { findMenuItem } from '$lib/menu.js'
import { error } from '@sveltejs/kit'
import { pageQuery } from '$lib/gql/page.gql'
import { client } from '../../../client'
import { filtersQuery } from '$lib/components/filter/Filters.gql'

export const load = async (event) => {
  const { url, parent } = event

  // Page
  const handle = url.pathname.split('/').at(-1) ?? ''
  const pageResponse = await client.query(pageQuery, { handle }, { fetch })
  if (pageResponse.error) {
    console.error('Page query failed', pageResponse.error)
    error(500, 'Oj, någonting gick snett när vi försökte ladda sidan')
  }
  const page = pageResponse.data?.page
  if (!page) {
    error(404, 'Kan inte hitta sidan')
  }

  const { menu } = await parent()

  // Links
  const links = findMenuItem(menu, url.pathname)?.children

  // Filter
  const filterResponse = await client.query(filtersQuery, {}, { fetch })
  if (filterResponse.error) {
    console.error('FiltersQuery failed', filterResponse.error)
    error(500, 'Oj, någonting gick snett när vi försökte ladda sidan')
  }
  const initialFilters = filterResponse.data?.collection?.products.filters ?? []

  return {
    page,
    links,
    initialFilters,
  }
}
