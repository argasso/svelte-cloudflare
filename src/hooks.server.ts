import type { Handle } from '@sveltejs/kit'

// export let clientAddress: string

export const handle: Handle = async ({ event, resolve }) => {
  // clientAddress = event.getClientAddress()

  event.locals.cartId = event.cookies.get('cartId')

  const response = await resolve(event)
  // response.headers.set('x-custom-header', 'potato');

  return response
}
