import type { introspection_types } from '../graphql-env'

// place files you want to import through the `$lib` alias in this folder.
const BOOK_URL = '/bok'
const BOOKS_URL = '/bocker'
const AUTHORS_URL = '/information/forfattare'

export function bookUrl(handle: string) {
  return `${BOOK_URL}/${handle}`
}

export function booksUrl(handle: string) {
  return `${BOOKS_URL}/${handle}`
}

export function authorUrl(handle: string) {
  return `${AUTHORS_URL}/${handle}`
}

type SearchTypename = introspection_types['SearchResultItem']['possibleTypes']

export const isSearchType =
  <T extends SearchTypename>(typename: T) =>
  <N extends { __typename?: SearchTypename }>(
    node: N | null | undefined,
  ): node is Extract<N, { __typename?: T }> => {
    return node?.__typename === typename
  }

type Typename = introspection_types['MetafieldReference']['possibleTypes']

export const isType =
  <T extends Typename>(typename: T) =>
  <N extends { __typename?: Typename }>(
    node: N | null | undefined,
  ): node is Extract<N, { __typename?: T }> => {
    return node?.__typename === typename
  }

export function getByType<T extends Typename, N extends { __typename?: Typename }>(
  typename: T,
  node: N | null | undefined,
) {
  return (isType(typename)(node) ? node : undefined) as Extract<N, { __typename?: T }> | undefined
}

export function notEmpty<TValue>(value: TValue | null | undefined): value is TValue {
  return value !== null && value !== undefined
}

const months = [
  'januari',
  'februari',
  'mars',
  'april',
  'maj',
  'juni',
  'juli',
  'augusti',
  'september',
  'oktober',
  'november',
  'december',
]
export function publishMonth(date?: string) {
  if (date) {
    const d = new Date(date)
    const year = d.getFullYear()
    const month = months[d.getMonth()]
    return `${month} ${year}`
  }
}

export function parseJSON(input: string | null) {
  if (input) {
    return JSON.parse(input)
  }
}

export function formatPrice(price: { amount: string; currencyCode: string }) {
  const formattedAmount = parseFloat(price.amount).toFixed(2).replace('.00', '')
  switch (price.currencyCode) {
    case 'SEK':
      return `${formattedAmount} kr`
    case 'USD':
      return `$${formattedAmount}`
    case 'EUR':
      return `€${formattedAmount}`
  }
  return `${formattedAmount} ${price.currencyCode}`
}

export const isNonNil = <T>(value: T | null | undefined | void): value is T => value != null
