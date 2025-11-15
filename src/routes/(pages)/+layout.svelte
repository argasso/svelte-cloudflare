<script lang="ts">
  import Breadcrumbs from '$lib/components/Breadcrumbs.svelte'
  import ShopifyImage from '$lib/components/image/ShopifyImage.svelte'
  import LinkList from '$lib/components/LinkList.svelte'
  import ProductsGrid from '$lib/components/ProductsGrid.svelte'
  import Section from '$lib/components/Section.svelte'
  import Sections from '$lib/components/Sections.svelte'
  import { convertSchemaToHtml } from '$lib/richtext/shopifyRichText.js'
  import { isType } from '$lib'
  import type { ResultOf } from 'gql.tada'
  import type { pageQuery } from '$lib/gql/page.gql.js'

  export let data

  $: ({ crumbs, page, links, menu, products } = data)
  $: title = page?.title?.value
  $: html = page?.content?.value ? convertSchemaToHtml(JSON.parse(page?.content.value)) : undefined
  $: p = page as ResultOf<typeof pageQuery>['page']
  $: toc = p?.sections?.references?.nodes.filter(isType('Metaobject')) ?? []
  $: tocLinks = toc.map(({ rubrik, handle }) => ({
    href: `#${handle}`,
    name: rubrik?.value ?? '',
  }))
</script>

{#if crumbs && crumbs.length > 0}
  <div class="container">
    <Breadcrumbs {crumbs} />
  </div>
{/if}

{#if page}
  <Section>
    <div class="flex flex-col gap-6 md:flex-row">
      <div class="flex-1 dark:prose-invert prose-headings:mb-3 prose-headings:font-normal">
        <h1 class="w-full text-center md:text-left">
          {title}
        </h1>
        {#if html}
          <div class="prose">
            {@html html}
          </div>
        {/if}
      </div>
      {#if page.show_table_of_contents?.value}
        <aside class="flex-0 w-full md:block md:w-64 md:min-w-64">
          <LinkList class="mb-3 w-full shadow-sm lg:w-64 " title="Innehåll" links={tocLinks} />
        </aside>
      {/if}
    </div>
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
