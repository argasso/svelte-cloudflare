<script lang="ts">
  import ProductsGrid from '$lib/components/ProductsGrid.svelte'
  // import type { SubmitFunction } from './$types'

  export let data

  $: ({ products, filters } = data)

  // const cartSubmitFunction: SubmitFunction = () => {
  // return async ({ result }) => {
  //   if (result.type === 'redirect') {
  //     goto(result.location)
  //   } else if (result.type === 'success') {
  //     invalidateAll()
  //     await applyAction(result)
  //     cart.set(result.data?.cart)
  //     const message = result.data?.message ?? 'Uppdaterade varukorgen'
  //     const description = result.data?.merchandise?.product.title ?? ''
  //     toast.success(message, { position, description })
  //   } else if (result.type === 'failure') {
  //     const description = 'Kunde inte uppdatera varukorgen.'
  //     toast.error('Oj', { position, description })
  //   }
  // }
  // }
</script>

{#if products && filters}
  <ProductsGrid {products} {filters} />
{/if}

<!-- <div class="container mb-10 flex flex-col gap-4 lg:flex-row"> -->
<!-- <aside class="flex-0 hidden w-64 min-w-64 md:block">
    <LinkList class="mb-3 w-full shadow-sm lg:w-64" title="Underavdelningar" {links} />
    {#if Products && $Products}
      <FiltersCard class="sticky top-16 shadow-sm" {filters} />
    {/if}
  </aside> -->
<!-- </div> -->
