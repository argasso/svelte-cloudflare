<script lang="ts">
  import Hero from '$lib/components/Hero.svelte'
  import Sections from '$lib/components/Sections.svelte'
  import Seo from '$lib/components/Seo.svelte'
  import Wave from '$lib/components/Wave.svelte'
  import { convertSchemaToText } from '$lib/richtext/shopifyRichText.js'

  export let data

  $: ({ page, menu } = data)
  $: title = page?.title?.value
  $: intro = page?.content?.value
    ? convertSchemaToText(page?.content?.value)
    : 'Lättare att läsa för barn och ungdomar'
  $: pageTop = page?.pageTop
</script>

<Seo
  seoTitle={page?.seo?.title?.value}
  seoDescription={page?.seo?.description?.value}
  pageTitle={title}
  pageDescription={intro}
/>

<section class="gradient">
  <Hero {title} {intro} {pageTop} />
</section>

<Wave class="gradient" />

<Sections {page} {menu} />
