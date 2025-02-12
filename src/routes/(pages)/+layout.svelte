<script lang="ts">
  import Breadcrumbs from '$lib/components/Breadcrumbs.svelte'
  import ShopifyImage from '$lib/components/image/ShopifyImage.svelte'
  import ProductsGrid from '$lib/components/ProductsGrid.svelte'
  import Section from '$lib/components/Section.svelte'
  import Sections from '$lib/components/Sections.svelte'
  import { convertSchemaToHtml } from '$lib/richtext/shopifyRichText.js'

  export let data

  $: ({ crumbs, page, links, menu, products } = data)
  $: title = page?.title?.value
  $: html = page?.content?.value ? convertSchemaToHtml(JSON.parse(page?.content.value)) : undefined
</script>

<div class="container">
  <Breadcrumbs {crumbs} />
</div>

{#if page}
  <Section>
    <div class="flex-0">
      <h1 class="mb-8 mt-0 w-full text-center md:text-left">
        {title}
      </h1>
      {#if html}
        {@html html}
      {/if}
    </div>
    <!-- <aside class="flex-0 hidden w-64 min-w-64 md:block">
        <LinkList class="mb-3 w-full shadow-sm lg:w-64" title="Underavdelningar" {links} />
      </aside> -->
  </Section>
  {#if links && links.length > 0}
    <div class="overflow-x-auto">
      <Section class="pt-0">
        <div class="flex snap-x snap-mandatory gap-5">
          {#each links as link}
            <a
              class="w-48 flex-shrink-0 snap-start rounded-lg border border-gray-200 bg-white shadow dark:border-gray-700 dark:bg-gray-800"
              href={link.href}
            >
              {#if link.images}
                <div class="h-16 overflow-hidden bg-accent p-3">
                  <div class="flex-0 flex justify-between overflow-hidden">
                    {#each link.images.reverse() as image, i}
                      <ShopifyImage {image} width={50} />
                    {/each}
                  </div>
                </div>
              {/if}
              <div class="p-3">
                <p class="text-sans m-0 text-xxs uppercase text-muted-foreground">Underkategori</p>
                <h2 class="my-0 text-lg text-foreground">
                  {link.name}
                </h2>
              </div>
            </a>
          {/each}
        </div>
      </Section>
    </div>
  {/if}

  <Sections {page} {menu} />
{/if}

<slot />

{#if products}
  <ProductsGrid {products} />
{/if}
