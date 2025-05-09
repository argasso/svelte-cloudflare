<script lang="ts">
  import Breadcrumbs from '$lib/components/Breadcrumbs.svelte'
  import Section from '$lib/components/Section.svelte'

  export let data
  $: ({ page } = data)

  const crumbs = [{ name: 'Startsida', href: '/' }, { name: 'Försäljningsvillkor' }]
</script>

<div class="container">
  <Breadcrumbs {crumbs} />
</div>

<Section>
  <div class="prose dark:prose-invert prose-headings:font-normal">
    <h1 class="w-full text-center md:text-left">Försäljningsvillkor</h1>
    {@html page}
  </div>
</Section>
