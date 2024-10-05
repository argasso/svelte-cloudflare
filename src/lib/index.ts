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

export function onlyProducts<T extends { __typename: string }>(nodes: T[] | null | undefined) {
  return (nodes ?? []).filter(
    (e): e is Extract<T, { __typename: 'Product' }> => e.__typename === 'Product',
  )
}

export function onlyMetaobjects<T extends { __typename: string }>(nodes: T[] | null | undefined) {
  return (nodes ?? []).filter(
    (e): e is Extract<T, { __typename: 'Metaobject' }> => e.__typename === 'Metaobject',
  )
}

export function onlyMediaImages<T extends { __typename: string }>(nodes: T[] | null | undefined) {
  return (nodes ?? []).filter(
    (e): e is Extract<T, { __typename: 'MediaImage' }> => e.__typename === 'MediaImage',
  )
}

export function onlyProduct<T extends { __typename: string }>(object: T | null | undefined) {
  return object ? onlyProducts([object]).at(0) : undefined
}

export function onlyMetaobject<T extends { __typename: string }>(object: T | null | undefined) {
  return object ? onlyMetaobjects([object]).at(0) : undefined
}

export function onlyMediaImage<T extends { __typename: string }>(object: T | null | undefined) {
  return object ? onlyMediaImages([object]).at(0) : undefined
}

export function notEmpty<TValue>(value: TValue | null | undefined): value is TValue {
  return value !== null && value !== undefined
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
