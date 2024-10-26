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
      pageSize: string
      pageSort: string
      totalCount: number
    }
  }
</script>

<script lang="ts">
  import BookCard from '$lib/components/BookCard.svelte'
  import Section from '$lib/components/Section.svelte'
  import AppliedFilterButton from '$lib/components/filter/AppliedFilterButton.svelte'
  import MobileFilter from '$lib/components/filter/MobileFilter.svelte'
  import {
    getDecendants,
    sizeOptions,
    sortOptions,
    type EnhancedFilter,
  } from '$lib/components/filter/shopifyFilters'
  import GridSelect from '$lib/components/grid/GridSelect.svelte'
  import Button from '$lib/components/ui/button/button.svelte'
  import { Separator } from '$lib/components/ui/separator/index.js'
  import ChevronLeft from 'lucide-svelte/icons/chevron-left'
  import ChevronRight from 'lucide-svelte/icons/chevron-right'
  import ProductGridNavigation from './ProductGridNavigation.svelte'
  import GridSelect2 from './GridSelect2.svelte'

  export let products: TProducts
  export let filters: EnhancedFilter[]

  $: books = products.nodes
  $: pageInfo = products.pageInfo
  $: count = books.length

  $: appliedFilters = filters
    .flatMap(({ values }) => values.flatMap(getDecendants))
    .filter((v) => v.active)
</script>

{#if books.length >= 0}
  <Section class="bg-card">
    <form name="productQuery">
      <div class="mb-3 flex flex-wrap items-center gap-2 text-sm text-gray-600">
        <div class="mr-2">
          {#if pageInfo.totalCount > pageInfo.pageSize}
            Visar {count} av {pageInfo.totalCount} böcker
          {:else if count === 1}
            Visar {count} bok
          {:else}
            Visar {count} böcker
          {/if}
        </div>
        <div class="my-2 hidden self-stretch md:flex">
          <Separator orientation="vertical" />
        </div>
        <GridSelect2
          name="sort"
          value={pageInfo.pageSort}
          label="Välj ordning"
          options={sortOptions}
        />
        <div class="my-2 hidden self-stretch md:flex">
          <Separator orientation="vertical" />
        </div>
        <GridSelect2
          name="size"
          value={pageInfo.pageSize}
          label="Antal per sida"
          options={sizeOptions}
          suffix="per sida"
        />
        <div class="my-2 hidden self-stretch md:flex">
          <Separator orientation="vertical" />
        </div>
        <MobileFilter {filters} />
        <div class="flex flex-1 justify-end">
          <ProductGridNavigation {pageInfo} />
        </div>
      </div>
    </form>

    <div class="mb-5 flex gap-2 text-gray-500">
      {#each appliedFilters as filter (filter.id)}
        <AppliedFilterButton {filter}></AppliedFilterButton>
      {/each}
    </div>
    <!-- <Separator class="my-2" /> -->
    <div
      class="grid flex-auto grid-cols-2 justify-items-start gap-x-4 gap-y-14 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6"
    >
      {#if books.length > 0}
        {#each books as book}
          <div class="self-end">
            <BookCard bookThumb={book} />
          </div>
        {/each}
        <form name="productQuery">
          <div class="flex flex-1 justify-center">
            <ProductGridNavigation {pageInfo} />
          </div>
        </form>
      {:else}
        <div class="col-span-2 sm:col-span-3 lg:col-span-4 xl:col-span-6">
          <h2>Vi hittar inga böcker som matchar urvalet</h2>
          <p>Prova att ändra gjorda urval eller nollställ urvalet.</p>
        </div>
      {/if}
    </div>
    <div class="my-3 flex flex-wrap items-center gap-2 pb-6 text-sm text-gray-600"></div>
  </Section>
{/if}
