<script lang="ts" context="module">
  import { graphql, type ResultOf } from '../../graphql'
  import { authorsFragment } from './Authors.svelte'
  import { priceFragment } from './Price.svelte'

  export const pageInfoFragment = graphql(`
    fragment PageInfo on ProductConnection @_unmask {
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
    }
  `)

  export const productsQuery = graphql(
    `
      query Products(
        $sortKey: ProductCollectionSortKeys = TITLE
        $reverse: Boolean = false
        $filters: [ProductFilter!]
        $first: Int
        $after: String
        $last: Int
        $before: String
      ) @_unmask {
        collection(handle: "frontpage") {
          products(
            sortKey: $sortKey
            reverse: $reverse
            filters: $filters
            first: $first
            after: $after
            last: $last
            before: $before
          ) {
            nodes {
              id
              title
              handle
              images(first: 1) {
                nodes {
                  url
                  altText
                  height
                  width
                }
              }
              ...AuthorsFragment
              variants(first: 3) {
                nodes {
                  id
                  price {
                    ...PriceFragment
                  }
                  discontinued: metafield(namespace: "book", key: "discontinued") {
                    value
                  }
                }
              }
            }
            filters {
              id
              label
              type
              values {
                count
                id
                input
                label
              }
            }
            ...PageInfo
          }
        }
      }
    `,
    [priceFragment, authorsFragment, pageInfoFragment],
  )

  export type TProductsQuery = typeof productsQuery
  export type TProductsServerResult = NonNullable<
    ResultOf<TProductsQuery>['collection']
  >['products']
  export type TProducts = Omit<TProductsServerResult, 'filters'> & {
    pageInfo: {
      pageSort: string
      pageSize: number
      totalCount: number
    }
  }
</script>

<script lang="ts">
  import BookCard from '$lib/components/BookCard.svelte'
  import Section from '$lib/components/Section.svelte'
  import AppliedFilterButton from '$lib/components/filter/AppliedFilterButton.svelte'
  import { getDecendants, type EnhancedFilter } from '$lib/components/filter/shopifyFilters'
  import ProductGridToolbar from './ProductGridToolbar.svelte'
  import Filters from './filter/Filters.svelte'
  import Separator from './ui/separator/separator.svelte'
  import { enhance } from '$app/forms'
  import Logo from './logo/Logo.svelte'
  import { isFilterOpen } from '$lib/stores/store'
  import Button from './Button.svelte'

  export let products: TProducts
  export let filters: EnhancedFilter[]
  export let filtersOn = false

  $: books = products.nodes
  $: pageInfo = products.pageInfo
  $: count = books.length
  $: appliedFilters = filters
    .flatMap(({ values }) => values.flatMap(getDecendants))
    .filter((v) => v.active)

  let form: HTMLFormElement
  function requestSubmit() {
    form?.requestSubmit()
  }
  const formId = 'product-filter'
</script>

{#if books.length >= 0}
  <Section class="bg-card">
    <div
      class:filtering={$isFilterOpen}
      class="filtered-grid grid grid-rows-[auto_30px_1fr] items-start gap-8 gap-y-4 transition-all"
    >
      <div class="col-span-2">
        <form bind:this={form} data-sveltekit-keepfocus data-sveltekit-noscroll id={formId}>
          <ProductGridToolbar {count} {filters} {filtersOn} {pageInfo} {requestSubmit} />
        </form>
      </div>

      <div class="row-start-2 flex gap-2 text-gray-500">
        <div class="flex items-center">
          {#each appliedFilters as filter (filter.id)}
            <AppliedFilterButton {filter}></AppliedFilterButton>
          {/each}
          {#if appliedFilters.length > 0}
            <Button type="submit" name="reset" value="filters" variant="link" form={formId}>
              Rensa urvalsfilter
            </Button>
          {/if}
        </div>
      </div>

      <div class="col-start-2 row-span-2 row-start-3 overflow-hidden">
        <div class="filters w-64" inert={!$isFilterOpen}>
          <Filters {filters} {formId} {requestSubmit} />
        </div>
      </div>

      <div
        class="col-start-1 row-start-3 grid flex-auto grid-cols-2 justify-items-start gap-x-4 gap-y-14 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6"
      >
        {#if books.length > 0}
          {#each books as book}
            <div class="self-end">
              <BookCard bookThumb={book} />
            </div>
          {/each}
        {:else}
          <div class="col-span-2 sm:col-span-3 lg:col-span-4 xl:col-span-6">
            <h2>Vi hittar inga böcker som matchar urvalet</h2>
            <p>Prova att ändra gjorda urval eller nollställ urvalet.</p>
          </div>
        {/if}
      </div>
    </div>

    <!-- {#if books.length > 0}
        <ProductGridToolbar {count} {filters} {pageInfo} />
      {/if} -->
  </Section>
{/if}

<style>
  .filtered-grid {
    grid-template-columns: 1fr 0px;
  }

  .filtered-grid.filtering,
  .filtered-grid .filters:focus-within {
    grid-template-columns: 1fr 256px;
  }
</style>
