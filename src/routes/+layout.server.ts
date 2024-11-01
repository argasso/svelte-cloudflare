import { mainMenuQuery } from '$lib/components/NavMenu.svelte'
import { filtersQuery } from '$lib/components/filter/Filters.svelte'
import { makeMenu } from '$lib/menu'
import { error } from '@sveltejs/kit'
import { client } from '../client'

export const prerender = true

export async function load({ fetch }) {
  const filterResponse = await client.query(filtersQuery, {}, { fetch })
  if (filterResponse.error) {
    console.error('FiltersQuery failed', filterResponse.error)
    error(500, 'Oj, någonting gick snett när vi försökte ladda sidan')
  }

  const mainMenuResponse = await client.query(mainMenuQuery, {}, { fetch })
  if (mainMenuResponse.error) {
    console.error('MainMenuQuery failed', mainMenuResponse.error)
    error(500, 'Oj, någonting gick snett när vi försökte ladda sidan')
  }

  const menu = makeMenu(mainMenuResponse.data?.menu)
  const initialFilters = filterResponse.data?.collection?.products.filters ?? []

  return {
    maxage: 3600,
    menu,
    initialFilters,
  }
}
