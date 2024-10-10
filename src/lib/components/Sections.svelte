<script lang="ts">
  import { fragment, graphql, type SectionsFragment, type SectionsFragment$data } from '$houdini'
  import { onlyMetaobjects } from '$lib'
  import type { MenuItem } from '$lib/menu'
  import SectionNews from './section/SectionNews.svelte'
  import SektionBokgalleri from './section/SektionBokgalleri.svelte'

  export let page: SectionsFragment$data
  export let menu: MenuItem | undefined

  graphql(`
    fragment SectionsFragment on Metaobject {
      sections: field(key: "sektioner") {
        references(first: 10) {
          nodes {
            ... on Metaobject {
              type
            }
            ...SektionBokgalleri
            ...SectionNewsFragment
          }
        }
      }
    }
  `)
</script>

{#if page?.sections?.references?.nodes}
  {#each onlyMetaobjects(page.sections?.references?.nodes) as section, index}
    {#if section.type === 'sektion_slides'}
      {section.type}
    {/if}
    {#if section.type === 'sektion_bokgalleri'}
      <SektionBokgalleri {section} {menu} class={index % 2 === 0 ? 'bg-background' : 'bg-card'} />
    {/if}
    {#if section.type === 'section_news'}
      <SectionNews {section} class={index % 2 === 0 ? 'bg-background' : 'bg-card'} />
    {/if}
  {/each}
{/if}
