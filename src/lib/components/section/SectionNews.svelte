<script lang="ts">
  import {
    fragment,
    graphql,
    type SectionNewsFragment,
    type SectionNewsFragment$data,
  } from '$houdini'
  import { onlyMediaImage } from '$lib'
  import { convertSchemaToHtml } from '$lib/richtext/shopifyRichText'
  import ShopifyImage from '$lib/components/image/ShopifyImage.svelte'
  import Section from './Section.svelte'

  let className = ''
  export { className as class }
  export let section: SectionNewsFragment$data

  $: html = section.text?.value ? convertSchemaToHtml(JSON.parse(section.text.value)) : undefined

  graphql(`
    fragment SectionNewsFragment on Metaobject {
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

<Section title={section.title?.value ?? ''} level={2} class={className}>
  <div class="flex justify-stretch gap-10">
    <div>
      <p>{@html html}</p>
    </div>
    {#if section.image?.reference}
      <ShopifyImage image={onlyMediaImage(section.image.reference)?.image} width={200} />
    {/if}
  </div>
</Section>
