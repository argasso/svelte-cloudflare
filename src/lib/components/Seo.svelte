<script lang="ts">
  import { MetaTags } from 'svelte-meta-tags'

  export let seoTitle: string | null | undefined = undefined
  export let seoDescription: string | null | undefined = undefined
  export let pageTitle: string | null | undefined = undefined
  export let pageDescription: string | null | undefined = undefined

  $: title = seoTitle ?? pageTitle ?? 'No title yet'
  $: description = seoDescription ?? pageDescription ?? undefined
</script>

<MetaTags {title} {description} titleTemplate="%s | Argasso bokförlag" />
