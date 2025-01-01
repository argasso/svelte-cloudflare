<script lang="ts">
  // import * as Drawer from '$lib/components/ui/drawer/index.js'
  import { Button } from '$lib/components/ui/button/index.js'
  import NavMenu from './NavMenu.svelte'
  import ScrollArea from './ui/scroll-area/scroll-area.svelte'
  import type { MenuItem } from '$lib/menu'
  import Icons from './Icons.svelte'
  import { Drawer } from 'vaul-svelte'

  export let menu: MenuItem
  const direction = 'left'
</script>

<Drawer.Root shouldScaleBackground={true}>
  <Drawer.Trigger asChild let:builder>
    <Button builders={[builder]} variant="header" size="icon">
      <Icons type="menu" />
    </Button>
  </Drawer.Trigger>
  <Drawer.Portal>
    <Drawer.Content
      class="fixed bottom-0 left-0 right-0 z-50 mx-auto h-[90%] w-full max-w-lg flex-col overflow-hidden rounded-t-[10px] bg-popover after:data-[vaul-drawer]:bg-background md:bg-transparent md:after:data-[vaul-drawer]:data-[vaul-drawer-direction=bottom]:bg-transparent"
    >
      <div
        class="absolute left-1/2 top-0 my-2 h-1.5 w-12 flex-shrink-0 -translate-x-6 rounded-full bg-zinc-300 md:hidden"
      />
      <div class="flex-0 flex h-14 w-full items-center border-b p-0 sm:text-center">
        <h2 class="m-8 text-lg font-semibold">Meny</h2>
      </div>
      <ScrollArea class="h-full flex-1 px-8">
        <NavMenu {menu}></NavMenu>
      </ScrollArea>

      <!-- Workaround for closing on outside click when showing as dialog style. Overlay not clickable below dialog. -->
      <!-- <label for="close-button" class="block h-0 bg-transparent sm:h-1/2"></label> -->

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

<!-- <Drawer.Root shouldScaleBackground={true} {direction}>
  <Drawer.Trigger asChild let:builder>
    <Button builders={[builder]} variant="header" size="icon">
      <Icons type="menu" />
    </Button>
  </Drawer.Trigger>
  <Drawer.Content {direction}>
    <div class="flex h-full flex-col">
      <Drawer.Header class="flex-0 h-14 w-full items-center border-b p-0 sm:text-center">
        <h2 class="m-0 text-lg font-semibold">Meny</h2>
      </Drawer.Header>

      <ScrollArea class="h-full flex-1 px-8">
        <NavMenu {menu}></NavMenu>
      </ScrollArea>
    </div>
  </Drawer.Content>
</Drawer.Root> -->
