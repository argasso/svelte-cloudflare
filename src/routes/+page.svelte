<script lang="ts">
  import { page } from '$app/stores'
  import Hero from '$lib/components/Hero.svelte'
  import JsonLd from '$lib/components/JsonLd.svelte'
  import Sections from '$lib/components/Sections.svelte'
  import Seo from '$lib/components/Seo.svelte'
  import Wave from '$lib/components/Wave.svelte'
  import { convertSchemaToText } from '$lib/richtext/shopifyRichText.js'

  export let data

  $: ({ page: shopifyPage, menu } = data)
  $: title = shopifyPage?.title?.value
  $: intro = shopifyPage?.content?.value
    ? convertSchemaToText(shopifyPage?.content?.value)
    : 'Lättare att läsa för barn och ungdomar'

  $: organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Argasso bokförlag',
    description: 'Lättlästa böcker för barn och ungdomar – barnböcker, ungdomsböcker och faktaböcker från Argasso bokförlag i Örnsköldsvik.',
    url: $page.url.origin,
    logo: {
      '@type': 'ImageObject',
      url: `${$page.url.origin}/favicon.svg`,
    },
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Villagatan 34',
      addressLocality: 'Örnsköldsvik',
      postalCode: '891 37',
      addressCountry: 'SE',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+46-660-273640',
      contactType: 'customer service',
      availableLanguage: 'Swedish',
    },
  }

  $: websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Argasso bokförlag',
    url: $page.url.origin,
  }
</script>

<JsonLd schema={organizationSchema} />
<JsonLd schema={websiteSchema} />

<Seo
  seoTitle={shopifyPage?.seo?.title?.value}
  seoDescription={shopifyPage?.seo?.description?.value}
  pageTitle={title}
  pageDescription={intro}
/>

<section class="gradient">
  <!-- <Hero {title} {intro} {pageTop} /> -->
  <Hero {title} {intro} />
</section>

<Wave class="gradient" />

{#if shopifyPage}
  <Sections page={shopifyPage} {menu} />
{/if}
