<script lang="ts">
  import { bookUrl, isNonNil, isType, publishMonth } from '$lib'
  import { flatten, type MenuItem } from '$lib/menu'
  import Authors from './Authors.svelte'
  import type { TBookPromo } from './BookCardPromo.gql'
  import BookImage from './image/BookImage.svelte'
  import Pill from './Pill.svelte'

  export let variant: TBookPromo
  export let menu: MenuItem | undefined

  $: menuItems = flatten(menu)
  $: categories = variant.categories?.references?.nodes
    .filter(isType('Metaobject'))
    .map((c) => menuItems.find((i) => i.id === c.id))
    .filter((c) => c?.parent?.href !== '/')
    .filter(isNonNil)
  $: month = publishMonth(variant.publishMonth?.value)
</script>

<div class="my-5 md:my-0">
  <div class="flex flex-col items-start gap-6 xs:flex-row">
    <BookImage
      href={bookUrl(variant.product.handle, variant.sku)}
      image={variant.image ?? variant.product.images.nodes[0]}
      width={128}
      alt={`Bokomslag för ${variant.title}`}
      binding={variant.binding?.value}
    />
    <div class="flex flex-col items-start justify-center">
      <Authors book={variant.product}></Authors>

      <h3 class="font-sans text-lg font-semibold leading-6">
        <a class="text-foreground" href={bookUrl(variant.product.handle, variant.sku)}
          >{variant.title !== 'Default Title' ? variant.title : variant.product.title}</a
        >
      </h3>

      <p class="text-sm leading-normal text-muted-foreground">
        {variant.product.description}
      </p>
      <!-- <div class="js-only">
        <p class="my-1 line-clamp-5 text-sm leading-normal text-muted-foreground">
          {@html book.descriptionHtml}
        </p>
      </div> -->
      {#if month}
        <p class=" text-xs text-muted-foreground"><i>- {month}</i></p>
      {/if}
    </div>
  </div>
  {#if categories}
    <div class="mt-3">
      {#each categories as category (category.href)}
        <Pill name={category.name} href={category.href} />
      {/each}
    </div>
  {/if}
</div>
