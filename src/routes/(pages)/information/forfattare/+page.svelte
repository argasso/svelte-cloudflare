<script lang="ts">
  import { authorUrl } from '$lib'

  export let data

  $: authors = data.authors
    .map((a) => ({ ...a, lastName: getLastName(a) }))
    .sort((a, b) => a.lastName.localeCompare(b.lastName))
    .reduce((acc, a) => {
      const letter = a.lastName[0].toUpperCase()
      if (acc.has(letter)) {
        acc.get(letter)?.push(a)
      } else {
        acc.set(letter, [a])
      }
      return acc
    }, new Map<string, AuthorNode[]>())

  type AuthorNode = (typeof data)['authors'][number]
  function getLastName(author: AuthorNode) {
    return author.name?.value?.split(' ').at(-1) ?? ''
  }
</script>

<div class="container pb-20">
  <div class="grid grid-cols-1 gap-10 sm:grid-cols-2 md:grid-cols-4 xl:grid-cols-6">
    {#each authors.entries() as [key, value]}
      <div>
        <h2>{key}</h2>
        <hr />
        <div class="mt-2">
          {#each value as author}
            <p class="my-2">
              <a href={authorUrl(author.handle)}>{author.name?.value}</a>
            </p>
          {/each}
        </div>
      </div>
    {/each}
  </div>
</div>
