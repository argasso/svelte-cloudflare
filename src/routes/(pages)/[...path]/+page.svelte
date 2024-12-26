<script lang="ts">
  import Seo from '$lib/components/Seo.svelte'
  import { convertSchemaToText } from '$lib/richtext/shopifyRichText.js'

  export let data

  $: ({ page } = data)
  $: pageTitle = page.title?.value
  $: pageDescription = page.content?.value ? convertSchemaToText(page.content?.value) : undefined
  $: seoTitle = page?.seo?.title?.value
  $: seoDescription = page?.seo?.title?.value
</script>

<Seo {pageTitle} {pageDescription} {seoTitle} {seoDescription} />
