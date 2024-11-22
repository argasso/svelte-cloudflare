<script lang="ts">
  import Cross from 'lucide-svelte/icons/x'
  import { getQueryStore } from '$lib/stores/URLSearchParamsStore'
  import { getDecendants, type EnhancedFilterItem } from './shopifyFilters'
  import Button from '../Button.svelte'

  export let filter: EnhancedFilterItem

  const query = getQueryStore(filter.key)
  $: label = getLabel(filter)

  $: decendantValues = getDecendants(filter).map((i) => i.value)

  function getLabel(filter: EnhancedFilterItem) {
    switch (filter.filterType) {
      case 'PRICE_RANGE':
        return `${filter.label} ${filter.value.replace('.', ' - ')}`
      case 'BOOLEAN':
        return `${filter.filterLabel} ${filter.label}`
      default:
        return filter.key === 'reading_level'
          ? `${filter.filterLabel} ${filter.label}`
          : filter.label
    }
  }

  function remove() {
    if (filter.filterType === 'PRICE_RANGE') {
      query.update(() => [])
    } else {
      query.update((values) => values.filter((v) => !decendantValues.includes(v)))
    }
  }
</script>

<Button
  size="sm"
  variant="default"
  class="group h-6 rounded-full border-transparent p-2 pl-3 focus-visible:ring"
  type="submit"
  name="reset"
  value={filter.id}
>
  {label}
  <Cross
    class="h-4 w-4 rounded-full border border-transparent opacity-70 group-hover:bg-white group-hover:text-foreground group-focus-visible:bg-white group-focus-visible:text-foreground"
  />
</Button>
