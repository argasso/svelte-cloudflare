<script lang="ts" context="module">
  export const authorsFragment = graphql(`
    fragment AuthorsFragment on Product @_unmask {
      authors: metafield(namespace: "custom", key: "authors") {
        references(first: 3) {
          nodes {
            ... on Metaobject {
              id
              handle
              name: field(key: "name") {
                value
              }
            }
          }
        }
      }
    }
  `)
</script>

<script lang="ts">
  import { authorUrl, getByType, isType } from '$lib'
  import { graphql, type FragmentOf } from '../../graphql'
  // import Link from './Link.svelte'

  let className = ''
  export { className as class }
  export let book: FragmentOf<typeof authorsFragment>
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
