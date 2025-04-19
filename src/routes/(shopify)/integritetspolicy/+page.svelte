<script lang="ts">
  import Section from '$lib/components/Section.svelte'

  export let data
</script>

<Section>
  <h1 class="mb-8 mt-0 w-full text-center md:text-left">
    {data.title}
  </h1>
  {@html data.page}
</Section>
