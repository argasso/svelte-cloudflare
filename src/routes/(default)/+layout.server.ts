import { FiltersStore } from '$houdini'
import { findMenuItem, getPathToItem } from '$lib/menu'
import { error } from '@sveltejs/kit'

export const load = async (event) => {
  const { parent, url } = event
  const { menu } = await parent()
  const path = url.pathname.split('/').slice(0, -1).join('/')
  const crumbs = getPathToItem(findMenuItem(menu, path))

  const store = new FiltersStore()
  const response = await store.fetch({ event })

  if (response.errors) {
    console.error('FiltersStore fetch failed', response.errors.map((e) => e.message).join(', '))
    error(500, 'Oj, någonting gick snett när vi försökte ladda sidan')
  }

  const initialFilters = response.data?.filters?.products.filters ?? []
  return {
    crumbs,
    initialFilters,
  }
}
