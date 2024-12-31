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

  export let products: TProducts

  $: ({ filters, nodes: books, totalCount, pageSize } = products)
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

        <form bind:this={form} data-sveltekit-keepfocus data-sveltekit-noscroll id={formId}>
          <ProductGridToolbar {products} {filters} {formId} {requestSubmit} />
          <div class="js-only flex min-h-10 flex-wrap items-center gap-2">
            {#each appliedFilters as filter (filter.id)}
              <AppliedFilterButton {filter}></AppliedFilterButton>
            {/each}
            {#if appliedFilters.length > 0}
              <Button
                variant="link"
                size="sm"
                type="submit"
                name="reset"
                value="filters"
                form={formId}
              >
                Rensa urvalsfilter
              </Button>
            {/if}
          </div>
        </form>
      </div>

      <div class="filters col-start-2 row-span-2 row-start-2 overscroll-contain">
        <div class=" w-64" inert={!$isFilterOpen}>
          <Filters {filters} {formId} {requestSubmit} />
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
  </Section>
{/if}

<style>
  .filtered-grid {
    grid-template-columns: 1fr 0px;
  }

  @media (min-width: 640px) {
    .filtered-grid.filtering,
    .filters:focus-within {
      grid-template-columns: 1fr 256px;
      gap: 0 2rem;
    }
    .filters {
      overflow-x: hidden;
    }
  }

  @media (max-width: 640px) {
    .filters {
      display: none;
    }
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
    grid-column-end: 2;
    grid-template-columns: repeat(auto-fill, minmax(11rem, 1fr));
    /* This is better for small screens, once min() is better supported */
    /* grid-template-columns: repeat(auto-fill, minmax(min(200px, 100%), 1fr)); */
    /* gap: 1rem; */
    column-gap: 1rem;
    row-gap: 3.5rem;
    justify-items: start;
  }
  .book-grid.filtering {
    grid-column-end: 1;
  }
</style>
