<script lang="ts">
  import { page } from '$app/stores'
  import type { MenuItem } from '$lib/menu'
  import NavMenuMegaItem from './NavMenuMegaItem.svelte'
  import { cn } from '$lib/utils.js'

  let className = ''
  export { className as class }
  export let menuItems: MenuItem[]
  export let exact = false

  $: megaItems = menuItems.map((menuItem) => {
    const active =
      $page.url.pathname && menuItem.href && exact
        ? $page.url.pathname === menuItem.href
        : $page.url.pathname.includes(menuItem.href)
    return { ...menuItem, active }
  })
</script>

<div class="mega-container {className}">
  {#each megaItems as { active, href, name, children }}
    <div class="mega-item">
      <a class="mega-item-link" class:active role="menu" {href}>
        <span class="my-auto">{name}</span>
      </a>
      {#if children.length > 0}
        <div class="mega-dropdown container">
          <div class="flex grow">
            <div class="flex grow items-stretch gap-2 rounded bg-muted p-2 text-primary">
              {#each children as child}
                <ul class="grow list-none rounded bg-background p-3">
                  <a class="block rounded px-4 py-2 font-bold hover:bg-slate-100" href={child.href}
                    >{child.name}</a
                  >
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
      {/if}
    </div>
  {/each}
</div>

<style>
  .mega-container {
    pointer-events: none;
    display: flex;
    gap: 1rem;
  }

  .mega-item {
    pointer-events: all;
    display: flex;
  }

  .mega-item-link {
    color: white;
    margin-bottom: 2px;
    margin-top: 6px;
    display: flex;
    height: auto;
    border-radius: 0;
    border-width: 0;
    border-bottom-width: 4px;
    border-color: transparent;
    text-decoration-line: none;
    position: relative;
  }

  .mega-dropdown {
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

  .mega-container:not(:focus-within) > .mega-item:hover > .mega-dropdown,
  .mega-item:focus-within .mega-dropdown {
    grid-template-rows: 1fr;
  }

  .mega-container:not(:focus-within) > .mega-item:has(.mega-dropdown):hover > .mega-item-link:after,
  .mega-item:has(.mega-dropdown):focus-within > .mega-item-link:after {
    content: '';
    width: 0;
    height: 0;
    border-left: 7px solid transparent;
    border-right: 7px solid transparent;
    border-bottom: 7px solid hsl(var(--muted));
    position: absolute;
    bottom: -6px;
    left: 50%;
    margin-left: -5px;
  }

  .mega-item:not(:has(.mega-dropdown)) > .mega-item-link:hover {
    border-color: rgb(255 255 255 / 0.7);
  }

  .mega-item:not(:focus-within):not(:hover) > .mega-item-link.active {
    text-decoration-line: none;
    border-color: white;
  }
</style>
