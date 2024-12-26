import { error } from '@sveltejs/kit'
import { client } from '../../../../client.js'
import { graphql } from 'gql.tada'

const authorsQuery = graphql(`
  query Authors {
    metaobjects(first: 30, type: "Author") {
      nodes {
        id
        handle
        name: field(key: "name") {
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
        seo {
          title {
            value
          }
          description {
            value
          }
        }
      }
    }
  }
`)

export async function load({ fetch }) {
  const response = await client.query(authorsQuery, {}, { fetch })
  if (response.error) {
    console.error('Authors query failed', response.error)
    error(500, 'Oj, någonting gick snett när vi försökte ladda sidan')
  }

  const authors = response?.data?.metaobjects.nodes ?? []

  return { authors }
}
