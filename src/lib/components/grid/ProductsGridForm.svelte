<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements'
  import type { TProducts } from '../ProductsGrid.gql'

  interface $$Props extends HTMLAttributes<HTMLFormElement> {
    filters?: TProducts['filters']
    after?: TProducts['queryParams']['after']
    before?: TProducts['queryParams']['before']
    size?: TProducts['queryParams']['size']
    sort?: TProducts['queryParams']['sort']
  }

  let className: $$Props['class'] = ''
  export { className as class }
  export let filters: $$Props['filters'] = []
  export let after: $$Props['after'] = undefined
  export let before: $$Props['before'] = undefined
  export let size: $$Props['size'] = undefined
  export let sort: $$Props['sort'] = undefined

  $: activeFilters = filters
    ?.flatMap((f) => f.values)
    .filter((v) => v.active)
    .map(({ key, value }) => ({ key, value }))
  $: console.log(
    'setting default form values',
    { activeFilters },
    { after },
    { before },
    { size },
    { sort },
  )
</script>

<form data-sveltekit-keepfocus data-sveltekit-noscroll class={className}>
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
    {#each activeFilters as { key, value }}
      <input type="hidden" name={key} {value} />
    {/each}
  {/if}
  <slot />
</form>
