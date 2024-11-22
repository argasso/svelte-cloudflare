import { graphql } from '../../../graphql'

export const filtersQuery = graphql(`
  query Filters {
    collection(handle: "frontpage") {
      products(first: 0) {
        filters {
          id
          label
          type
          values {
            count
            id
            input
            label
          }
        }
      }
    }
  }
`)
export type TFilterQuery = typeof filtersQuery
