<script lang="ts">
  import ReadingLevel from '$lib/components/ReadingLevel.svelte'
  import { slide } from 'svelte/transition'
  import { type EnhancedFilterItem } from './shopifyFilters'

  let className = ''
  export { className as class }
  export let key: string
  export let item: EnhancedFilterItem

  $: ({ label, value, count, active: checked, children = [] } = item)
</script>

<li class={className}>
  <label class="flex items-center text-sm">
    <input
      type="checkbox"
      name={key}
      {value}
      {checked}
      on:change={(e) => e.currentTarget.form?.requestSubmit()}
      class="m-1 mr-2 h-6 w-6 rounded-sm text-argasso-500"
    />
    {#if key === 'reading_level'}
      <ReadingLevel level={parseInt(label)} />
    {:else}
      <span>
        {label}
      </span>
    {/if}
    {#if !checked}
      <span class="ml-auto rounded-full bg-gray-400 px-2 py-1 text-xs leading-none text-gray-50"
        >{count}</span
      >
    {/if}
  </label>
  {#if checked && children.length > 0}
    <ul class="mb-0 ml-4 list-none border-l-2 border-primary pl-2" transition:slide>
      {#each children as child}
        <svelte:self {key} item={child} />
      {/each}
    </ul>
  {/if}
</li>
