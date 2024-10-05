<script lang="ts">
  import { page } from '$app/stores'
  import { Drawer } from 'vaul-svelte'
  import type { MenuItem } from '$lib/menu'

  export let menuItem: MenuItem
  export let exact = false
  $: active =
    $page.url.pathname && menuItem.href && exact
      ? $page.url.pathname === menuItem.href
      : $page.url.pathname.includes(menuItem.href)
  let open = false
  const shortcuts = [
    {
      label: 'Välj',
      codes: ['&crarr;'],
    },
    {
      label: 'Upp/Ned',
      codes: ['&darr;', '&uarr;'],
    },
    {
      label: 'Submeny',
      codes: ['&larr;', '&rarr;'],
    },
  ]
</script>

<a
  role="menu"
  class={`text-md mb-[2px] mt-[6px] flex h-auto rounded-none border-b-4 border-transparent px-1 text-white hover:border-white hover:border-opacity-70 hover:no-underline ${active ? 'border-white' : ''}`}
  href={menuItem.href}
>
  <span class="my-auto">{menuItem.name}</span>
</a>
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
          <Drawer.Title class="mb-4 font-medium">Unstyled drawer for Svelte.</Drawer.Title>
          <p class="mb-2 text-zinc-600">
            This component can be used as a replacement for a Dialog on mobile and tablet devices.
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

<!-- <Button
  variant="link"
  class={`text-md group mb-[2px] mt-[6px] flex h-auto rounded-none border-b-4 border-transparent px-1  text-white hover:border-white hover:border-opacity-70 hover:no-underline ${active ? 'border-white' : ''}`}
  href={menuItem.href}
>
  <span class="my-auto">{menuItem.name}</span>
  <div
    class="invisible fixed top-12 z-0 flex flex-col bg-card shadow-lg hover:visible focus:visible group-hover:visible group-focus:visible"
  >
    {#each menuItem.children as child}
      <a href={child.href}>{child.name}</a>
    {/each}
  </div>
</Button> -->

<!-- <div class="flex items-stretch font-sans">
  <a
    role="menu"
    class={`text-md mb-[2px] mt-[6px] flex h-auto rounded-none border-b-4 border-transparent px-1 text-white hover:border-white hover:border-opacity-70 hover:no-underline ${active ? 'border-white' : ''}`}
    href={menuItem.href}
  >
    <span class="my-auto">{menuItem.name}</span>
  </a>
  {#if menuItem.children.length > 0}
    <DropdownMenu.Root bind:open disableFocusFirstItem={true}>
      <DropdownMenu.Trigger asChild let:builder>
        <Button
          builders={[builder]}
          variant="ghost"
          size="icon"
          class="mx-1 w-6 flex-none self-center bg-transparent hover:bg-white/10 hover:text-white"
        >
          <ChevronDown size="24" />
          <span class="sr-only">Öppna meny</span>
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content class="mt-2 min-w-44 p-2 font-sans">
        {#each menuItem.children as child}
          <NavMenuMegaItem menuItem={child} bind:open></NavMenuMegaItem>
        {/each}
        <DropdownMenu.Separator />
        <DropdownMenuLabel class="hidden items-start gap-2 sm:flex">
          {#each shortcuts as { label, codes }, index}
            {#if index > 0}
              <Separator orientation="vertical" />
            {/if}
            <div class="flex items-center gap-1">
              <span class="text-muted-foreground text-xs font-light">{label}</span>
              {#each codes as code}
                <kbd
                  class="bg-muted text-muted-foreground pointer-events-none hidden h-4 select-none items-center gap-1 rounded border px-1 font-mono font-medium opacity-100 sm:flex"
                >
                  {@html code}
                </kbd>
              {/each}
            </div>
          {/each}
        </DropdownMenuLabel>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  {/if}
</div> -->

<!-- <Popover.Root group="mega" open={menuItem.name === 'Information'}>
  <Popover.Trigger asChild let:builder>
    <Button
      variant="link"
      class={`text-md mb-[2px] mt-[6px] flex h-auto rounded-none border-b-4 border-transparent text-white hover:border-white hover:border-opacity-70 hover:no-underline ${active ? 'border-white' : ''}`}
      builders={[builder]}
      href={menuItem.href}
    >
      <span class="my-auto">{menuItem.name}</span>
    </Button>
  </Popover.Trigger>
  <Popover.Content>
    <p>asdf</p>
    <div class="flex flex-col">
      {#each menuItem.children as child}
        <a href={child.href}>{child.name}</a>
      {/each}
    </div>
  </Popover.Content>
</Popover.Root> -->

<!-- <Dialog.Root >
  <Dialog.Trigger>Edit Profile</Dialog.Trigger>
  <Dialog.Content class="sm:max-w-[425px]">
    <Dialog.Header>
      <Dialog.Title>Edit profile</Dialog.Title>
      <Dialog.Description>
        Make changes to your profile here. Click save when you're done.
      </Dialog.Description>
    </Dialog.Header>
    <div class="grid gap-4 py-4">
      <div class="grid grid-cols-4 items-center gap-4">Name</div>
      <div class="grid grid-cols-4 items-center gap-4">Username</div>
    </div>
    <Dialog.Footer>
      <Button type="submit">Save changes</Button>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root> -->

<!-- <Tooltip.Root
  openDelay={0}
  group="mega"
  open={menuItem.name === 'Information'}
  disableHoverableContent={false}
>
  <Tooltip.Trigger asChild let:builder>
    <Button
      variant="link"
      class={`text-md mb-[2px] mt-[6px] flex h-auto rounded-none border-b-4 border-transparent text-white hover:border-white hover:border-opacity-70 hover:no-underline ${active ? 'border-white' : ''}`}
      builders={[builder]}
      href={menuItem.href}
    >
      <span class="my-auto">{menuItem.name}</span>
    </Button>
  </Tooltip.Trigger>
  <Tooltip.Content strategy="fixed" fitViewport class="">
    <div class="flex flex-col">
      {#each menuItem.children as child}
        <a href={child.href}>{child.name}</a>
      {/each}
    </div>
  </Tooltip.Content>
</Tooltip.Root> -->
