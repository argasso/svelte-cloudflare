<script lang="ts">
  import { Image } from '@unpic/svelte'
  import { onlyMediaImages } from '$lib'
  import ShopifyImage from '$lib/components/image/ShopifyImage.svelte'
  import { convertSchemaToHtml } from '$lib/richtext/shopifyRichText'
  import BookCard from '$lib/components/BookCard.svelte'

  export let data

  $: ({ author, books } = data)
  $: html = author?.description?.value
    ? convertSchemaToHtml(JSON.parse(author?.description?.value))
    : undefined
</script>

<div class="container mt-10">
  <!-- <Breadcrumb crumbs={breadcrumbs} /> -->

  <article>
    <div class="flex flex-col items-start gap-20 md:flex-row xl:pr-64">
      <div class="flex-1">
        <h1>{author?.title?.value}</h1>
        {#if html}
          <div>{@html html}</div>
        {/if}
      </div>
      <div class="max-w-xs flex-shrink">
        {#if author?.image?.reference}
          <ShopifyImage
            class="h-72 w-72 rounded-full"
            image={onlyMediaImages([author.image?.reference])[0].image}
            width={500}
          />
        {:else}
          <Image src={'/uploads/foerfattare/anonymous.jpg'} width={500} height={500} />
        {/if}
      </div>
    </div>
  </article>
  {#if books.length > 0}
    <section>
      <h3>Böcker av {author?.title?.value}</h3>
      <div
        class="grid grid-cols-2 justify-items-start gap-x-3 gap-y-10 py-10 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"
      >
        {#each books as bookThumb (bookThumb.handle)}
          <div class="self-end">
            <BookCard {bookThumb} />
          </div>
        {/each}
      </div>
    </section>
  {/if}
</div>
