<script lang="ts">
  import Breadcrumbs from '$lib/components/Breadcrumbs.svelte'
  import Button from '$lib/components/Button.svelte'
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
    <div class="flex flex-row gap-10">
      <div class="flex-1">
        <h1 class="mb-8 mt-0 w-full text-center md:text-left">
          {title}
        </h1>
        {#if html}
          {@html html}
        {/if}
        {#if links}
          <div class="flex flex-wrap gap-2">
            {#each links as link}
              <Button variant="secondary" href={link.href}>{link.name}</Button>
            {/each}
          </div>
        {/if}
      </div>
      <aside class="flex-0 hidden w-64 min-w-64 md:block">
        <!-- <LinkList class="mb-3 w-full shadow-sm lg:w-64" title="Underavdelningar" {links} /> -->
      </aside>
    </div>
  </Section>
  <Sections {page} {menu} />
{/if}

<slot />

{#if products}
  <ProductsGrid {products} />
{/if}
