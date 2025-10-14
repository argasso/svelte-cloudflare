<script lang="ts">
  import { authorUrl, isType } from '$lib'
  import type { TAuthors } from './Authors.graphql'

  let className = ''
  export { className as class }
  export let book: TAuthors
  export let one = false
  export let noLink = false
  export let prefix: string | undefined = undefined

  $: authors = book.authors?.references?.nodes.filter(isType('Metaobject')) ?? []
  $: numAuthors = authors?.length ?? 0
</script>

{#if numAuthors > 0}
  <div class="{className} leading-4x text-sm">
    {#if prefix}
      {prefix}
    {/if}
    {#each authors as author, index}
      {#if !one || index === 0}
        {#if index > 0}
          &nbsp;&middot;
        {/if}
        {#if noLink}
          {author.name?.value}
        {:else}
          <a href={authorUrl(author.handle)}>
            {author.name?.value}
          </a>
        {/if}
      {/if}
    {/each}
    {#if one && authors.length > 1}
      m.fl.
    {/if}
  </div>
{/if}

<style>
  /* .author ~ .author::before {
    content: ', ';
  } */
</style>
