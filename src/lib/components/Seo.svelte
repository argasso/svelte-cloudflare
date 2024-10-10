<script lang="ts">
  import { graphql, type SeoFragment$data } from '$houdini'
  import { convertSchemaToText } from '$lib/richtext/shopifyRichText'
  import { MetaTags } from 'svelte-meta-tags'

  export let page: SeoFragment$data
  export let pageTitle: string | null | undefined = undefined
  export let pageContent: string | null | undefined = undefined

  $: title = page.seo?.title?.value ?? pageTitle ?? 'No title yet'
  $: description = page.seo?.description?.value ?? convertSchemaToText(pageContent) ?? undefined
  $: console.log('in SEO', title)

  graphql(`
    fragment SeoFragment on Metaobject {
      seo {
        title {
          value
        }
        description {
          value
        }
      }
    }
  `)
</script>

<MetaTags {title} titleTemplate="%s | Argasso bokförlag" {description} />
