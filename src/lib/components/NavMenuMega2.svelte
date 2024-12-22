<script lang="ts">
  import { page } from '$app/stores'
  import type { MenuItem } from '$lib/menu'
  import NavMenuMegaItem from './NavMenuMegaItem2.svelte'

  export let menuItem: MenuItem
  export let exact = false
  $: active =
    $page.url.pathname && menuItem.href && exact
      ? $page.url.pathname === menuItem.href
      : $page.url.pathname.includes(menuItem.href)
  let open = false
  const shortcuts = [
    {
      label: 'Välj',
      codes: ['&crarr;'],
    },
    {
      label: 'Upp/Ned',
      codes: ['&darr;', '&uarr;'],
    },
    {
      label: 'Submeny',
      codes: ['&larr;', '&rarr;'],
    },
  ]
</script>

<div class="mega">
  <a
    role="menu"
    class={`mega-item-link rounded-none text-white hover:border-white hover:border-opacity-70 hover:no-underline ${active ? 'border-white' : ''}`}
    href={menuItem.href}
  >
    <span class="my-auto">{menuItem.name}</span>
    {#if menuItem.children.length > 0}
      <span class="arrow-up"></span>
    {/if}
  </a>
  <div class="mega-dropdown container">
    <div class="flex items-stretch gap-1 rounded bg-muted text-primary">
      {#each menuItem.children as child}
        <ul class="m-0 grow list-none rounded bg-background p-3">
          <a class="block rounded px-4 py-2 hover:bg-slate-100" href={child.href}>{child.name}</a>
          <hr />
          {#if child.children}
            {#each child.children as grandChild}
              <NavMenuMegaItem menuItem={grandChild} />
            {/each}
          {/if}
        </ul>
      {/each}
    </div>
  </div>
</div>

<style>
  .mega {
    pointer-events: none;
    display: flex;
  }

  .mega-item-link {
    pointer-events: all;
    /* margin-bottom: 2px;
    margin-top: 6px; */
    display: flex;
    height: auto;
    border-radius: 0px;
    border-bottom: 4px;
    border-color: transparent;
  }

  .mega-dropdown {
    pointer-events: all;
    position: absolute;
    left: 0;
    right: 0;
    top: 52px;
    display: grid;
    grid-template-rows: 0fr;
    transition: grid-template-rows 150ms cubic-bezier(0.4, 0, 0.2, 1);
  }
  .mega-dropdown > div {
    overflow: hidden;
  }

  .mega:hover:not(:focus-within) > .mega-dropdown,
  .mega:focus-within > .mega-dropdown {
    grid-template-rows: 1fr;
  }

  .arrow-up {
    width: 0;
    height: 0;
    border-left: 7px solid transparent;
    border-right: 7px solid transparent;
    border-bottom: 7px solid white;
    display: none;
  }

  @starting-style {
    .container {
      opacity: 0;
      display: none;
    }
  }
</style>
