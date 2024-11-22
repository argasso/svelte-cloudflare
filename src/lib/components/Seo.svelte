<script lang="ts">
  import { convertSchemaToText } from '$lib/richtext/shopifyRichText'
  import { MetaTags } from 'svelte-meta-tags'
  import type { TSeoFragment } from './Seo.graphql'

  export let page: TSeoFragment
  export let pageTitle: string | null | undefined = undefined
  export let pageContent: string | null | undefined = undefined

  $: title = page.seo?.title?.value ?? pageTitle ?? 'No title yet'
  $: description = page.seo?.description?.value ?? convertSchemaToText(pageContent) ?? undefined
</script>

<MetaTags {title} titleTemplate="%s | Argasso bokförlag" {description} />
