<script lang="ts">
  import Hero2 from '$lib/components/Hero.svelte'
  import Sections from '$lib/components/Sections.svelte'
  import Wave from '$lib/components/Wave.svelte'
  import { makeMenu } from '$lib/menu.js'

  export let data

  $: ({ Page, MainMenu } = data)
  $: menu = makeMenu(MainMenu)
</script>

<!-- <section class="gradient">
  <Hero2 title={Page.title?.value} sections={Page} />
</section> -->
<Wave class="gradient" />
<!-- <Sections sections={Page} {menu} /> -->
