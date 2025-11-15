<script lang="ts">
  import { getByType } from '$lib'
  import ShopifyImage from '$lib/components/image/ShopifyImage.svelte'
  import { convertSchemaToHtml } from '$lib/richtext/shopifyRichText'
  import Section from './Section.svelte'
  import type { TSectionNews } from './SectionNews.gql'

  let className = ''
  export { className as class }
  export let section: TSectionNews

  $: html = section.text?.value ? convertSchemaToHtml(JSON.parse(section.text.value)) : undefined
</script>

<Section title={section.rubrik?.value ?? ''} level={2} class={className}>
  <div class="flex justify-stretch gap-10">
    <div>
      <p>{@html html}</p>
    </div>
    {#if section.image?.reference}
      <ShopifyImage image={getByType('MediaImage', section.image.reference)?.image} width={200} />
    {/if}
  </div>
</Section>
