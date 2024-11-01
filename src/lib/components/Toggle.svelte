<script lang="ts">
  import { isFilterOpen } from '$lib/stores/store'

  export let name: string
  export let requestSubmit
</script>

<label class="inline-flex cursor-pointer items-center">
  <input
    type="checkbox"
    {name}
    class="filters peer sr-only"
    on:change={requestSubmit}
    bind:checked={$isFilterOpen}
  />
  <div
    class="peer relative h-6 w-11 rounded-full bg-gray-300 after:absolute after:start-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-argasso-400 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-0 peer-focus-visible:ring-4 dark:border-gray-600 dark:bg-gray-700 dark:peer-focus:ring-argasso-800 rtl:peer-checked:after:-translate-x-full"
  ></div>
  <span class="ms-3 text-sm text-card-foreground dark:text-gray-300">
    <slot />
  </span>
</label>
