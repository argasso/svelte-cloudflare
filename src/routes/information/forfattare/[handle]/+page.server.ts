import { AuthorStore, load_Author, load_Products, ProductsStore } from '$houdini'
import { cartAdd, cartUpdate } from '$lib/cartService'
import { error } from '@sveltejs/kit'
import { get } from 'svelte/store'

export async function load(event) {
  const { handle } = event.params

  const authorStore = new AuthorStore()
  const authorResponse = await authorStore.fetch({
    event,
    variables: {
      handle: { handle, type: 'author' },
    },
  })

  if (authorResponse.errors) {
    throw error(500, authorResponse.errors.map((e) => e.message).join(', '))
  }

  const author = authorResponse?.data?.author
  if (!author) {
    throw error(404, 'Vi hittar inte författaren')
  }

  const productsStore = new ProductsStore()
  const productsResponse = await productsStore.fetch({
    event,
    variables: {
      filters: [
        {
          productMetafield: {
            namespace: 'custom',
            key: 'authors',
            value: author.id,
          },
        },
      ],
      first: 30,
    },
  })

  if (productsResponse.errors) {
    const error = productsResponse.errors.map((e) => e.message).join(', ')
    console.warn('Failed to load books for author', author.handle, error)
  }

  const books = productsResponse.data?.collection?.products.nodes ?? []

  return { author, books }
}

// export const actions = {
//   cartAdd,
//   cartUpdate,
// }
