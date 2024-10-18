<script lang="ts">
  import { fragment, graphql, type PriceFragment$data } from '$houdini'
  import { formatPrice } from '$lib'

  let className = ''
  export { className as class }
  export let price: PriceFragment$data | undefined

  graphql(`
    fragment PriceFragment on MoneyV2 {
      amount
      currencyCode
    }
  `)
</script>

<span class={className}>{price ? formatPrice(price) : '-'}</span>
