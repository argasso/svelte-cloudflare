<script lang="ts">
  import { isType } from '$lib'
  import type { TBookStackFragment } from './BookStack.gql'
  import ShopifyImage from './image/ShopifyImage.svelte'

  export let books: TBookStackFragment | null | undefined

  $: products = books?.books?.references?.nodes.filter(isType('Product'))
  $: left = 75 / (products?.length ?? 1)
  $: top = 150 / (products?.length ?? 1)
</script>

{#if products}
  <div class="flex-0 grid">
    {#each products as book, i}
      <div
        class="col-start-1 row-start-1"
        style="margin-left: {i * left}px; margin-top: {i * top}px"
      >
        <ShopifyImage class="shadow" image={book.images.nodes[0]} width={80} />
      </div>
    {/each}
  </div>
{/if}
