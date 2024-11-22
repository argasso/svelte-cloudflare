<script lang="ts">
  import { authorUrl, getByType, isType } from '$lib'
  import { graphql, type FragmentOf } from '../../graphql'
  import type { TAuthors } from './Authors.graphql'
  // import Link from './Link.svelte'

  let className = ''
  export { className as class }
  export let book: TAuthors
  export let one = false

  $: authors = book.authors?.references?.nodes.filter(isType('Metaobject')) ?? []
  $: numAuthors = authors?.length ?? 0
</script>

{#if numAuthors > 0}
  <div class="{className} leading-4x mb-2 font-sans text-xs">
    {#each authors as author, index}
      {#if !one || index === 0}
        {#if index > 0}
          &nbsp;&middot;
        {/if}
        <a class="" href={authorUrl(author.handle)}>
          {author.name?.value}
        </a>
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
