<script lang="ts" context="module">
  export const seoFragment = graphql(`
    fragment SeoFragment on Metaobject @_unmask {
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

<script lang="ts">
  import { convertSchemaToText } from '$lib/richtext/shopifyRichText'
  import { MetaTags } from 'svelte-meta-tags'
  import { graphql, type FragmentOf } from '../../graphql'

  export let page: FragmentOf<typeof seoFragment>
  export let pageTitle: string | null | undefined = undefined
  export let pageContent: string | null | undefined = undefined

  $: title = page.seo?.title?.value ?? pageTitle ?? 'No title yet'
  $: description = page.seo?.description?.value ?? convertSchemaToText(pageContent) ?? undefined
</script>

<MetaTags {title} titleTemplate="%s | Argasso bokförlag" {description} />
