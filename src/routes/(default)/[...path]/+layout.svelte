<script lang="ts">
  import Button from '$lib/components/Button.svelte'
  import LinkList from '$lib/components/LinkList.svelte'
  import Section from '$lib/components/Section.svelte'
  import Seo from '$lib/components/Seo.svelte'
  import { convertSchemaToHtml, convertSchemaToText } from '$lib/richtext/shopifyRichText'

  export let data

  $: ({ page, links } = data)
  $: title = page?.title?.value
  $: html = page?.content?.value ? convertSchemaToHtml(JSON.parse(page?.content.value)) : undefined
  $: seoTitle = page.seo?.title?.value
  $: seoDescription = page.seo?.title?.value
</script>

{#if page}
  <Seo
    {seoTitle}
    {seoDescription}
    pageTitle={title}
    pageContent={convertSchemaToText(page.content?.value)}
  />
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
          <div class="flex gap-2">
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
{/if}

<slot />
