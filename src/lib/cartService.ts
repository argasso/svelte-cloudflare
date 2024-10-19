import { CartCreateStore, CartLinesAddStore, CartLinesUpdateStore, CartStore } from '$houdini'
import { error, type Action, type RequestEvent, type ServerLoadEvent } from '@sveltejs/kit'
import type { SubmitFunction } from '../routes/(default)/cart/$types'
import { cart } from './stores/store'
import { toast } from 'svelte-sonner'
import { goto, invalidateAll } from '$app/navigation'
import { applyAction } from '$app/forms'

const cartStore = new CartStore()
const cartCreateStore = new CartCreateStore()
const cartLinesAddStore = new CartLinesAddStore()
const cartLinesUpdateStore = new CartLinesUpdateStore()

export const cartAddAction = '/cart?/cartAdd'
export const cartUpdateAction = '/cart?/cartUpdate'

export const cartLoad = async (event: ServerLoadEvent | RequestEvent) => {
  const cartId = event.cookies.get('cartId')

  if (cartId) {
    const { data } = await cartStore.fetch({ event, variables: { cartId } })
    if (data?.cart) {
      const { cart } = data
      if (!isCartExpired(cart.updatedAt)) {
        return {
          cart,
        }
      }
    }
  }

  const { data, errors } = await cartCreateStore.mutate({}, { event })

  if (data?.cartCreate?.cart && !errors) {
    const { cart } = data.cartCreate
    event.cookies.set('cartId', cart.id, { path: '/' })
    return {
      cart,
    }
  }

  console.error('Failed to create shopping cart', errors)
  error(400, 'Kunde inte skapa din varukorg :(')
}

export const cartAdd: Action = async (event) => {
  const cartId = getCartId(event)
  const formData = await event.request.formData()
  const variantId = formData.get('variantId')?.toString()
  if (!variantId) {
    error(400, {
      message: 'Obligatoriska fält saknas',
      fields: { variantId },
    })
  }

  const { data, variables, errors } = await cartLinesAddStore.mutate(
    {
      cartId,
      lines: [
        {
          merchandiseId: variantId,
          quantity: 1,
        },
      ],
    },
    { event },
  )

  if (data?.cartLinesAdd && !errors) {
    const { cart, userErrors } = data?.cartLinesAdd
    const merchandise = cart?.lines.edges.find((l) => l.node.merchandise.id === variantId)?.node
      .merchandise

    return {
      cart,
      variables,
      userErrors,
      success: true,
      message: 'Lade varan i varukorgen!',
      merchandise,
    }
  }

  console.error('Failed to add product to cart', errors)
  error(400, 'Kunde inte lägga varan i varukorgen :(')
}

export const cartUpdate: Action = async (event) => {
  const cartId = getCartId(event)
  const formData = await event.request.formData()
  const variantId = formData.get('variantId')?.toString()
  const lineId = formData.get('lineId')?.toString()
  const quantity = formData.get('quantity')?.toString()

  if (!variantId || !lineId || !quantity) {
    error(400, {
      message: 'Obligatoriska fält saknas',
      fields: { variantId, lineId, quantity },
    })
  }

  const { data, variables, errors } = await cartLinesUpdateStore.mutate(
    {
      cartId,
      lines: [
        {
          id: lineId,
          merchandiseId: variantId,
          quantity: parseInt(quantity, 10),
        },
      ],
    },
    { event },
  )

  if (data?.cartLinesUpdate && !errors) {
    const { cart, userErrors } = data.cartLinesUpdate
    const merchandise = cart?.lines.edges.find((l) => l.node.id === lineId)?.node.merchandise
    return {
      cart,
      variables,
      userErrors,
      success: true,
      message: 'Ändrade i varukorgen!',
      merchandise,
    }
  }

  console.error('Failed to update product in cart', errors)
  error(400, 'Kunde inte uppdatera varan i varukorgen :(')
}

function getCartId(event: RequestEvent) {
  const cartId = event.cookies.get('cartId')
  if (!cartId) {
    error(404, 'Varukorg saknas')
  }
  return cartId
}

function isCartExpired(updatedAt: string) {
  const difference = Date.now() - new Date(updatedAt).getTime()
  const totalDays = Math.ceil(difference / (1000 * 3600 * 24))
  return totalDays > 6
}

const position = 'top-right'

export const cartSubmitFunction: SubmitFunction = () => {
  return async ({ result }) => {
    if (result.type === 'redirect') {
      goto(result.location)
    } else if (result.type === 'success') {
      invalidateAll()
      await applyAction(result)
      cart.set(result.data?.cart)
      const message = result.data?.message ?? 'Uppdaterade varukorgen'
      const description = result.data?.merchandise?.product.title ?? ''
      toast.success(message, { position, description })
    } else if (result.type === 'failure') {
      const description = 'Kunde inte uppdatera varukorgen.'
      toast.error('Oj', { position, description })
    }
  }
}
