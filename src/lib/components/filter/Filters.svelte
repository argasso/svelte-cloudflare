<script lang="ts" context="module">
  export const filtersQuery = graphql(`
    query Filters {
      collection(handle: "frontpage") {
        products(first: 0) {
          filters {
            id
            label
            type
            values {
              count
              id
              input
              label
            }
          }
        }
      }
    }
  `)
  export type TFilterQuery = typeof filtersQuery
</script>

<script lang="ts">
  import { goto } from '$app/navigation'
  import { page } from '$app/stores'
  import { graphql } from '../../../graphql'
  import Accordion from '../Accordion.svelte'
  import Icons from '../Icons.svelte'
  import ListFilter from './ListFilter.svelte'
  import RangeFilter from './RangeFilter.svelte'
  import { isShopifyFilterKey, type EnhancedFilter } from './shopifyFilters'

  export let formId: string
  export let filters: EnhancedFilter[] = []
  export let requestSubmit

  function resetFilters() {
    selectedId = null
    const query = new URLSearchParams()
    $page.url.searchParams.forEach((value, key) => {
      if (!isShopifyFilterKey(key)) {
        query.append(key, value)
      }
    })
    goto(`?${query.toString()}`)
  }

  let selectedId: string | null = null
</script>

{#each filters as filter (filter.id)}
  <Accordion name="filter" open={filter.active}>
    <div slot="title" class="flex items-center gap-1 text-sm">
      {filter.label}
      {#if filter.active}
        <Icons type="checked" class="text-card-foreground" />
      {/if}
    </div>
    {#if filter.type === 'PRICE_RANGE'}
      <!-- <RangeFilter {filter} /> -->
    {:else}
      <ListFilter {filter} {formId} {requestSubmit} />
    {/if}
  </Accordion>
{/each}
