<script lang="ts">
  import { browser } from '$app/environment'
  import Footer from '$lib/components/Footer.svelte'
  // import LightSwitch from '$lib/components/LightSwitch.svelte'
  // import MobileNav from '$lib/components/MobileNav.svelte'
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

  export let data

  let headerHeight = 0
  let scrollY = 0
  let prevY = 0
  let top = 0
  let headerEl: HTMLElement

  $: ({ MainMenu } = data)

  $: menu = makeMenu(MainMenu)
  $: menuItems = menu?.children ?? []
</script>

<div data-vaul-drawer-wrapper class="flex h-dvh min-h-[100vh] flex-col">
  <header
    class:scrolled={scrollY > 0}
    class="gradient sticky top-0 z-10 flex items-stretch font-sans"
    style:transform="translateY({-top}px)"
    bind:this={headerEl}
  >
    <div class="container flex h-[var(--header-height)] justify-between">
      <nav class="flex items-stretch gap-4">
        {#if menu}
          <div class="flex items-center md:hidden">
            <!-- <MobileNav {menu} /> -->
          </div>
        {/if}
        <NavLink href="/" exact={true}>
          <Logo class="h-10 w-28" />
        </NavLink>
        <div class="hidden gap-4 md:flex">
          {#each menuItems as menuItem}
            <NavMenuMega {menuItem}></NavMenuMega>
          {/each}

          <Drawer.Root shouldScaleBackground>
            <Drawer.Trigger>Open Drawer</Drawer.Trigger>
            <Drawer.Portal>
              <Drawer.Overlay class="fixed inset-0 bg-black/40" />
              <Drawer.Content
                class="fixed bottom-0 left-0 right-0 mt-24 flex h-[96%] flex-col rounded-t-[10px] bg-zinc-100"
              >
                <div class="flex-1 rounded-t-[10px] bg-white p-4">
                  <div class="mx-auto mb-8 h-1.5 w-12 flex-shrink-0 rounded-full bg-zinc-300" />
                  <div class="mx-auto max-w-md">
                    <Drawer.Title class="mb-4 font-medium">Unstyled drawer for Svelte.</Drawer.Title
                    >
                    <p class="mb-2 text-zinc-600">
                      This component can be used as a replacement for a Dialog on mobile and tablet
                      devices.
                    </p>
                    <p class="mb-8 text-zinc-600">
                      It uses
                      <a
                        href="https://www.bits-ui.com/docs/components/dialog"
                        class="underline"
                        target="_blank"
                      >
                        Bits' Dialog primitive
                      </a>
                      under the hood and is inspired by
                      <a
                        href="https://twitter.com/devongovett/status/1674470185783402496"
                        class="underline"
                        target="_blank"
                      >
                        this tweet.
                      </a>
                    </p>
                  </div>
                </div>
                <div class="mt-auto border-t border-zinc-200 bg-zinc-100 p-4">
                  <div class="mx-auto flex max-w-md justify-end gap-6">
                    <a
                      class="gap-0.25 flex items-center text-xs text-zinc-600"
                      href="https://github.com/huntabyte/vaul-svelte"
                      target="_blank"
                    >
                      GitHub
                      <svg
                        fill="none"
                        height="16"
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        viewBox="0 0 24 24"
                        width="16"
                        aria-hidden="true"
                        class="ml-1 h-3 w-3"
                      >
                        <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"></path>
                        <path d="M15 3h6v6"></path>
                        <path d="M10 14L21 3"></path>
                      </svg>
                    </a>
                    <a
                      class="gap-0.25 flex items-center text-xs text-zinc-600"
                      href="https://twitter.com/huntabyte"
                      target="_blank"
                    >
                      Twitter
                      <svg
                        fill="none"
                        height="16"
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        viewBox="0 0 24 24"
                        width="16"
                        aria-hidden="true"
                        class="ml-1 h-3 w-3"
                      >
                        <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"></path>
                        <path d="M15 3h6v6"></path>
                        <path d="M10 14L21 3"></path>
                      </svg>
                    </a>
                  </div>
                </div>
              </Drawer.Content>
            </Drawer.Portal>
          </Drawer.Root>
        </div>
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
