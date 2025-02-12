<script lang="ts">
  import type { MenuItem } from '$lib/menu'
  import { cn } from '$lib/utils'
  import Button from './Button.svelte'
  import NavLink from './NavLink.svelte'
  import NavMenuMegaItem from './NavMenuMegaItem.svelte'

  let className = ''
  export { className as class }
  export let menuItems: MenuItem[]
</script>

{#each menuItems as { href, name, children }}
  <div class="flex gap-1 {className}">
    <NavLink {href}>{name}</NavLink>
    {#if children?.length > 0}
      <Button
        aria-label="Meny - {name}"
        variant="header"
        size="icon"
        popovertarget={name}
        class="self-center transition-transform [&:has(+:popover-open)_.left]:-rotate-45 [&:has(+:popover-open)_.right]:rotate-45"
      >
        <div class="flex h-6 w-6">
          <div class="flex items-center overflow-hidden">
            <span
              class={cn([
                'h-0 w-3 border border-white bg-white transition-transform duration-200',
                'left translate-x-[3px] rotate-45 rounded-l-full',
              ])}
            ></span>
          </div>
          <div class="flex items-center overflow-hidden">
            <span
              class={cn([
                'h-0 w-3 border border-white bg-white transition-transform duration-200',
                'right -translate-x-[3px] -rotate-45 rounded-r-full',
              ])}
            ></span>
          </div>
        </div>
      </Button>
      <div
        popover="auto"
        id={name}
        class="container absolute inset-y-auto top-[var(--header-height)] w-full bg-transparent drop-shadow-md"
      >
        <div class="flex grow items-stretch gap-2 rounded-lg bg-muted p-2 text-primary">
          {#each children as child}
            <ul class="grow list-none rounded-lg bg-background p-3">
              <NavMenuMegaItem
                class="text-base font-bold"
                menuItem={child}
                on:click={() => document.getElementById(name)?.hidePopover()}
              />
            </ul>
          {/each}
        </div>
      </div>
    {/if}
  </div>
{/each}

<style>
  dialog {
    opacity: 0;
    transform: translateY(10px);
    transition:
      display 300ms,
      opacity 300ms,
      all 300ms;
    transition-behavior: allow-discrete;
  }
  dialog:popover-open {
    opacity: 1;
    transform: translateY(0);
    @starting-style {
      opacity: 0;
      transform: translateY(10px);
    }
  }
</style>
