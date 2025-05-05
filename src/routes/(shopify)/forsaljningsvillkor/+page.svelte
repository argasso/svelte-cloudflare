<script lang="ts">
  import Section from '$lib/components/Section.svelte'

  export let data
</script>

<Section>
  <h1 class="mb-8 mt-0 w-full text-center md:text-left">Försäljningsvillkor</h1>
  <div class="prose lg:prose-xl prose-headings:font-normal">
    {@html data.page}
  </div>
</Section>
