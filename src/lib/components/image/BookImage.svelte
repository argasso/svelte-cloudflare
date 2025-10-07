<script lang="ts">
  import ShopifyImage, { type ImageProp } from './ShopifyImage.svelte'

  export let width: number
  export let image: ImageProp
  export let href: string | undefined = undefined
  export let alt: string | undefined = undefined
</script>

{#if href}
  <a {href} class="book grid" aria-label="Visa bok">
    <ShopifyImage class="col-start-1 row-start-1 bg-gray-100" {image} {width} {alt} />
    <div class="book-overlay col-start-1 row-start-1" style="width: {width}px"></div>
  </a>
{:else}
  <div class="book grid">
    <ShopifyImage class="col-start-1 row-start-1 bg-gray-100" {image} {width} {alt} />
    <div class="book-overlay col-start-1 row-start-1 h-full" style="width: {width}px"></div>
  </div>
{/if}
