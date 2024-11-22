<script lang="ts">
  import { bookUrl, isNonNil, isType } from '$lib'
  import { flatten, type MenuItem } from '$lib/menu'
  import Authors from './Authors.svelte'
  import type { TBookPromo } from './BookCardPromo.gql'
  import BookImage from './image/BookImage.svelte'
  import Pill from './Pill.svelte'

  export let book: TBookPromo
  export let menu: MenuItem | undefined

  $: variant = book?.variants.nodes?.[0]
  $: menuItems = flatten(menu)
  $: categories = variant.categories?.references?.nodes
    .filter(isType('Metaobject'))
    .map((c) => menuItems.find((i) => i.id === c.id))
    .filter((c) => c?.parent?.href !== '/')
    .filter(isNonNil)
</script>

<div class="flex flex-col items-start gap-6 xs:flex-row">
  <BookImage href={bookUrl(book.handle)} image={book.images.nodes[0]} width={128} />
  <div class="flex-0 flex flex-col items-start justify-center">
    <p class="my-0 font-serif text-xs">
      <Authors {book}></Authors>
    </p>

    <h3 class="my-0 text-lg font-semibold leading-6">
      <a class="text-foreground" href={bookUrl(book.handle)}>{book.title}</a>
    </h3>

    <p class="my-3 line-clamp-5 text-sm leading-normal text-muted-foreground">
      {@html book.descriptionHtml}
    </p>
    <!-- {#if book?.variants?.nodes?.[0]}
      <Price price={variant?.price} />
    {/if} -->
    {#if categories}
      <p>
        {#each categories as category (category.href)}
          <Pill name={category.name} href={category.href} />
        {/each}
      </p>
    {/if}
    <!-- <p class="text-xs uppercase text-gray-500">{generalDetails.publishMonth}</p> -->
  </div>
</div>
