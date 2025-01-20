<script lang="ts">
  import { getByType, isSearchType, isType, getBySearchType } from '$lib'
  import Authors from '$lib/components/Authors.svelte'
  import Breadcrumbs from '$lib/components/Breadcrumbs.svelte'
  import Button from '$lib/components/Button.svelte'
  import CartForm from '$lib/components/CartForm.svelte'
  import Icons from '$lib/components/Icons.svelte'
  import BookImage from '$lib/components/image/BookImage.svelte'
  import ShopifyImage from '$lib/components/image/ShopifyImage.svelte'
  import Search from 'lucide-svelte/icons/search'

  export let data

  $: ({ search, variables } = data)
  $: products = search?.nodes.filter(isSearchType('Product'))
  $: pageInfo = search?.pageInfo
  $: totalCount = search?.totalCount
  $: query = variables?.query
  $: console.log(products)

  const crumbs = [
    {
      name: 'Startsida',
      href: '/',
    },
    {
      name: 'Sök',
    },
  ]
</script>

<div class="container pb-20">
  <Breadcrumbs {crumbs} />

  <h1>Sök bland våra titlar</h1>
  <form class="my-5 max-w-md">
    <label for="default-search" class="sr-only mb-2 text-sm font-medium text-muted-foreground"
      >Search</label
    >
    <div class="relative">
      <div class="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3">
        <svg
          class="h-4 w-4 text-gray-500 dark:text-gray-400"
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
        type="search"
        name="query"
        value={query}
        id="default-search"
        class="block w-full rounded-lg bg-muted p-4 ps-10 text-sm text-muted-foreground"
        placeholder="Sök bland våra böcker..."
        required
      />
      <Button
        type="submit"
        variant="default"
        size="default"
        class="absolute bottom-2.5 end-2.5 px-4 py-2 text-sm font-medium">Search</Button
      >
    </div>
  </form>

  {#if products && products.length > 0}
    <h2>{totalCount} träffar</h2>
    <p>Din sökning på <b>"{query}"</b> matchar följade böcker</p>
    <div class="max-w-xl">
      {#each products as product, i (i)}
        {#if i > 0}
          <hr />
        {/if}

        <div class="flex w-full gap-4 py-5">
          <div class="self-start">
            <BookImage width={64} image={product.images.nodes[0]} />
          </div>
          <div class="flex flex-1 flex-col justify-between">
            <div class="flex-1">
              <Authors book={product}></Authors>
              <h3 class="m-0 text-base font-semibold">
                {product.title}
              </h3>
            </div>
          </div>
        </div>
      {/each}
    </div>
  {:else if query}
    <div class="mt-20 flex w-full flex-col items-center justify-center overflow-hidden">
      <div
        class="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-4xl text-gray-500"
      >
        <Search />
      </div>
      <h3 class="mt-6 text-center text-2xl">Hittar inget som matchar <b>{query}</b>.</h3>
    </div>
  {/if}
</div>
