<script lang="ts">
  import { enhance } from '$app/forms'
  import { goto, invalidateAll } from '$app/navigation'
  import LinkList from '$lib/components/LinkList.svelte'
  import ProductsGrid from '$lib/components/ProductsGrid.svelte'
  import Section from '$lib/components/Section.svelte'
  import Seo from '$lib/components/Seo.svelte'
  import { convertSchemaToHtml } from '$lib/richtext/shopifyRichText'
  // import type { SubmitFunction } from './$types'

  export let data

  $: ({ page, products, filters, links } = data)
  $: title = page?.title?.value
  $: html = page?.content?.value ? convertSchemaToHtml(JSON.parse(page?.content.value)) : undefined

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

{#if page}
  <Seo {page} pageTitle={title} pageContent={page.content?.value} />
{/if}
{#if page}
  <Section>
    <div class="flex flex-row gap-10">
      <div class="flex-1">
        <h1 class="mb-8 mt-0 w-full text-center md:text-left">
          {title}
        </h1>
        {#if html}
          {@html html}
        {/if}
        <!-- {#if links}
        <div class="flex">
          {#each links as link}
            <div><Button variant="outline" href={link.href}>{link.name}</Button></div>
          {/each}
        </div>
      {/if} -->
      </div>
      <aside class="flex-0 hidden w-64 min-w-64 md:block">
        <LinkList class="mb-3 w-full shadow-sm lg:w-64" title="Underavdelningar" {links} />
      </aside>
    </div>
  </Section>
{/if}

<ProductsGrid {products} {filters} />

<!-- <div class="container mb-10 flex flex-col gap-4 lg:flex-row"> -->
<!-- <aside class="flex-0 hidden w-64 min-w-64 md:block">
    <LinkList class="mb-3 w-full shadow-sm lg:w-64" title="Underavdelningar" {links} />
    {#if Products && $Products}
      <FiltersCard class="sticky top-16 shadow-sm" {filters} />
    {/if}
  </aside> -->
<!-- </div> -->
