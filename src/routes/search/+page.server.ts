import { searchLoad } from '$lib/components/search/searchService.js'

export async function load(event) {
  return await searchLoad(event)
}
