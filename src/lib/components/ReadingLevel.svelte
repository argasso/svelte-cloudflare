<script lang="ts">
  export let level: number
  export let levels = [1, 2, 3, 4]
</script>

<div class="flex h-full items-center">
  {#each levels as l}
    <span
      class:highlight={l <= level}
      class="mr-0.5 inline-block h-[19px] w-[19px] rounded-full border border-muted bg-accent px-0 py-0 text-center text-xs font-light uppercase text-white last:mr-0"
    >
      {#if l === level}
        {l}
      {:else}
        &nbsp;
      {/if}
    </span>
  {/each}
</div>

<style lang="postcss">
  .highlight {
    @apply bg-primary;
  }
</style>
