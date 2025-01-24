<script lang="ts">
  import { isType } from '$lib'
  import type { MenuItem } from '$lib/menu'
  import type { ResultOf } from 'gql.tada'
  import SectionComponent from './section/SectionComponent.svelte'
  import SectionDownload from './section/SectionDownload.svelte'
  // import SectionNews, { sectionNewsFragment } from './section/SectionNews.svelte'
  import type { pageQuery } from '$lib/gql/page.gql'
  import SektionBokgalleri from './section/SektionBokgalleri.svelte'

  export let page: ResultOf<typeof pageQuery>['page']
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
  {#if section.type === 'section_download'}
    <SectionDownload {section} class={index % 2 === 0 ? 'bg-background' : 'bg-card'} />
  {/if}
  {#if section.type === 'section_component'}
    <SectionComponent {section} class={index % 2 === 0 ? 'bg-background' : 'bg-card'} />
  {/if}
{/each}
