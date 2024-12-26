<script lang="ts">
  import Button from './Button.svelte'
  import { cn } from '$lib/utils.js'
  import ChevronLeft from 'lucide-svelte/icons/chevron-left'
  import ChevronRight from 'lucide-svelte/icons/chevron-right'
  import type { HTMLAttributes } from 'svelte/elements'
  import { sizeOptions, sortOptions, type EnhancedFilter } from './filter/shopifyFilters'
  import type { TProducts } from './ProductsGrid.gql'
  import Toggle from './Toggle.svelte'

  interface $$Props extends HTMLAttributes<HTMLDivElement> {
    count: number
    products: TProducts
    requestSubmit: () => void
  }

  let className: $$Props['class'] = undefined
  export { className as class }
  export let products: $$Props['products']
  export let requestSubmit: $$Props['requestSubmit']

  $: ({ pageInfo, pageSize, pageSort } = products)
</script>

<div class={cn('flex flex-wrap items-center gap-2 text-sm font-light text-foreground', className)}>
  <!-- <div class="mr-2">
    {#if totalCount > pageSize}
      Visar {count} av {totalCount} st
    {:else if count === 1}
      Visar {count} st
    {:else}
      Visar {count} st
    {/if}
  </div> -->

  <select
    class="hidden bg-background px-4 py-2 pr-8 text-sm leading-tight hover:border-argasso-500 hover:bg-argasso-500/5 md:block"
    name="sort"
    value={pageSort}
    on:change={requestSubmit}
  >
    {#each sortOptions as { value, label }}
      <option {value} selected={value === pageSort}>{label}</option>
    {/each}
  </select>

  <select
    class="hidden bg-background px-4 py-2 pr-8 text-sm leading-tight hover:border-argasso-500 hover:bg-argasso-500/5 md:block"
    name="size"
    value={pageSize}
    on:change={requestSubmit}
  >
    {#each sizeOptions as size}
      <option value={size} selected={size == pageSize}>{size} per sida</option>
    {/each}
  </select>

  <div class="flex gap-2">
    <Button
      class="font-light"
      variant="outline"
      type="submit"
      name="before"
      value={pageInfo.startCursor}
      disabled={!pageInfo.hasPreviousPage}
    >
      <ChevronLeft class="h-4 w-4" />
      <span class="hidden lg:inline-block">Föregående sida</span>
    </Button>

    <Button
      class="font-light"
      variant="outline"
      type="submit"
      name="after"
      value={pageInfo.endCursor}
      disabled={!pageInfo.hasNextPage}
    >
      <span class="hidden lg:inline-block">Nästa sida</span>
      <ChevronRight class="h-4 w-4" />
    </Button>
  </div>
  <div class="flex flex-1 justify-end">
    <div class="js-only">
      <Toggle name="filters">Urvalsfilter</Toggle>
    </div>
    <noscript>
      <Button type="submit" name="reset" value="filters" variant="default">Rensa urval</Button>
    </noscript>
  </div>
</div>
