import { CartStore, type Cart$result } from '$houdini'
import { derived, writable } from 'svelte/store'

export const pageStore = writable(false)

export const isOverlayOpen = writable(false)

export const isMenuOpen = writable(false)

export const isCartOpen = writable(false)

export const noScroll = derived(
  [isOverlayOpen, isMenuOpen, isCartOpen],
  ([a$, b$, c$]) => a$ || b$ || c$,
)

export const cartQuantity = writable(0)

export const cart = writable<Cart$result['cart']>()

const cartStore = new CartStore()

export async function getCart() {
  const resp = await fetch('/api/cart')
  const data = (await resp.json()) as Cart$result
  cart.set(data.cart)
}
