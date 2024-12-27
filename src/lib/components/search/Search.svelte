<script lang="ts">
  import { goto } from '$app/navigation'
  import { bookUrl } from '$lib'
  import { Button } from '$lib/components/ui/button/index.js'
  import * as Command from '$lib/components/ui/command'
  import * as Drawer from '$lib/components/ui/drawer/index.js'
  import type { PageServerData } from '../../../routes/api/search/+server'
  import Icons from '../Icons.svelte'
  import ShopifyImage from '../image/ShopifyImage.svelte'
  import { Separator } from '../ui/separator'

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
      label: 'Nästa träff',
      code: '&darr;',
    },
    {
      label: 'Föregående träff',
      code: '&uarr;',
    },
  ]
</script>

<Drawer.Root bind:open shouldScaleBackground={true} {direction} openFocus={'#input-div'}>
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
</Drawer.Root>

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
