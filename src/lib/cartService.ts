import { error, type Action, type RequestEvent, type ServerLoadEvent } from '@sveltejs/kit'
import { client } from '../client'
import { graphql } from '../graphql'
import { priceFragment } from './components/Price.graphql'
import { authorsFragment } from './components/Authors.graphql'

export const cartAddAction = '/cart?/cartAdd'
export const cartUpdateAction = '/cart?/cartUpdate'

export const cartFragment = graphql(
  `
    fragment CartFragment on Cart @_unmask {
      id
      checkoutUrl
      updatedAt
      totalQuantity
      cost {
        totalAmount {
          ...PriceFragment
        }
      }
      lines(first: 100) {
        edges {
          node {
            id
            quantity
            cost {
              subtotalAmount {
                ...PriceFragment
              }
              totalAmount {
                ...PriceFragment
              }
            }
            merchandise {
              ... on ProductVariant {
                id
                title
                binding: metafield(namespace: "book", key: "binding") {
                  value
                }
                barcode
                sku
                product {
                  images(first: 1) {
                    edges {
                      node {
                        url
                        altText
                        width
                        height
                      }
                    }
                  }
                  title
                  ...AuthorsFragment
                }
              }
            }
          }
        }
      }
    }
  `,
  [priceFragment, authorsFragment],
)

const cartCreateErrorFragment = graphql(`
  fragment CartUserErrorFragment on CartUserError @_unmask {
    field
    message
  }
`)

export const cartLoad = async (event: ServerLoadEvent | RequestEvent) => {
  const cartId = event.cookies.get('cartId')

  if (cartId) {
    const cartResponse = await client.query(
      graphql(
        `
          query Cart($cartId: ID!) @_unmask {
            cart(id: $cartId) {
              ...CartFragment
            }
          }
        `,
        [cartFragment],
      ),
      { cartId },
      { fetch },
    )
    if (cartResponse.data?.cart) {
      if (!isCartExpired(cartResponse.data.cart.updatedAt)) {
        return {
          cart: cartResponse.data?.cart,
        }
      }
    }
  }

  const cartCreateResponse = await client.mutation(
    graphql(
      `
        mutation CartCreate($lineItems: [CartLineInput!]) {
          cartCreate(input: { lines: $lineItems }) {
            userErrors {
              ...CartUserErrorFragment
            }
            cart {
              ...CartFragment
            }
          }
        }
      `,
      [cartFragment, cartCreateErrorFragment],
    ),
    {},
    { fetch },
  )
  if (cartCreateResponse.data?.cartCreate?.cart && !cartCreateResponse.error) {
    event.cookies.set('cartId', cartCreateResponse.data.cartCreate.cart.id, { path: '/' })
    console.log('Created new cart with id', cartCreateResponse.data.cartCreate.cart.id)
    return {
      cart: cartCreateResponse.data.cartCreate.cart,
    }
  }

  console.error('Failed to create shopping cart', cartCreateResponse.error)
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

  const variables = {
    cartId,
    lines: [
      {
        merchandiseId: variantId,
        quantity: 1,
      },
    ],
  }
  const response = await client.mutation(
    graphql(
      `
        mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) @_unmask {
          cartLinesAdd(cartId: $cartId, lines: $lines) {
            cart {
              ...CartFragment
            }
            userErrors {
              ...CartUserErrorFragment
            }
          }
        }
      `,
      [cartFragment, cartCreateErrorFragment],
    ),
    variables,
    { fetch },
  )
  if (response.data?.cartLinesAdd && !response.error) {
    const { cart, userErrors } = response.data.cartLinesAdd
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

  console.error('Failed to add product to cart', response.error)
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

  const variables = {
    cartId,
    lines: [
      {
        id: lineId,
        merchandiseId: variantId,
        quantity: parseInt(quantity, 10),
      },
    ],
  }
  const response = await client.mutation(
    graphql(
      `
        mutation CartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
          cartLinesUpdate(cartId: $cartId, lines: $lines) {
            cart {
              ...CartFragment
            }
            userErrors {
              ...CartUserErrorFragment
            }
          }
        }
      `,
      [cartFragment, cartCreateErrorFragment],
    ),
    variables,
    { fetch },
  )

  if (response.data?.cartLinesUpdate && !response.error) {
    const { cart, userErrors } = response.data.cartLinesUpdate
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

  console.error('Failed to update product in cart', response.error)
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
