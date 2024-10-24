<script lang="ts">
  import { bookUrl } from '$lib'
  import Authors from './Authors.svelte'
  import Price from './Price.svelte'
  import Icons from '$lib/components/Icons.svelte'
  import ShopifyImage from '$lib/components/image/ShopifyImage.svelte'
  import { enhance } from '$app/forms'
  import { Button } from './ui/button'
  import BuyButton from './BuyButton.svelte'

  export let bookThumb: any
  export let width: number = 160
  export let loading = false

  $: ({ title, handle, variants } = bookThumb)
  $: href = bookUrl(handle)
  $: image = bookThumb.images.nodes?.[0]
  $: discontinued = variants.nodes[0].discontinued?.value === 'true'
  $: ({ id: variantId, price } = variants.nodes[0])
</script>

<div class:loading class="mt-auto w-48 opacity-100">
  <div class="book relative grid w-40">
    <ShopifyImage class="col-start-1 row-start-1 rounded-r-sm bg-gray-100" {image} {width} />
    <a {href} class="book-overlay col-start-1 row-start-1" aria-label="Visa bok"></a>
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
    <Authors book={bookThumb} one class="uppercase" />
    <a {href} class="text-foreground hover:underline">
      <h3 class="my-0 text-base font-semibold leading-6">{title}</h3>
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

  .book:hover {
    -webkit-backface-visibility: hidden;
    transform: scale(1.02);
  }

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
