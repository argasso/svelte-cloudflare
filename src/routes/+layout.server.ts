import { makeMenu } from '$lib/menu'
import { error } from '@sveltejs/kit'
import { client } from '../client'
import { graphql } from '../graphql'
import { mainMenuQuery } from '$lib/components/NavMenu.svelte'

export const prerender = true

export type TFilterQuery = typeof filtersQuery
const filtersQuery = graphql(`
  query Filters {
    collection(handle: "frontpage") {
      products(first: 0) {
        filters {
          id
          label
          type
          values {
            count
            id
            input
            label
          }
        }
      }
    }
  }
`)

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
