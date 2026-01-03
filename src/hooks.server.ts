import type { Handle } from '@sveltejs/kit'

export const handle: Handle = async ({ event, resolve }) => {
  event.locals.cartId = event.cookies.get('cartId')

  const response = await resolve(event)

  return response
}
