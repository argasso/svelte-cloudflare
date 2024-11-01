import { derived, writable } from 'svelte/store'

export const isFilterOpen = writable(true)

export const isOverlayOpen = writable(false)

export const isMenuOpen = writable(false)

export const isCartOpen = writable(false)

export const noScroll = derived(
  [isOverlayOpen, isMenuOpen, isCartOpen],
  ([a$, b$, c$]) => a$ || b$ || c$,
)
