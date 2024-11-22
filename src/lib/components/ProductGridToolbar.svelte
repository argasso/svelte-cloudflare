<script lang="ts">
  import Button from './Button.svelte'
  import { cn } from '$lib/utils.js'
  import ChevronLeft from 'lucide-svelte/icons/chevron-left'
  import ChevronRight from 'lucide-svelte/icons/chevron-right'
  import type { HTMLAttributes } from 'svelte/elements'
  import { sizeOptions, sortOptions, type EnhancedFilter } from './filter/shopifyFilters'
  import type { TProducts } from './ProductsGrid.gql'
  import Toggle from './Toggle.svelte'
  import Separator from './ui/separator/separator.svelte'

  interface $$Props extends HTMLAttributes<HTMLDivElement> {
    count: number
    pageInfo: TProducts['pageInfo']
    requestSubmit: () => void
  }

  let className: $$Props['class'] = undefined
  export { className as class }
  export let count: $$Props['count']
  export let pageInfo: $$Props['pageInfo']
  export let requestSubmit: $$Props['requestSubmit']
</script>

<div class={cn('flex flex-wrap items-center gap-2 text-sm font-light text-foreground', className)}>
  <div class="mr-2">
    {#if pageInfo.totalCount > pageInfo.pageSize}
      Visar {count} av {pageInfo.totalCount} st
    {:else if count === 1}
      Visar {count} st
    {:else}
      Visar {count} st
    {/if}
  </div>

  <select
    class="hidden px-4 py-2 pr-8 text-sm leading-tight md:block"
    name="sort"
    value={pageInfo.pageSort}
    on:change={requestSubmit}
  >
    {#each sortOptions as { value, label }}
      <option {value} selected={value === pageInfo.pageSort}>{label}</option>
    {/each}
  </select>

  <select
    class="hidden px-4 py-2 pr-8 text-sm leading-tight md:block"
    name="size"
    value={pageInfo.pageSize}
    on:change={requestSubmit}
  >
    {#each sizeOptions as size}
      <option value={size} selected={size == pageInfo.pageSize}>{size} per sida</option>
    {/each}
  </select>

  <div class="flex gap-2">
    <button
      class="bg-background px-4"
      type="submit"
      name="before"
      value={pageInfo.startCursor}
      disabled={!pageInfo.hasPreviousPage}
    >
      <ChevronLeft class="h-4 w-4" />
      <span class="hidden lg:inline-block">Föregående sida</span>
    </button>

    <button
      class="bg-background px-4"
      type="submit"
      name="after"
      value={pageInfo.endCursor}
      disabled={!pageInfo.hasNextPage}
    >
      <span class="hidden lg:inline-block">Nästa sida</span>
      <ChevronRight class="h-4 w-4" />
    </button>
  </div>
  <div class="flex flex-1 justify-end">
    <div class="js-only">
      <Toggle name="filters">Urvalsfilter</Toggle>
    </div>
    <noscript>
      <Button type="submit" variant="outline">Filtrera</Button>
    </noscript>
  </div>
</div>
