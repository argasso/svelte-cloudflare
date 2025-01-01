<script lang="ts">
  import { getShortValue, type EnhancedFilter } from './shopifyFilters'
  import ListFilterItem from './ListFilterItem.svelte'
  import Button from '../Button.svelte'

  export let filter: EnhancedFilter

  let size = 10
  let value = ''
  $: filtered = filter.values
    .filter((v) => v.label.toLowerCase().includes(value.toLowerCase()))
    .map(getShortValue)
  $: visible = filtered.slice(0, size)
</script>

{#if filter.values.length > 10}
  <input placeholder="Sök..." class="text-xs" type="text" bind:value />
{/if}
{#if filter.values.length > 0}
  <ul>
    {#each filter.values as item}
      <ListFilterItem
        class={visible.includes(getShortValue(item)) ? '' : 'hidden'}
        key={filter.key}
        {item}
      />
    {/each}
  </ul>
{:else}
  <i class="text-sm">Inga alternativ tillgängliga</i>
{/if}
{#if filtered.length > size}
  <div class="m-2 text-xs italic">
    {filter.values.length - size} alternativ visas inte.
    <button
      class="italic text-primary"
      on:click={() => {
        size += 10
      }}>Klicka för fler.</button
    >
  </div>
{/if}
<noscript>
  <div class="w-full p-1 py-3">
    <Button type="submit" class="w-full">Gör urval</Button>
  </div>
</noscript>
