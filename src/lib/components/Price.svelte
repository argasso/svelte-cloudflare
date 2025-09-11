<script lang="ts">
  import { formatPrice, formatPriceHideZero } from '$lib'
  import type { TPriceFragment } from './Price.graphql'

  let className = ''
  export { className as class }
  export let price: TPriceFragment
</script>

<span class={className}>{price ? formatPriceHideZero(price) : '-'}</span>
