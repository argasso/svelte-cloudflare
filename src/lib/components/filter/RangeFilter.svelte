<script lang="ts">
  import { Slider } from '$lib/components/ui/slider'
  import { type EnhancedFilter } from './shopifyFilters'

  export let filter: EnhancedFilter
  //export let requestSubmit: () => void

  $: [rangeMin, rangeMax, min, max] = filter.values[0].value.split(' ').map((v) => parseInt(v, 10))

  $: range = [rangeMin, rangeMax]

  $: unset = range[0] === min && range[1] === max

  let ref: HTMLInputElement | undefined = undefined
  let timer: NodeJS.Timeout

  function debounce(callback: ((submitter?: HTMLElement | null | undefined) => void) | undefined) {
    clearTimeout(timer)
    if (callback) {
      timer = setTimeout(callback, 500)
    }
  }

  function requestSubmit() {
    ref?.form?.requestSubmit()
  }

  function onChange() {
    debounce(requestSubmit)
  }
</script>

<div class="pb-2">
  <div class:unset class="p-2 px-3">
    <Slider bind:value={range} {min} {max} step={1} onValueChange={onChange} />
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
        on:change={onChange}
        bind:value={range[0]}
        bind:this={ref}
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
        on:change={onChange}
        bind:value={range[1]}
      />
    </div>
  </div>
</div>
