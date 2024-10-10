<script lang="ts">
  import type { MenuItem } from '$lib/menu'

  export let menuItem: MenuItem
  export let open = false

  $: ({ href, name, children } = menuItem)
</script>

<li class="text-sm">
  <a class="block rounded px-4 py-2 hover:bg-slate-100" {href}>
    {name}
  </a>
  {#if children.length && open}
    <ul class="m-0 list-none p-0 pl-3.5">
      {#each children as child}
        <svelte:self menuItem={child} />
      {/each}
    </ul>
  {/if}
</li>
