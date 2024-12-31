<script lang="ts">
  import Accordion from '../Accordion.svelte'
  import Icons from '../Icons.svelte'
  import ListFilter from './ListFilter.svelte'
  import RangeFilter from './RangeFilter.svelte'
  import { type EnhancedFilter } from './shopifyFilters'

  export let formId: string
  export let filters: EnhancedFilter[] = []
  export let requestSubmit: () => void
</script>

{#each filters as filter (filter.id)}
  <hr />
  <Accordion name="filter">
    <div slot="title" class="flex items-center gap-1 text-sm">
      {filter.label}
      {#if filter.active}
        <Icons type="checked" class="text-card-foreground" />
      {/if}
    </div>
    {#if filter.type === 'PRICE_RANGE'}
      <RangeFilter {filter} {formId} {requestSubmit} />
    {:else}
      <ListFilter {filter} {formId} {requestSubmit} />
    {/if}
  </Accordion>
{/each}
