<script lang="ts" context="module">
  export const sectionNewsFragment = graphql(`
    fragment SectionNewsFragment on Metaobject @_unmask {
      id
      title: field(key: "title") {
        value
      }
      text: field(key: "text") {
        value
      }
      image: field(key: "image") {
        reference {
          ... on MediaImage {
            image {
              altText
              url
              width
              height
            }
          }
        }
      }
    }
  `)
</script>

<script lang="ts">
  import { getByType } from '$lib'
  import { convertSchemaToHtml } from '$lib/richtext/shopifyRichText'
  import ShopifyImage from '$lib/components/image/ShopifyImage.svelte'
  import Section from './Section.svelte'
  import { graphql, type FragmentOf } from '../../../graphql'

  let className = ''
  export { className as class }
  export let section: FragmentOf<typeof sectionNewsFragment>

  $: html = section.text?.value ? convertSchemaToHtml(JSON.parse(section.text.value)) : undefined
</script>

<Section title={section.title?.value ?? ''} level={2} class={className}>
  <div class="flex justify-stretch gap-10">
    <div>
      <p>{@html html}</p>
    </div>
    {#if section.image?.reference}
      <ShopifyImage image={getByType('MediaImage', section.image.reference)?.image} width={200} />
    {/if}
  </div>
</Section>
