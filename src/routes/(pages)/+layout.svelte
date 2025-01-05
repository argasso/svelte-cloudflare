<script lang="ts">
  import BookStack from '$lib/components/BookStack.svelte'
  import Breadcrumbs from '$lib/components/Breadcrumbs.svelte'
  import Button from '$lib/components/Button.svelte'
  import ShopifyImage from '$lib/components/image/ShopifyImage.svelte'
  import ProductsGrid from '$lib/components/ProductsGrid.svelte'
  import Section from '$lib/components/Section.svelte'
  import Sections from '$lib/components/Sections.svelte'
  import Card from '$lib/components/ui/card/card.svelte'
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
        <div class="flex gap-5">
          {#each links as link}
            <div
              class="w-44 flex-shrink-0 rounded-lg border border-gray-200 bg-white shadow dark:border-gray-700 dark:bg-gray-800"
            >
              <div class="h-16 overflow-hidden bg-accent pb-5">
                {#if link.images}
                  <div class="flex-0 flex overflow-hidden rounded-t-lg">
                    {#each link.images.reverse() as image, i}
                      <!-- <div
                      class="col-start-1 row-start-1"
                      style="margin-left: {i * 105 - 50}px; margin-top: {i * top - 20}px"
                    > -->
                      <ShopifyImage {image} width={60} />
                      <!-- </div> -->
                    {/each}
                  </div>
                {/if}
              </div>
              <div class="p-3">
                <p class="m-0 text-xs uppercase text-muted-foreground">Underkategori</p>
                <a href={link.href}>
                  <h5 class="font-bold tracking-tight text-foreground">
                    {link.name}
                  </h5>
                  <!-- <Button variant="secondary" href={link.href}
                    >{link.name}
                    <svg
                      class="ms-2 h-3.5 w-3.5 rtl:rotate-180"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 14 10"
                    >
                      <path
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M1 5h12m0 0L9 1m4 4L9 9"
                      />
                    </svg>
                  </Button> -->
                </a>
              </div>
            </div>
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
