<script lang="ts">
  import Button from './Button.svelte'
  import { cn } from '$lib/utils.js'
  import ChevronLeft from 'lucide-svelte/icons/chevron-left'
  import ChevronRight from 'lucide-svelte/icons/chevron-right'
  import type { HTMLAttributes } from 'svelte/elements'
  import { sizeOptions, sortOptions, type EnhancedFilter } from './filter/shopifyFilters'
  import type { TProducts } from './ProductsGrid.svelte'
  import Toggle from './Toggle.svelte'

  interface $$Props extends HTMLAttributes<HTMLDivElement> {
    count: number
    filters: EnhancedFilter[]
    filtersOn: boolean
    pageInfo: TProducts['pageInfo']
    requestSubmit: () => void
  }
  let className: $$Props['class'] = undefined
  export { className as class }
  export let count: $$Props['count']
  export let pageInfo: $$Props['pageInfo']
  export let requestSubmit: $$Props['requestSubmit']
</script>

<div class={cn('flex flex-wrap items-center gap-2 text-sm text-gray-600', className)}>
  <div class="mr-2">
    {#if pageInfo.totalCount > pageInfo.pageSize}
      Visar {count} av {pageInfo.totalCount} böcker
    {:else if count === 1}
      Visar {count} bok
    {:else}
      Visar {count} böcker
    {/if}
  </div>

  <select
    class="block px-4 py-2 pr-8 text-sm leading-tight"
    name="sort"
    value={pageInfo.pageSort}
    on:change={requestSubmit}
  >
    {#each sortOptions as { value, label }}
      <option {value} selected={value === pageInfo.pageSort}>{label}</option>
    {/each}
  </select>

  <select
    class="block px-4 py-2 pr-8 text-sm leading-tight"
    name="size"
    value={pageInfo.pageSize}
    on:change={requestSubmit}
  >
    {#each sizeOptions as size}
      <option value={size} selected={size == pageInfo.pageSize}>{size} per sida</option>
    {/each}
  </select>

  <div class="flex flex-1 justify-center gap-2">
    <Button
      id="before"
      type="submit"
      name="before"
      value={pageInfo.startCursor}
      variant="outline"
      class="gap-1 pl-2.5 font-normal"
      disabled={!pageInfo.hasPreviousPage}
    >
      <ChevronLeft class="h-4 w-4" />
      <span>Föregående</span>
    </Button>

    <Button
      id="after"
      type="submit"
      name="after"
      value={pageInfo.endCursor}
      variant="outline"
      class="gap-1 pr-2.5  font-normal"
      disabled={!pageInfo.hasNextPage}
    >
      <span>Nästa</span>
      <ChevronRight class="h-4 w-4" />
    </Button>
  </div>
  <div class="flex justify-end">
    <div class="js-only">
      <Toggle name="filters" {requestSubmit}>Visa urvalsfilter</Toggle>
    </div>
    <noscript>
      <Button type="submit" variant="outline">Filtrera</Button>
    </noscript>
  </div>
</div>
