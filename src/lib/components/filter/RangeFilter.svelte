<script lang="ts">
  import { Slider } from '$lib/components/ui/slider'
  import { getShortKey, isPrice, type EnhancedFilter } from './shopifyFilters'
  import { getQueryStore } from '$lib/stores/URLSearchParamsStore'

  export let filter: EnhancedFilter
  export let formId: string
  export let requestSubmit: () => void

  $: console.log('filter', filter)
  const [rangeMin, rangeMax, min, max] = filter.values[0].value
    .split(' ')
    .map((v) => parseInt(v, 10))

  let range = [rangeMin, rangeMax]

  $: unset = range[0] === min && range[1] === max
  $: range && debouncedQuery()
  //  $: $query?.length !== 2 && resetRange()

  let timer: NodeJS.Timeout

  function debouncedQuery() {
    console.log('in debounce')
    clearTimeout(timer)
    timer = setTimeout(requestSubmit, 500)
  }

  function setQuery() {
    // if (unset) {
    //   $query = []
    // } else {
    //   $query = [...range.map(String)]
    // }
    console.log('setQuery', range, unset)
  }

  // function resetRange() {
  //   console.log('resetRange')

  //   // if (!range.includes(min) || !range.includes(max)) {
  //   //   range = [min, max]
  //   // }
  // }
</script>

<div class="pb-2">
  <div class:unset class="p-2">
    <Slider bind:value={range} {min} {max} step={1} />
  </div>
  <div class="flex justify-between">
    <div class="w-20">
      <label class="text-sm font-light" for={`${filter.id}-min`}>som lägst</label>
      <input
        data-vaul-no-drag
        class="h-8 w-20 rounded"
        type="number"
        name="min"
        id={`${filter.id}-min`}
        form={formId}
        bind:value={range[0]}
      />
    </div>
    <div class="w-20">
      <label class="text-sm font-light" for={`${filter.id}-max`}>som högst</label>
      <input
        data-vaul-no-drag
        class="h-8 w-20 rounded"
        type="number"
        name="max"
        id={`${filter.id}-max`}
        form={formId}
        bind:value={range[1]}
      />
    </div>
  </div>
</div>
