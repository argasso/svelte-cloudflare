<script lang="ts">
  import Breadcrumbs from '$lib/components/Breadcrumbs.svelte'
  import Section from '$lib/components/Section.svelte'

  export let data

  const crumbs = [{ name: 'Startsida', href: '/' }, { name: 'Integritetspolicy' }]
</script>

<div class="container">
  <Breadcrumbs {crumbs} />
</div>

<Section>
  <div class="prose dark:prose-invert prose-headings:font-normal">
    <h1 class="w-full text-center md:text-left">Integritetspolicy</h1>
    {@html data.page}
  </div>
</Section>
