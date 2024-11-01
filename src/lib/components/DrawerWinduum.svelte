<script lang="ts">
  import {
    showDrawer,
    closeDrawer,
    scrollDrawer,
    scrollInitDrawer,
  } from 'winduum/src/components/drawer'

  let drawerLeftElement

  async function onClick(e) {
    drawerLeftElement.showModal()

    await scrollInitDrawer(drawerLeftElement)

    showDrawer(drawerLeftElement)
  }
</script>

<button class="x-button" id="showDrawerLeftElement" on:click={onClick}>Show drawer</button>
<dialog
  class="x-drawer"
  bind:this={drawerLeftElement}
  id="drawerLeftElement"
  inert
  on:scroll={({ target }) => scrollDrawer(target)}
>
  <nav class="x-drawer-content">
    Drawer content
    <button class="x-button muted" id="closeDrawerLeftElement">Close drawer</button>
  </nav>
</dialog>

<style>
  /* .x-drawer {
    --x-drawer-content-background-color: var(--color-body-primary);
    --x-drawer-content-padding-block: 2rem;
    --x-drawer-content-padding-inline: 1.5rem;
    --x-drawer-content-inline-size: 100%;
    --x-drawer-content-block-size: 100%;

    --x-drawer-background-color-opacity: 75%;
  }

  .x-drawer-content {
    inline-size: var(--x-drawer-content-inline-size);
    block-size: var(--x-drawer-content-block-size);
    background-color: var(--x-drawer-content-background-color);
    flex-shrink: 0;
    scroll-snap-align: end;
  }

  .x-drawer {
    z-index: var(--x-drawer-z-index, var(--z-index-30));
    background-color: color-mix(
      in var(--x-drawer-background-color-space, srgb),
      var(--color-dark)
        calc(var(--background-color-opacity, 0) * var(--x-drawer-background-color-opacity)),
      var(--x-drawer-background-color-mix, transparent)
    );
    position: fixed;
    inset: 0;
    display: flex;
    overflow: auto hidden;
    scrollbar-width: none;
    scroll-behavior: smooth;
    -webkit-overflow-scrolling: touch;
    overscroll-behavior: contain;

    &:not([open]),
    &::backdrop {
      display: none;
    }

    &::-webkit-scrollbar {
      display: none;
    }

    &::after {
      content: '';
      min-inline-size: 100vw;
      scroll-snap-align: end;
    }

    &.flex-col {
      overflow: hidden auto;

      &::after {
        min-block-size: 100dvh;
      }
    }
  } */
</style>
