<script lang="ts">
  import { getByType } from '$lib'
  import ShopifyImage from '$lib/components/image/ShopifyImage.svelte'
  import { convertSchemaToHtml } from '$lib/richtext/shopifyRichText'
  import Button from '../Button.svelte'
  import CatalogOrderForm from '../forms/CatalogOrderForm.svelte'
  import Section from './Section.svelte'
  import type { TSectionComponent } from './SectionComponent.gql'
  import type { TSectionDownload } from './SectionDownload.gql'

  let className = ''
  export { className as class }
  export let section: TSectionComponent

  $: html = section.description?.value
    ? convertSchemaToHtml(JSON.parse(section.description.value))
    : undefined
</script>

<Section title={section.rubrik?.value ?? ''} level={2} class={className}>
  {#if html}
    <div>
      <p>{@html html}</p>
    </div>
  {/if}
  {#if section.component?.value}
    {#if section.component?.value === 'CatalogOrderForm'}
      <CatalogOrderForm />
    {/if}
  {/if}
</Section>
