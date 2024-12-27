import { json } from '@sveltejs/kit'
import { cartLoad } from '$lib/cartService.js'
import { searchLoad } from '$lib/components/search/searchService.js'

export type PageServerData = ReturnType<typeof searchLoad>

export async function GET(event) {
  const response = await searchLoad(event)
  return json(response)
}
