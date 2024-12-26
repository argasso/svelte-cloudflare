<script lang="ts">
  import Hero2 from '$lib/components/Hero.svelte'
  import Sections from '$lib/components/Sections.svelte'
  import Seo from '$lib/components/Seo.svelte'
  import Wave from '$lib/components/Wave.svelte'

  export let data

  $: ({ page, menu } = data)
  $: title = page?.title?.value
  $: pageTop = page?.pageTop
</script>

<Seo
  seoTitle={page?.seo?.title?.value}
  seoDescription={page?.seo?.description?.value}
  pageTitle={title}
  pageDescription={"'Lättare att läsa för barn och ungdomar"}
/>

<section class="gradient">
  <Hero2 {title} {pageTop} />
</section>

<Wave class="gradient" />

<Sections {page} {menu} />
