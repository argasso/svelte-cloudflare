<script lang="ts">
  import Button from './Button.svelte'
  import { cn } from '$lib/utils.js'
  import ChevronLeft from 'lucide-svelte/icons/chevron-left'
  import ChevronRight from 'lucide-svelte/icons/chevron-right'
  import type { HTMLAttributes } from 'svelte/elements'
  import { sizeOptions, sortOptions, type EnhancedFilter } from './filter/shopifyFilters'
  import type { TProducts } from './ProductsGrid.gql'
  import Toggle from './Toggle.svelte'
  import MobileFilter from './filter/MobileFilter.svelte'
  import Logo from './logo/Logo.svelte'
  import ProductsGridForm from './grid/ProductsGridForm.svelte'

  interface $$Props extends HTMLAttributes<HTMLDivElement> {
    products: TProducts
  }

  let className: $$Props['class'] = undefined
  export { className as class }
  export let products: $$Props['products']

  $: ({ filters, pageSize, pageSort, pageInfo, queryParams } = products)
  $: ({ after, before, size, sort } = queryParams)
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

  <ProductsGridForm {filters} {after} {before} class="gap-2 sm:flex">
    <select
      class="bg-background px-4 py-2 pr-8 text-sm leading-tight hover:border-argasso-500 hover:bg-argasso-500/5"
      name="sort"
      value={pageSort}
      on:change={(e) => e.currentTarget.form?.requestSubmit()}
    >
      {#each sortOptions as { value, label }}
        <option {value} selected={value === pageSort}>{label}</option>
      {/each}
    </select>

    <select
      class="bg-background px-4 py-2 pr-8 text-sm leading-tight hover:border-argasso-500 hover:bg-argasso-500/5"
      name="size"
      value={pageSize}
      on:change={(e) => e.currentTarget.form?.requestSubmit()}
    >
      {#each sizeOptions as size}
        <option value={size} selected={size == pageSize}>{size} per sida</option>
      {/each}
    </select>
  </ProductsGridForm>

  <ProductsGridForm {filters} {size} {sort} class="flex gap-2">
    <Button
      class="font-light"
      variant="outline"
      type="submit"
      name="before"
      value={pageInfo.startCursor}
      disabled={!pageInfo.hasPreviousPage}
    >
      <ChevronLeft class="h-4 w-4" />
      <span class="hidden md:inline-block">Föregående</span>
      <span class="hidden lg:inline-block">sida</span>
    </Button>

    <Button
      class="font-light"
      variant="outline"
      type="submit"
      name="after"
      value={pageInfo.endCursor}
      disabled={!pageInfo.hasNextPage}
    >
      <span class="hidden md:inline-block">Nästa</span>
      <span class="hidden lg:inline-block">sida</span>
      <ChevronRight class="h-4 w-4" />
    </Button>
  </ProductsGridForm>

  <div class="flex flex-1 justify-end">
    <Toggle class="js-only hidden md:block" name="filters">Urvalsfilter</Toggle>
    <div class="js-only md:hidden">
      <MobileFilter {products} />
    </div>
    <noscript>
      <Button type="submit" name="reset" value="filters" variant="default">Rensa urval</Button>
    </noscript>
  </div>
</div>
