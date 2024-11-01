<script lang="ts">
  import LinkList from '$lib/components/LinkList.svelte'
  import Section from '$lib/components/Section.svelte'
  import Seo from '$lib/components/Seo.svelte'
  import { convertSchemaToHtml } from '$lib/richtext/shopifyRichText'

  export let data

  $: ({ page, links } = data)
  $: title = page?.title?.value
  $: html = page?.content?.value ? convertSchemaToHtml(JSON.parse(page?.content.value)) : undefined
</script>

{#if page}
  <Seo {page} pageTitle={title} pageContent={page.content?.value} />
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

<slot />
