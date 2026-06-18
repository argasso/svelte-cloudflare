<script lang="ts">
  import { page } from '$app/stores'
  import { MetaTags } from 'svelte-meta-tags'

  export let seoTitle: string | null | undefined = undefined
  export let seoDescription: string | null | undefined = undefined
  export let pageTitle: string | null | undefined = undefined
  export let pageDescription: string | null | undefined = undefined
  export let ogImage: { url: string; width?: number; height?: number; alt?: string } | undefined =
    undefined
  export let ogType: 'website' | 'article' | 'book' = 'website'
  export let canonical: string | undefined = undefined

  const BRAND = 'Argasso bokförlag'
  $: title = seoTitle ?? pageTitle ?? BRAND
  $: fullTitle = title === BRAND ? BRAND : `${title} | ${BRAND}`
  $: description = seoDescription ?? pageDescription ?? undefined
  $: canonicalUrl = canonical ?? $page.url.href
</script>

<MetaTags
  {title}
  {description}
  titleTemplate="%s | Argasso bokförlag"
  canonical={canonicalUrl}
  openGraph={{
    title: fullTitle,
    description: description ?? '',
    locale: 'sv_SE',
    type: ogType,
    url: canonicalUrl,
    ...(ogImage ? { images: [ogImage] } : {}),
  }}
  twitter={{
    cardType: ogImage ? 'summary_large_image' : 'summary',
    title: fullTitle,
    description: description ?? '',
    ...(ogImage ? { image: ogImage.url, imageAlt: ogImage.alt ?? '' } : {}),
  }}
/>
