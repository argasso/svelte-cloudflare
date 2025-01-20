<script lang="ts">
  import { goto } from '$app/navigation'
  import { bookUrl, isSearchType } from '$lib'
  import { Button as UiButton } from '$lib/components/ui/button/index.js'
  import * as Command from '$lib/components/ui/command'
  import { onMount } from 'svelte'
  import { Drawer } from 'vaul-svelte'
  import type { PageServerData } from '../../../routes/api/search/+server'
  import Authors from '../Authors.svelte'
  import Icons from '../Icons.svelte'
  import ShopifyImage from '../image/ShopifyImage.svelte'
  import { Separator } from '../ui/separator'
  import Button from '../Button.svelte'

  let loading = false
  let open = false
  let value = ''
  let results: Awaited<PageServerData>
  let timer: NodeJS.Timeout

  $: products = results?.search?.nodes?.filter(isSearchType('Product'))
  $: pageInfo = results?.search?.pageInfo
  $: totalCount = results?.search?.totalCount
  $: totalText = (totalCount ?? 0) > (products?.length ?? 0) ? ` av totalt ${totalCount} ` : ''
  $: debounce(value)

  function debounce(value: string) {
    clearTimeout(timer)
    if (value.length > 0) {
      timer = setTimeout(() => search(value), 500)
    } else {
      results = undefined
      products = undefined
      pageInfo = undefined
      totalCount = undefined
    }
  }
  async function search(query: string) {
    loading = true
    const params = new URLSearchParams({ query })
    const resp = await fetch(`/api/search?${params}`)
    results = (await resp.json()) as Awaited<PageServerData>
    loading = false
  }

  onMount(() => {
    function handleKeydown(e: KeyboardEvent) {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        open = true
      }
    }
    document.addEventListener('keydown', handleKeydown)

    return () => {
      document.removeEventListener('keydown', handleKeydown)
    }
  })

  function runCommand(cmd: () => void) {
    open = false
    cmd()
  }

  const shortcuts = [
    {
      label: 'Välj',
      code: '&crarr;',
    },
    {
      label: 'Nästa',
      code: '&darr;',
    },
    {
      label: 'Föregående',
      code: '&uarr;',
    },
    {
      label: 'Stäng',
      code: 'ESC',
    },
  ]
</script>

<noscript>
  <Button href={'/search'} variant="header" size="icon">
    <Icons type="search" />
  </Button>
</noscript>

<div class="js-only">
  <Drawer.Root shouldScaleBackground={true} bind:open>
    <Drawer.Trigger asChild let:builder>
      <UiButton builders={[builder]} variant="header" size="icon">
        <Icons type="search" />
      </UiButton>
    </Drawer.Trigger>
    <Drawer.Portal>
      <Drawer.Content
        class="fixed bottom-0 left-0 right-0 z-50 mx-auto h-[90%] w-full max-w-lg flex-col overflow-hidden rounded-t-[10px] bg-popover after:data-[vaul-drawer]:bg-background sm:bg-transparent sm:after:data-[vaul-drawer]:data-[vaul-drawer-direction=bottom]:bg-transparent"
      >
        <div
          class="absolute left-1/2 top-0 my-2 h-1.5 w-12 flex-shrink-0 -translate-x-6 rounded-full bg-zinc-300 sm:hidden"
        />
        <Command.Root shouldFilter={false} class="h-full rounded-none sm:h-1/2 sm:rounded-[10px]">
          <Command.Input
            id="input-div"
            bind:value
            placeholder="Sök titel..."
            class="mr-10 h-14 border-transparent focus:ring-0"
          />
          <Command.List class="h-full max-h-none">
            {#if loading}
              <div class="w-full">
                <div class="h-px w-full overflow-hidden bg-popover">
                  <div class="progress left-right h-full w-full bg-primary"></div>
                </div>
              </div>
            {:else}
              <Command.Empty class="h-full">
                {#if value.length > 0 && results}
                  Hittar ingenting som motsvarar sökningen.
                {:else}
                  Skriv något att söka efter
                {/if}
              </Command.Empty>
              {#if products && products.length > 0}
                <Command.Group
                  heading={`Visar ${products.length}${totalText} matchande sökträffar`}
                  class="mx-3"
                >
                  {#each products as product}
                    <Command.Item
                      class="flex gap-4 text-accent-foreground  aria-selected:text-foreground"
                      value={product.handle}
                      onSelect={() =>
                        runCommand(() => {
                          product.handle && goto(bookUrl(product.handle))
                        })}
                    >
                      <ShopifyImage image={product.images.nodes[0]} height={60} />
                      <div class="flex flex-col">
                        <Authors book={product} noLink class="text-xs text-muted-foreground" />
                        <b>{product.title}</b>
                      </div>
                    </Command.Item>
                  {/each}
                </Command.Group>
              {/if}
            {/if}
          </Command.List>
          <Separator />
          <div class="flex-0 hidden items-start gap-4 p-3 sm:flex">
            {#each shortcuts as { label, code }, index}
              {#if index > 0}
                <Separator orientation="vertical" />
              {/if}
              <div class="flex gap-2">
                <span class="text-sm text-muted-foreground">{label}</span>
                <kbd
                  class="pointer-events-none hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono font-medium text-muted-foreground opacity-100 sm:flex"
                >
                  {#if code.startsWith('&')}
                    {@html code}
                  {:else}
                    <span class="text-xs">{code}</span>
                  {/if}
                </kbd>
              </div>
            {/each}
          </div>
        </Command.Root>

        <!-- Workaround for closing on outside click when showing as dialog style. Overlay not clickable below dialog. -->
        <label for="close-button" class="block h-0 bg-transparent sm:h-1/2"></label>

        <Drawer.Close asChild let:builder>
          <UiButton
            id="close-button"
            builders={[builder]}
            variant="ghost"
            size="icon"
            class="absolute right-2.5 top-2.5 rounded-full"
            ><Icons type="close" />
            <span class="sr-only">Close</span>
          </UiButton>
        </Drawer.Close>
      </Drawer.Content>
      <Drawer.Overlay class="fixed inset-0 bg-black/60  dark:bg-neutral-900/70" />
    </Drawer.Portal>
  </Drawer.Root>
</div>

<style>
  .progress {
    animation: progress 1s infinite linear;
  }

  .left-right {
    transform-origin: 0% 50%;
  }
  @keyframes progress {
    0% {
      transform: translateX(0) scaleX(0);
    }
    40% {
      transform: translateX(0) scaleX(0.4);
    }
    100% {
      transform: translateX(100%) scaleX(0.5);
    }
  }
</style>
