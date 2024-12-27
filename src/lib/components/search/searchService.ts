import { error, type RequestEvent, type ServerLoadEvent } from '@sveltejs/kit'
import { graphql } from '../../../graphql'
import { client } from '../../../client'

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

export const searchLoad = async (event: ServerLoadEvent | RequestEvent) => {
  const { fetch, url } = event
  const query = url.searchParams.get('query')
  if (query) {
    const variables = { query }
    const response = await client.query(searchQuery, variables, { fetch })
    if (response.error) {
      console.error('Failed to do predictive search', response.error, 'query', query)
      error(400, 'Misslyckades med sökningen :(')
    }
    const { products, queries } = response.data?.predictiveSearch ?? {}
    return {
      products,
      queries,
      variables,
    }
  }
}
