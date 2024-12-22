<script lang="ts">
  import { MetaTags } from 'svelte-meta-tags'

  export let seoTitle: string | null | undefined = undefined
  export let seoDescription: string | null | undefined = undefined
  export let pageTitle: string | null | undefined = undefined
  export let pageContent: string | null | undefined = undefined

  $: title = seoTitle ?? pageTitle ?? 'No title yet'
  $: description = seoDescription ?? pageContent ?? undefined
</script>

<MetaTags {title} titleTemplate="%s | Argasso bokförlag" {description} />
