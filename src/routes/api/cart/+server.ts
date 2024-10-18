import { json } from '@sveltejs/kit'
import { cartLoad } from '$lib/cartService.js'

export async function GET(event) {
  const response = await cartLoad(event)
  return json(response)
}
