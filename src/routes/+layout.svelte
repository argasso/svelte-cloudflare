<script lang="ts">
  import { browser } from '$app/environment'
  import Footer from '$lib/components/Footer.svelte'
  // import LightSwitch from '$lib/components/LightSwitch.svelte'
  import MobileNav from '$lib/components/MobileNav.svelte'
  import NavLink from '$lib/components/NavLink.svelte'
  // import NavMenuMega from '$lib/components/NavMenuMega.svelte'
  import Logo from '$lib/components/logo/Logo.svelte'
  // import Cart from '$lib/components/shopify/Cart.svelte'
  // import ShopifySearch from '$lib/components/shopify/ShopifySearch.svelte'
  // import { Toaster } from '$lib/components/ui/sonner'
  import { makeMenu } from '$lib/menu'
  // import { initiateCart, refreshCart } from '$lib/shopify'
  // import { isCartOpen, noScroll } from '$lib/stores/store'
  // import { ModeWatcher } from 'mode-watcher'
  import { onMount } from 'svelte'
  // import '../app.pcss'
  import '../app.css'
  import NavMenuMega from '$lib/components/NavMenuMega.svelte'
  import { Drawer } from 'vaul-svelte'
  import { Toaster } from 'svelte-sonner'
  export let data

  let headerHeight = 0
  let scrollY = 0
  let prevY = 0
  let top = 0
  let headerEl: HTMLElement

  $: ({ mainMenu } = data)
  $: menuItems = mainMenu?.children ?? []
</script>

<Toaster />

<div data-vaul-drawer-wrapper class="flex h-dvh flex-col">
  <header
    class:scrolled={scrollY > 0}
    class="gradient sticky top-0 z-10 flex items-stretch font-sans"
    style:transform="translateY({-top}px)"
    bind:this={headerEl}
  >
    <div class="container flex h-[var(--header-height)] justify-between">
      <nav class="flex items-stretch gap-4">
        {#if mainMenu}
          <div class="flex items-center md:hidden">
            <MobileNav menu={mainMenu} />
          </div>
        {/if}
        <NavLink href="/" exact={true}>
          <Logo class="h-10 w-28" />
        </NavLink>
        <NavMenuMega class="hidden md:flex" {menuItems}></NavMenuMega>
      </nav>
      <nav class="flex shrink-0 items-center gap-0">
        <!-- <ShopifySearch />
        <LightSwitch />
        <Cart /> -->
      </nav>
    </div>
  </header>

  <main class="-mb-12 flex-1">
    <slot />
  </main>

  <Footer />
</div>
