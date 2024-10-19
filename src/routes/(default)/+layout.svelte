<script lang="ts">
  import Breadcrumbs from '$lib/components/Breadcrumbs.svelte'

  export let data

  $: ({ crumbs } = data)
</script>

<div class="container">
  <Breadcrumbs {crumbs} />
</div>

<slot />
