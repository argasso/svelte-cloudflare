<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements'
  import type { TProducts } from '../ProductsGrid.gql'
  import { afterNavigate } from '$app/navigation'
  import { isProductsLoading } from '$lib/stores/store'
  import { getDecendants } from '../filter/shopifyFilters'

  interface $$Props extends HTMLAttributes<HTMLFormElement> {
    filters?: TProducts['filters']
    after?: TProducts['queryParams']['after']
    before?: TProducts['queryParams']['before']
    size?: TProducts['queryParams']['size']
    sort?: TProducts['queryParams']['sort']
    noScroll?: boolean
  }

  let className: $$Props['class'] = ''
  export { className as class }
  export let filters: $$Props['filters'] = []
  export let after: $$Props['after'] = undefined
  export let before: $$Props['before'] = undefined
  export let size: $$Props['size'] = undefined
  export let sort: $$Props['sort'] = undefined
  export let noScroll: $$Props['noScroll'] = true

  afterNavigate(() => {
    $isProductsLoading = false
  })

  function handleSubmit() {
    $isProductsLoading = true
  }

  $: activeFilters = filters
    ?.flatMap(({ values }) => values.flatMap(getDecendants))
    .filter((v) => v.active)
</script>

<form
  action="#book-section"
  data-sveltekit-keepfocus
  data-sveltekit-noscroll={noScroll}
  class={className}
  on:submit={handleSubmit}
>
  {#if after}
    <input type="hidden" name="after" value={after} />
  {/if}
  {#if before}
    <input type="hidden" name="before" value={before} />
  {/if}
  {#if size}
    <input type="hidden" name="size" value={size} />
  {/if}
  {#if sort}
    <input type="hidden" name="sort" value={sort} />
  {/if}
  {#if activeFilters}
    {#each activeFilters as { key, value, filterType }}
      {#if filterType === 'PRICE_RANGE'}
        <input type="hidden" name={key} value={value.split(' ').at(0)} />
        <input type="hidden" name={key} value={value.split(' ').at(1)} />
      {:else}
        <input type="hidden" name={key} {value} />
      {/if}
    {/each}
  {/if}
  <slot />
</form>
