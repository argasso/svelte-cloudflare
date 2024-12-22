<script lang="ts">
  import type { MenuItem } from '$lib/menu'

  let className = ''
  export { className as class }
  export let menuItem: MenuItem

  $: ({ href, name, children } = menuItem)
</script>

<li class="text-sm">
  <a
    on:click
    class="block rounded px-4 py-2 text-muted-foreground hover:bg-accent hover:text-primary hover:underline {className}"
    {href}
  >
    {name}
  </a>
  {#if children.length}
    <ul class="m-0 list-none p-0">
      {#each children as child}
        <svelte:self on:click menuItem={child} />
      {/each}
    </ul>
  {/if}
</li>
