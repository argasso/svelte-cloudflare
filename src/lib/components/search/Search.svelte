<script lang="ts">
  import { goto } from '$app/navigation'
  import { bookUrl } from '$lib'
  import { Button } from '$lib/components/ui/button/index.js'
  import * as Command from '$lib/components/ui/command'
  // import * as Drawer from '$lib/components/ui/drawer/index.js'
  import type { PageServerData } from '../../../routes/api/search/+server'
  import Icons from '../Icons.svelte'
  import ShopifyImage from '../image/ShopifyImage.svelte'
  import Logo from '../logo/Logo.svelte'
  import { Separator } from '../ui/separator'
  import { Drawer } from 'vaul-svelte'

  const direction = 'bottom'

  let open = false
  let value = ''
  let results: Awaited<PageServerData>

  async function onInput(query: string) {
    if (query.length) {
      const params = new URLSearchParams({ query })
      const resp = await fetch(`/api/search?${params}`)
      results = (await resp.json()) as Awaited<PageServerData>
    } else {
      results = undefined
    }
  }

  function runCommand(cmd: () => void) {
    open = false
    cmd()
  }

  $: onInput(value)

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

<Drawer.Root shouldScaleBackground={true} bind:open>
  <Drawer.Trigger asChild let:builder>
    <Button builders={[builder]} variant="header" size="icon">
      <Icons type="search" />
    </Button>
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
          <Command.Empty class="h-full">
            {#if value.length > 0}
              Hittar ingenting som motsvarar sökningen.
            {:else}
              Skriv något att söka efter
            {/if}
          </Command.Empty>
          {#if results?.products && results?.products.length > 0}
            <Command.Group heading={`Hittade ${results.products.length} böcker`}>
              {#each results.products as product}
                <Command.Item
                  class="flex gap-4 text-accent-foreground  aria-selected:text-foreground"
                  value={product.handle}
                  onSelect={() =>
                    runCommand(() => {
                      product.handle && goto(bookUrl(product.handle))
                    })}
                >
                  <ShopifyImage image={product.images.nodes[0]} height={60} />
                  {product.title}
                </Command.Item>
              {/each}
            </Command.Group>
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
        <Button
          id="close-button"
          builders={[builder]}
          variant="ghost"
          size="icon"
          class="absolute right-2.5 top-2.5 rounded-full"
          ><Icons type="close" />
          <span class="sr-only">Close</span>
        </Button>
      </Drawer.Close>
    </Drawer.Content>
    <Drawer.Overlay class="fixed inset-0 bg-black/60  dark:bg-neutral-900/70" />
  </Drawer.Portal>
</Drawer.Root>

<!-- <Drawer.Root bind:open shouldScaleBackground={true} {direction} openFocus={'#input-div'}>
  <Drawer.Trigger asChild let:builder>
    <Button builders={[builder]} variant="header" size="icon">
      <Icons type="search" />
    </Button>
  </Drawer.Trigger>
  <Drawer.Content {direction}>
    <div class="flex h-full flex-col">
      <Command.Root shouldFilter={false} class="flex-1">
        <Command.Input
          id="input-div"
          bind:value
          placeholder="Sök titel..."
          class="the-input mr-10 h-14 border-transparent focus:ring-0"
        />
        <Command.List>
          <Command.Empty>
            {#if value.length > 0}
              Hittar ingenting som motsvarar sökningen.
            {:else}
              Skriv något att söka efter
            {/if}
          </Command.Empty>
          {#if results?.products && results?.products.length > 0}
            <Command.Group heading={`Hittade ${results.products.length} böcker`}>
              {#each results.products as product}
                <Command.Item
                  class="flex gap-4 text-accent-foreground  aria-selected:text-foreground"
                  value={product.handle}
                  onSelect={() =>
                    runCommand(() => {
                      product.handle && goto(bookUrl(product.handle))
                    })}
                >
                  <ShopifyImage image={product.images.nodes[0]} height={60} />
                  {product.title}
                </Command.Item>
              {/each}
            </Command.Group>
          {/if}
        </Command.List>
      </Command.Root>
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
              {@html code}
            </kbd>
          </div>
        {/each}
      </div>
    </div>
  </Drawer.Content>
</Drawer.Root> -->

<!-- <Drawer.Root shouldScaleBackground={true} {direction}>
  <Drawer.Trigger asChild let:builder>
    <Button builders={[builder]} variant="header" size="icon">
      <Icons type="search" />
    </Button>
  </Drawer.Trigger>
  <Drawer.Content {direction}>
    <div class="flex h-full flex-col">
      <Drawer.Header class="h-14 w-full items-center border-b px-4 py-0 sm:text-center">
        <form class="flex max-w-sm items-center">
          <label for="simple-search" class="sr-only">Search</label>
          <div class="relative w-full">
            <div class="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3">
              <svg
                class="h-4 w-4"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                />
              </svg>
            </div>
            <input
              type="text"
              id="simple-search"
              class="block w-full rounded-lg bg-transparent p-2.5 ps-10 text-sm"
              placeholder="Sök bland våra böcker..."
              bind:value={query}
            />
          </div>
        </form>
      </Drawer.Header>

      <ScrollArea class="h-full flex-1 px-8">
        <Command.Root asChild use:buider={} >
          <Command.List>
            <Command.Empty>No results found.</Command.Empty>
            <Command.Group heading="Suggestions">
              <Command.Item>Calendar</Command.Item>
              <Command.Item>Search Emoji</Command.Item>
              <Command.Item>Calculator</Command.Item>
            </Command.Group>
            <Command.Separator />
            <Command.Group heading="Settings">
              <Command.Item>Profile</Command.Item>
              <Command.Item>Billing</Command.Item>
              <Command.Item>Settings</Command.Item>
            </Command.Group>
          </Command.List>
        </Command.Root>
        {#if results?.products}
          {#each results?.products as product}
            <div class="flex">
              <ShopifyImage width={120} image={product.images.nodes.at(0)} />
              <div>{product.title}</div>
            </div>
          {/each}
        {/if}
      </ScrollArea>
      <Separator />
      <div class="hidden items-start gap-4 p-3 sm:flex">
        {#each shortcuts as { label, code }, index}
          {#if index > 0}
            <Separator orientation="vertical" />
          {/if}
          <div class="flex gap-2">
            <span class="text-sm text-muted-foreground">{label}</span>
            <kbd
              class="pointer-events-none hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono font-medium text-muted-foreground opacity-100 sm:flex"
            >
              {@html code}
            </kbd>
          </div>
        {/each}
      </div>
    </div>
  </Drawer.Content>
</Drawer.Root> -->
