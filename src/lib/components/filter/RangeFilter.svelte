<script lang="ts">
  import { Slider } from '$lib/components/ui/slider'
  import { type EnhancedFilter } from './shopifyFilters'

  export let filter: EnhancedFilter
  export let formId: string
  export let requestSubmit: () => void

  const [rangeMin, rangeMax, min, max] = filter.values[0].value
    .split(' ')
    .map((v) => parseInt(v, 10))

  let range = [rangeMin, rangeMax]

  $: unset = range[0] === min && range[1] === max
  $: range && debouncedQuery()

  let timer: NodeJS.Timeout

  function debouncedQuery() {
    clearTimeout(timer)
    timer = setTimeout(requestSubmit, 500)
  }
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
        name="price"
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
        name="price"
        id={`${filter.id}-max`}
        form={formId}
        bind:value={range[1]}
      />
    </div>
  </div>
</div>
