<script lang="ts">
  import Footer from '$lib/components/Footer.svelte'
  import LightSwitch from '$lib/components/LightSwitch.svelte'
  import NavLink from '$lib/components/NavLink.svelte'
  import NavMenuMega from '$lib/components/NavMenuMega.svelte'
  import Logo from '$lib/components/logo/Logo.svelte'
  import { onMount } from 'svelte'

  import Cart from '$lib/components/Cart.svelte'
  import MobileNav from '$lib/components/MobileNav.svelte'
  import Search from '$lib/components/search/Search.svelte'
  import { tryInitConcentBanner } from '$lib/shopify'
  import { getCart } from '$lib/stores/cartStore'
  import { Toaster } from 'svelte-sonner'
  import '../app.css'
  import { ModeWatcher } from 'mode-watcher'
  
  export let data

  let headerHeight = 0
  let scrollY = 0
  let prevY = 0
  let top = 0
  let headerEl: HTMLElement

  onMount(async () => {
    getCart()
    // For header scrolling
    headerHeight = headerEl.clientHeight
    prevY = headerEl.offsetTop

    // Shopify concent banner
    // script is async/defer; it might not be ready on first call
    if (!tryInitConcentBanner()) {
      const interval = setInterval(() => {
        if (tryInitConcentBanner()) clearInterval(interval)
      }, 200)
    }
  })

  $: ({ menu, informationMenu } = data)
  $: menuItems = menu?.children ?? []
</script>

<div data-vaul-drawer-wrapper class="flex h-dvh flex-col">
  <header
    class:scrolled={scrollY > 0}
    class="gradient flex items-stretch text-white"
    style:transform="translateY({-top}px)"
    bind:this={headerEl}
  >
    <div class="container flex h-[var(--header-height)] justify-between">
      <nav class="flex items-stretch gap-6">
        {#if menu}
          <div class="flex items-center md:hidden">
            <MobileNav {menu} />
          </div>
        {/if}
        <NavLink href="/" exact={true}>
          <Logo class="h-10 w-28" />
        </NavLink>
        <NavMenuMega {menuItems} class="hidden md:flex" />
      </nav>
      <nav class="flex shrink-0 items-center">
        <Search />
        <LightSwitch />
        <Cart />
      </nav>
    </div>
  </header>

  <main class="flex-1">
    <slot />
  </main>

  <Footer {informationMenu} />
</div>

<Toaster />

<ModeWatcher />
