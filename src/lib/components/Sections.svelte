<script lang="ts">
  import { isType } from '$lib'
  import type { MenuItem } from '$lib/menu'
  import SectionComponent from './section/SectionComponent.svelte'
  import SectionDownload from './section/SectionDownload.svelte'
  // import SectionNews, { sectionNewsFragment } from './section/SectionNews.svelte'
  import SektionBokgalleri from './section/SektionBokgalleri.svelte'
  import type { TSectionsFragment } from './Sections.gql'

  export let page: TSectionsFragment | null | undefined
  export let menu: MenuItem | undefined

  $: sections = page?.sections?.references?.nodes.filter(isType('Metaobject')) ?? []
  $: console.log(sections)
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
  {#if section.type === 'section_download'}
    <SectionDownload {section} class={index % 2 === 0 ? 'bg-background' : 'bg-card'} />
  {/if}
  {#if section.type === 'section_component'}
    <SectionComponent {section} class={index % 2 === 0 ? 'bg-background' : 'bg-card'} />
  {/if}
{/each}
