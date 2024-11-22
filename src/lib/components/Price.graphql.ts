import { graphql, type FragmentOf } from '../../graphql'

export const priceFragment = graphql(`
  fragment PriceFragment on MoneyV2 @_unmask {
    amount
    currencyCode
  }
`)

export type TPriceFragment = FragmentOf<typeof priceFragment>
