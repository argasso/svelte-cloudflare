<script lang="ts" context="module">
  export const priceFragment = graphql(`
    fragment PriceFragment on MoneyV2 @_unmask {
      amount
      currencyCode
    }
  `)
</script>

<script lang="ts">
  import { formatPrice } from '$lib'
  import { graphql, type FragmentOf } from '../../graphql'

  let className = ''
  export { className as class }
  export let price: FragmentOf<typeof priceFragment>
</script>

<span class={className}>{price ? formatPrice(price) : '-'}</span>
