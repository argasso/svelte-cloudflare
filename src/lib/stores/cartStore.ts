import { writable } from 'svelte/store'
import type { FragmentOf } from '../../graphql'
import type { cartFragment } from '$lib/cartService'
import type { PageServerData } from '../../routes/api/cart/+server'

// export const cartQuantity = writable(0)

export const cart = writable<FragmentOf<typeof cartFragment>>()

export async function getCart() {
  const resp = await fetch('/api/cart')
  const data = (await resp.json()) as Awaited<PageServerData>
  cart.set(data.cart)
}
