import { error } from '@sveltejs/kit'
import { client } from '../../../../../client.js'
import { graphql } from 'gql.tada'
import { productsQuery } from '$lib/components/ProductsGrid.svelte'

const authorQuery = graphql(`
  query Author($handle: MetaobjectHandleInput!) {
    author: metaobject(handle: $handle) {
      id
      handle
      type
      title: field(key: "name") {
        value
      }
      description: field(key: "description") {
        value
      }
      image: field(key: "image") {
        reference {
          ... on MediaImage {
            image {
              altText
              url
              width
              height
            }
          }
        }
      }
    }
  }
`)

export async function load(event) {
  const { handle } = event.params

  const authorResponse = await client.query(
    authorQuery,
    {
      handle: { handle, type: 'author' },
    },
    { fetch },
  )

  if (authorResponse.error) {
    console.error('Author query failed', authorResponse.error)
    error(500, 'Oj, någonting gick snett när vi försökte ladda sidan')
  }

  const author = authorResponse?.data?.author
  if (!author) {
    error(404, 'Vi hittar inte författaren')
  }

  const filters = [
    {
      productMetafield: {
        namespace: 'custom',
        key: 'authors',
        value: author.id,
      },
    },
  ]
  const productsResponse = await client.query(productsQuery, { filters, first: 30 }, { fetch })
  if (productsResponse.error) {
    console.error('ProductsStore fetch failed', productsResponse.error)
    error(500, 'Oj, någonting gick snett när vi försökte ladda sidan')
  }

  //   event,
  //   variables: {
  //     filters: [
  //       {
  //         productMetafield: {
  //           namespace: 'custom',
  //           key: 'authors',
  //           value: author.id,
  //         },
  //       },
  //     ],
  //     first: 30,
  //   },
  // })

  if (productsResponse.error) {
    console.error('PageStore fetch failed', productsResponse.error)
    error(500, 'Oj, någonting gick snett när vi försökte ladda sidan')
  }

  const books = productsResponse.data?.collection?.products.nodes ?? []

  return { author, books }
}

// export const actions = {
//   cartAdd,
//   cartUpdate,
// }
