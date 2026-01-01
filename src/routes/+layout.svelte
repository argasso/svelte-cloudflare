<script lang="ts">
  // import { browser } from '$app/environment'
  import Footer from '$lib/components/Footer.svelte'
  import LightSwitch from '$lib/components/LightSwitch.svelte'
  // import MobileNav from '$lib/components/MobileNav.svelte'
  import NavLink from '$lib/components/NavLink.svelte'
  import NavMenuMega from '$lib/components/NavMenuMega.svelte'
  import Logo from '$lib/components/logo/Logo.svelte'
  // import Cart from '$lib/components/Cart.svelte'
  // import ShopifySearch from '$lib/components/shopify/ShopifySearch.svelte'
  // import { Toaster } from 'svelte-sonner'
  // import { initiateCart, refreshCart } from '$lib/shopify'
  // import { getCart, isCartOpen, noScroll } from '$lib/stores/store'
  import { ModeWatcher } from 'mode-watcher'
  import { onMount } from 'svelte'

  import '../app.css'
  import { getCart } from '$lib/stores/cartStore'
  import Cart from '$lib/components/Cart.svelte'
  import { Toaster } from 'svelte-sonner'
  import MobileNav from '$lib/components/MobileNav.svelte'
  import Search from '$lib/components/search/Search.svelte'
  import { enhance } from '$app/forms'
  import CookieBanner from '$lib/components/CookieBanner.svelte'

  export let data

  const STOREFRONT_DOMAIN = 'argasso.se'
  const CHECKOUT_DOMAIN = 'shop.argasso.se'
  const SF_API_TOKEN = 'ff151810f966c1536e2d3b4fd437f38e' // Obtained in the previous section
  const LOCALE = 'se_SV'
  const COUNTRY = 'se'

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
    const tryInit = () => {
      if (!window.privacyBanner) return false

      window.privacyBanner
        .loadBanner({
          storefrontAccessToken: SF_API_TOKEN,
          checkoutRootDomain: CHECKOUT_DOMAIN,
          storefrontRootDomain: STOREFRONT_DOMAIN,
          // Optional
          locale: LOCALE,
          country: COUNTRY,
        })
        .then(() => {
          console.log('Shopify cookie banner loaded')
        })
        .catch((err) => {
          console.error('Error loading Shopify cookie banner', err)
        })

      return true
    }

    // script is async/defer; it might not be ready on first call
    if (!tryInit()) {
      const interval = setInterval(() => {
        if (tryInit()) clearInterval(interval)
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

<!-- <ModeWatcher /> -->

<!-- <CookieBanner /> -->
