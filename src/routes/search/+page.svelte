<script lang="ts">
  import Button from '$lib/components/Button.svelte'
  import CartForm from '$lib/components/CartForm.svelte'
  import Icons from '$lib/components/Icons.svelte'
  import ShopifyImage from '$lib/components/image/ShopifyImage.svelte'

  export let data

  $: ({ products } = data)
  $: console.log(data.products)
</script>

<div class="container pb-20">
  <!-- {#if form?.success}
    <noscript>
      <div
        id="alert-additional-content-5"
        class="rounded-lg border border-gray-300 bg-gray-50 p-4 dark:border-gray-600 dark:bg-gray-800"
        role="alert"
      >
        <div class="flex items-center">
          <svg
            class="me-2 h-4 w-4 flex-shrink-0 dark:text-gray-300"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"
            />
          </svg>
          <span class="sr-only">Info</span>
          <h3 class="text-lg font-medium text-gray-800 dark:text-gray-300">{form.message}</h3>
        </div>
        <div class="mb-4 mt-2 flex text-sm text-gray-800 dark:text-gray-300">
          <ShopifyImage image={form.merchandise?.product.images.edges[0].node} width={40} />
          <p>{form.merchandise?.product.title}</p>
        </div>
        <div class="flex">
          <button
            type="button"
            class="me-2 inline-flex items-center rounded-lg bg-gray-700 px-3 py-1.5 text-center text-xs font-medium text-white hover:bg-gray-800 focus:outline-none focus:ring-4 focus:ring-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 dark:focus:ring-gray-800"
          >
            <svg
              class="me-2 h-3 w-3 dark:text-gray-300"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 14"
            >
              <path
                d="M10 0C4.612 0 0 5.336 0 7c0 1.742 3.546 7 10 7 6.454 0 10-5.258 10-7 0-1.664-4.612-7-10-7Zm0 10a3 3 0 1 1 0-6 3 3 0 0 1 0 6Z"
              />
            </svg>
            View more
          </button>
          <button
            type="button"
            class="rounded-lg border border-gray-700 bg-transparent px-3 py-1.5 text-center text-xs font-medium text-gray-800 hover:bg-gray-800 hover:text-white focus:outline-none focus:ring-4 focus:ring-gray-300 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white dark:focus:ring-gray-800"
            data-dismiss-target="#alert-additional-content-5"
            aria-label="Close"
          >
            Dismiss
          </button>
        </div>
      </div>
    </noscript>
  {/if} -->
  <h1>Sök</h1>

  <form class="mx-auto max-w-md">
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
  {#if products}
    {#each products as product}
      <div class="flex">
        <ShopifyImage width={120} image={product.images.nodes.at(0)} />
        <div>{product.title}</div>
      </div>
    {/each}
  {/if}
</div>
