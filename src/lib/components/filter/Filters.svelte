<script lang="ts">
  import Accordion from '../Accordion.svelte'
  import ProductsGridForm from '../grid/ProductsGridForm.svelte'
  import Icons from '../Icons.svelte'
  import type { TProducts } from '../ProductsGrid.gql'
  import ListFilter from './ListFilter.svelte'
  import RangeFilter from './RangeFilter.svelte'

  export let products: TProducts

  $: ({ filters = [], queryParams } = products)
  $: ({ after, before, size, sort } = queryParams)
</script>

<ProductsGridForm {after} {before} {size} {sort}>
  {#each filters as filter (filter.id)}
    <Accordion name="filter">
      <div slot="title" class="flex items-center gap-1 text-sm">
        {filter.label}
        {#if filter.active}
          <Icons type="checked" class="text-card-foreground" />
        {/if}
      </div>
      {#if filter.type === 'PRICE_RANGE'}
        <RangeFilter {filter} />
      {:else}
        <ListFilter {filter} />
      {/if}
    </Accordion>
    <hr />
  {/each}
</ProductsGridForm>
