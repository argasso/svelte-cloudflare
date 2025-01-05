<script lang="ts">
  import { enhance } from '$app/forms'
  import BookCard from '$lib/components/BookCard.svelte'
  import Section from '$lib/components/Section.svelte'
  import AppliedFilterButton from '$lib/components/filter/AppliedFilterButton.svelte'
  import { getDecendants } from '$lib/components/filter/shopifyFilters'
  import { isFilterOpen } from '$lib/stores/store'
  import Button from './Button.svelte'
  import ProductGridToolbar from './ProductGridToolbar.svelte'
  import type { TProducts } from './ProductsGrid.gql'
  import Filters from './filter/Filters.svelte'
  import ProductsGridForm from './grid/ProductsGridForm.svelte'

  export let products: TProducts

  $: ({ filters, nodes: books, totalCount, pageSize, pageInfo } = products)
  $: count = books.length
  $: appliedFilters = filters
    .flatMap(({ values }) => values.flatMap(getDecendants))
    .filter((v) => v.active)
</script>

{#if books.length >= 0}
  <Section class="bg-card">
    <div
      class:filtering={$isFilterOpen}
      class="filtered-grid grid grid-rows-[auto_1fr] items-start gap-y-4 transition-all"
    >
      <div class="col-span-2 text-sm font-light text-foreground">
        <div class="mr-2 py-5">
          {#if totalCount > pageSize}
            Visar {count} av {totalCount} böcker
          {:else if count === 1}
            Visar {count} bok
          {:else}
            Visar {count} böcker
          {/if}
        </div>

        <ProductGridToolbar {products} />

        <ProductsGridForm>
          <div class="my-6 flex min-h-10 flex-wrap items-center gap-3">
            {#each appliedFilters as filter (filter.id)}
              <AppliedFilterButton {filter}></AppliedFilterButton>
            {/each}
            {#if appliedFilters.length > 0}
              <Button
                class="h-6"
                variant="link"
                size="default"
                type="submit"
                name="reset"
                value="filters"
              >
                Rensa urvalsfilter
              </Button>
            {/if}
          </div>
        </ProductsGridForm>
      </div>

      <div class="filters col-start-2 row-span-2 row-start-2 hidden overscroll-contain md:block">
        <div class=" w-64" inert={!$isFilterOpen}>
          <Filters {products} />
        </div>
      </div>

      <div class:filtering={$isFilterOpen} class="book-grid col-start-1 row-start-2">
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
    <noscript>
      <h2 id="urval">Urval</h2>
      <Filters {products} />
    </noscript>
  </Section>
{/if}

<style>
  .filtered-grid {
    grid-template-columns: 1fr 0px;
  }

  @media (min-width: 768px) {
    .filtered-grid.filtering,
    .filters:focus-within {
      grid-template-columns: 1fr 256px;
      gap: 1rem 2rem;
    }
    .filters {
      overflow-x: hidden;
    }
  }

  @media (max-width: 768px) {
    /* .filters {
      display: none;
    } */

    /* .filters {
      position: fixed;
      bottom: 0;
      top: 0;
      right: 0;
      width: 300px;
      padding: 30px;
      z-index: 30;
      overflow-y: auto;
      background-color: hsl(var(--background));
    } */
  }

  .book-grid {
    display: grid;
    /* grid-column-end: 2; */
    grid-template-columns: repeat(auto-fill, minmax(9rem, 1fr));
    /* This is better for small screens, once min() is better supported */
    /* grid-template-columns: repeat(auto-fill, minmax(min(200px, 100%), 1fr)); */
    /* gap: 1rem; */
    column-gap: 1rem;
    row-gap: 3.5rem;
    justify-items: start;
  }
  @media (min-width: 1024px) {
    .book-grid {
      grid-template-columns: repeat(auto-fill, minmax(11rem, 1fr));
    }
  }
  .book-grid.filtering {
    /* grid-column-end: 1; */
  }
</style>
