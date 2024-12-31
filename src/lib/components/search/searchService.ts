import { error, type RequestEvent, type ServerLoadEvent } from '@sveltejs/kit'
import { graphql } from '../../../graphql'
import { client } from '../../../client'
import { pageInfoFragment } from '../ProductsGrid.gql'
import { authorsFragment } from '../Authors.graphql'

export const searchQuery = graphql(`
  query PredictiveSearch($query: String!) {
    predictiveSearch(query: $query, limit: 10) {
      products {
        title
        handle
        images(first: 1) {
          nodes {
            url
            height
            width
            altText
          }
        }
      }
      queries {
        styledText
        text
        trackingParameters
      }
    }
  }
`)

const pageInfo = graphql(`
  fragment PageInfo on SearchResultItemConnection @_unmask {
    pageInfo {
      hasNextPage
      hasPreviousPage
      startCursor
      endCursor
    }
  }
`)

const searchQuery2 = graphql(
  `
    query searchProducts($query: String!, $first: Int) {
      search(query: $query, first: $first, types: PRODUCT) {
        nodes {
          ... on Product {
            id
            title
            handle
            images(first: 1) {
              nodes {
                url
                height
                width
                altText
              }
            }
            ...AuthorsFragment
          }
        }
        totalCount
        ...PageInfo
      }
    }
  `,
  [pageInfo, authorsFragment],
)

export const searchLoad = async (event: ServerLoadEvent | RequestEvent) => {
  const { fetch, url } = event
  const query = url.searchParams.get('query')
  if (query) {
    const variables = { query, first: 20 }
    // const response = await client.query(searchQuery, { query }, { fetch })
    const response = await client.query(searchQuery2, variables, { fetch })

    if (response.error) {
      console.error('Failed to do predictive search', response.error, 'query', query)
      error(400, 'Misslyckades med sökningen :(')
    }
    // const { products, queries } = response.data?.predictiveSearch ?? {}
    const search = response.data?.search
    return {
      search,
      variables,
    }
  }
}
