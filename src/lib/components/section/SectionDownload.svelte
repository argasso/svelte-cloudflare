<script lang="ts">
  import { getByType } from '$lib'
  import ShopifyImage from '$lib/components/image/ShopifyImage.svelte'
  import { convertSchemaToHtml } from '$lib/richtext/shopifyRichText'
  import Button from '../Button.svelte'
  import Section from './Section.svelte'
  import type { TSectionDownload } from './SectionDownload.gql'

  let className = ''
  export { className as class }
  export let section: TSectionDownload

  $: html = section.description?.value
    ? convertSchemaToHtml(JSON.parse(section.description.value))
    : undefined
</script>

<Section title={section.name?.value ?? ''} level={2} class={className}>
  {#if html}
    <div>
      <p>{@html html}</p>
    </div>
  {/if}
  {#if section.file?.reference}
    <!-- <ShopifyImage image={getByType('GenericFile', section.file.reference)} width={200} /> -->
  {:else if section.filename?.value}
    <Button
      data-sveltekit-preload-data="off"
      variant="default"
      size="lg"
      href="/api/files/{section.filename?.value}"
    >
      {section.name?.value}
    </Button>
  {/if}
</Section>
