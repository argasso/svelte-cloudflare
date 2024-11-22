<script lang="ts">
  import { isType } from '$lib'
  import type { MenuItem } from '$lib/menu'
  // import SectionNews, { sectionNewsFragment } from './section/SectionNews.svelte'
  import SektionBokgalleri from './section/SektionBokgalleri.svelte'
  import type { TSectionsFragment } from './Sections.gql'

  export let page: TSectionsFragment | null | undefined
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
