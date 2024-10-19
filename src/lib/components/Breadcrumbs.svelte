<script lang="ts">
  export let crumbs: {
    href?: string
    name: string
  }[] = []
</script>

<nav class="flex py-3" aria-label="Breadcrumb">
  <ol class="inline-flex items-center">
    {#each crumbs as { href, name }}
      <li class="inline-flex items-center text-muted-foreground">
        <a {href} class="inline-flex items-center text-sm text-muted-foreground">
          {name}
        </a>
      </li>
    {/each}
  </ol>
</nav>

<style>
  li + li:before {
    content: '/';
    font-size: small;
    padding: 0 0.8rem;
  }
</style>
