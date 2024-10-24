<script lang="ts" context="module">
  export const sectionsFragment = graphql(
    `
      fragment SectionsFragment on Metaobject @_unmask {
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
    `,
    [sektionBokgalleri, sectionNewsFragment],
  )
</script>

<script lang="ts">
  import { getByType, isType } from '$lib'
  import type { MenuItem } from '$lib/menu'
  import SectionNews, { sectionNewsFragment } from './section/SectionNews.svelte'
  import SektionBokgalleri, { sektionBokgalleri } from './section/SektionBokgalleri.svelte'
  import { graphql, type FragmentOf } from '../../graphql'

  export let page: FragmentOf<typeof sectionsFragment> | null | undefined
  export let menu: MenuItem | undefined

  $: sections = page?.sections?.references?.nodes.filter(isType('Metaobject')) ?? []
</script>

{#each sections as section, index}
  {#if section.type === 'sektion_slides'}
    {section.type}
  {/if}
  {#if section.type === 'sektion_bokgalleri'}
    <SektionBokgalleri {section} {menu} class={index % 2 === 0 ? 'bg-background' : 'bg-card'} />
  {/if}
  {#if section.type === 'section_news'}
    <!-- <SectionNews {section} class={index % 2 === 0 ? 'bg-background' : 'bg-card'} /> -->
  {/if}
{/each}
