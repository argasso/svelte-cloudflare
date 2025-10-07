<script lang="ts">
  import { bookUrl } from '$lib'
  import ShopifyImage from '$lib/components/image/ShopifyImage.svelte'
  import Authors from './Authors.svelte'
  import BuyButton from './BuyButton.svelte'
  import BookImage from './image/BookImage.svelte'
  import Price from './Price.svelte'
  import type { TProducts } from './ProductsGrid.gql'

  export let bookThumb: TProducts['nodes'][number]
  export let width: number = 160
  export let loading = false

  $: ({ title, handle, variants } = bookThumb)
  $: href = bookUrl(handle, variants.nodes[0].sku)
  $: image = variants.nodes[0].image ?? bookThumb.images.nodes?.[0]
  $: discontinued = variants.nodes[0].discontinued?.value === 'true'
  $: ({ id: variantId, price } = variants.nodes[0])
</script>

<div class:loading class="mt-auto w-40 opacity-100">
  <div class="book relative grid w-36">
    <a {href} class="col-start-1 row-start-1 grid" aria-label="Visa bok">
      <ShopifyImage class="col-start-1 row-start-1 bg-gray-100" {image} {width} />
      <div class="book-overlay col-start-1 row-start-1" style="width: {width}px"></div>
    </a>
    {#if discontinued}
      <div
        class="ribbon col-start-1 row-start-1 -mb-2 -mr-1 self-end justify-self-end text-xs text-primary-foreground"
      >
        Boken har utgått
      </div>
    {:else}
      <BuyButton {variantId} />
    {/if}
  </div>
  <Price {price} class="text-xs" />
  <div class="h-28 pt-3">
    <Authors book={bookThumb} one />
    <a {href} class="text-foreground hover:underline">
      <h3 class="my-0 font-sans text-base font-semibold leading-6">{title}</h3>
    </a>
  </div>
</div>

<style lang="postcss">
  .loading {
    @apply opacity-50 transition-opacity;
  }

  /* .book {
    -webkit-backface-visibility: hidden;
    transform: scale(0.99);
  } */

  /* .book:hover {
    -webkit-backface-visibility: hidden;
    transform: scale(1.02);
  } */

  /* .book img {
    transform: scale(1.01);
  } */

  /* .book img:hover {
    transform: scale(0.99);
  } */

  /* .book img {
    -webkit-backface-visibility: hidden;
    -ms-transform: translateZ(0) scale(1.01);
    -webkit-transform: translateZ(0) scale(1.01);
    transform: translateZ(0) scale(1.01);
  }
  .book:hover img {
    -webkit-backface-visibility: hidden;
    -ms-transform: translateZ(0) scale(0.99);
    -webkit-transform: translateZ(0) scale(0.99);
    transform: translateZ(0) scale(0.99);
  } */

  .ribbon {
    --ribbon-radius: 0.5em; /* control the ribbon shape (the radius) */
    --ribbon-color: hsl(var(--primary));
    /* color: hsl(var(--primary-foreground)); */
  }
</style>
