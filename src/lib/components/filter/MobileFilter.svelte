<script lang="ts">
  import { Button } from '$lib/components/ui/button/index.js'
  import Filters from './Filters.svelte'
  import ScrollArea from '../ui/scroll-area/scroll-area.svelte'
  import type { EnhancedFilter } from './shopifyFilters'
  import { stringify } from 'postcss'
  import Icons from '../Icons.svelte'
  // import Skeleton from '../ui/skeleton/skeleton.svelte'
  import Filter from 'lucide-svelte/icons/filter'
  import { Drawer } from 'vaul-svelte'

  let className = ''
  export { className as class }
  export let filters: EnhancedFilter[]
  export let formId: string
  export let requestSubmit: () => void
  export let loading = false
  // $: console.log('filters updated', filters)

  $: totalCount =
    filters
      ?.find((f) => f.id === 'filter.v.availability')
      ?.values.reduce((prev, curr) => prev + curr.count, 0) ?? 0
  $: activeCount = filters
    .map((f) => (f.active ? 1 : 0))
    .reduce<number>((count, filter) => count + filter, 0)
  // $: console.log('Mobile Filters: filters', filters)
</script>

<Drawer.Root shouldScaleBackground={true}>
  <Drawer.Trigger asChild let:builder>
    <Button builders={[builder]} variant="header" size="icon">
      <Filter />
      Filter
    </Button>
  </Drawer.Trigger>
  <Drawer.Portal>
    <Drawer.Content
      class="fixed bottom-0 left-0 right-0 z-50 mx-auto h-[90%] w-full max-w-lg flex-col overflow-hidden rounded-t-[10px] bg-popover after:data-[vaul-drawer]:bg-background sm:bg-transparent sm:after:data-[vaul-drawer]:data-[vaul-drawer-direction=bottom]:bg-transparent"
    >
      <div
        class="absolute left-1/2 top-0 my-2 h-1.5 w-12 flex-shrink-0 -translate-x-6 rounded-full bg-zinc-300 sm:hidden"
      />
      <div class="flex-0 flex h-14 w-full items-center border-b p-0 sm:text-center">
        <h2 class="m-8 text-lg font-semibold">Meny</h2>
      </div>

      {#if loading}
        <!-- <Skeleton class="h-[20px] w-[100px] rounded-full" /> -->
        Loading...
      {:else if activeCount > 0}
        <h2 class="m-0 text-lg font-semibold">{totalCount} böcker i urvalet</h2>
      {:else}
        <h2 class="m-0 text-lg font-semibold">Urval</h2>
      {/if}
      <!-- </Drawer.Header> -->
      <ScrollArea class="h-full flex-1 px-8">
        <Filters {filters} {formId} {requestSubmit}></Filters>
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

<!-- <Drawer.Root shouldScaleBackground={false} direction="right">
  <Drawer.Trigger asChild let:builder>
    <Button class={className} builders={[builder]} variant="ghost">
      <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"
        ><path
          fill="currentColor"
          d="M11.058 17q-.213 0-.357-.144q-.143-.144-.143-.357q0-.212.143-.356t.357-.143h1.865q.213 0 .356.144t.144.357t-.144.356t-.356.143zm-3.75-4.5q-.213 0-.357-.144q-.143-.144-.143-.357t.143-.356t.357-.143h9.365q.213 0 .356.144q.144.144.144.357t-.144.356t-.356.143zM4.5 8q-.213 0-.356-.144T4 7.499t.144-.356T4.5 7h15q.213 0 .356.144q.144.144.144.357q0 .212-.144.356T19.5 8z"
        /></svg
      >
      Urval
      {#if activeCount > 0}
        <div
          class="min-h-4 min-w-4 rounded-full bg-gray-400 px-1 text-center text-xs text-background"
        >
          {activeCount}
        </div>
      {/if}
    </Button>
  </Drawer.Trigger>
  <Drawer.Content direction="right"> -->
<!-- <div class="flex h-full flex-col">
  <Drawer.Header class="flex-0 h-14 w-full items-center border-b p-0 sm:text-center">
  {#if loading}
    <Skeleton class="h-[20px] w-[100px] rounded-full" />
    Loading...
  {:else if activeCount > 0}
    <h2 class="m-0 text-lg font-semibold">{totalCount} böcker i urvalet</h2>
  {:else}
    <h2 class="m-0 text-lg font-semibold">Urval</h2>
  {/if}
  </Drawer.Header>
  <ScrollArea class="h-full flex-1 px-8 pr-7">
  <Filters {filters}></Filters>
  </ScrollArea>
</div>
</Drawer.Content>
</Drawer.Root> -->
