import { cartAdd, cartLoad, cartUpdate } from '$lib/cartService'

export async function load(event) {
  return await cartLoad(event)
}

export const actions = {
  cartAdd,
  cartUpdate,
}
