<script lang="ts">
  import { isNonNil, isType, publishMonth } from '$lib'
  import Authors from '$lib/components/Authors.svelte'
  import BookDetails from '$lib/components/BookDetails.svelte'
  import Breadcrumb from '$lib/components/Breadcrumbs.svelte'
  import BuyButton from '$lib/components/BuyButton.svelte'
  import ShopifyImage from '$lib/components/image/ShopifyImage.svelte'
  import Price from '$lib/components/Price.svelte'
  import Seo from '$lib/components/Seo.svelte'
  import { findMenuItemByHandle } from '$lib/menu.js'

  export let data

  $: ({ product, metafieldLabels, menu } = data)
  $: variants = product?.variants.nodes ?? []
  $: selectedVariant = product?.variants.nodes.at(0)
  $: isbn = selectedVariant?.barcode
    ? [{ label: 'ISBN', key: 'isbn', value: [item(selectedVariant.barcode)] }]
    : []
  $: metafields =
    selectedVariant?.metafields.filter(isNonNil).map((metafield) => {
      const { key, type, references } = metafield
      const label = metafieldLabels.get(key) ?? key
      if (type === 'list.metaobject_reference') {
        const value = references?.nodes
          .filter(isType('Metaobject'))
          .map((m) =>
            m?.title?.value
              ? item(m.title.value, findMenuItemByHandle(menu, m.handle)?.href)
              : undefined,
          )
          .filter(isNonNil)
        return { key, label, value }
      } else if (type === 'list.single_line_text_field') {
        const parsed = JSON.parse(metafield.value) as string | string[]
        const value = Array.isArray(parsed) ? parsed.map((text) => item(text)) : [item(parsed)]
        return { key, label, value }
      } else if (type === 'date' && key === 'publish_month') {
        const value = [item(publishMonth(metafield.value) ?? '')]
        return { key, label, value }
      } else {
        const value = [item(metafield.value)]
        return { label, key, value }
      }
    }) ?? []
  $: details = [...metafields, ...isbn].filter(isNonNil)
  $: crumbs = [
    {
      name: 'Startsida',
      href: '/',
    },
    {
      name: product?.title ?? '',
    },
  ]

  let currentImageIndex = 0

  function item(text: string, href?: string | undefined) {
    return { text, href }
  }
</script>

<svelte:head>
  <title>{product?.title}</title>
</svelte:head>

<Seo
  seoTitle={product?.seo.title}
  seoDescription={product?.seo.description}
  pageTitle={product?.title}
  pageDescription={product?.description}
/>

<div class="container pb-20">
  <Breadcrumb {crumbs} />
  {#if product && selectedVariant}
    <section class="py-12">
      <div
        class="grid grid-cols-[1fr_2fr] grid-rows-[auto_1fr_auto_auto] gap-10 sm:grid-rows-[auto_auto_auto_1fr]"
      >
        <div class="row-span-2 h-full sm:row-span-4">
          <div class="book grid">
            <ShopifyImage
              class="col-start-1 row-start-1 rounded-r-sm sm:top-16"
              image={selectedVariant.image}
              alt={`Omslag för ${product?.title} - ${selectedVariant.selectedOptions.map((o) => `${o.name}: ${o.value}`).join(', ')}`}
            />
            <div class="book-overlay col-start-1 row-start-1"></div>
          </div>
        </div>
        <div class="">
          <div class="flex items-center justify-between">
            <h2
              class="title-font my-1 text-xs uppercase tracking-widest sm:text-sm md:text-base lg:text-lg"
            >
              <Authors book={product} />
            </h2>
            <!-- <div class="ml-2 flex gap-2 border-l-2 border-gray-200 py-2 pl-2 text-lg sm:text-2xl">
              <a href="" class="text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"
                  ><path
                    fill="currentColor"
                    d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95"
                  /></svg
                >
              </a>
              <a href="">
                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"
                  ><path
                    fill="currentColor"
                    d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4zm9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8A1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5a5 5 0 0 1-5 5a5 5 0 0 1-5-5a5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3a3 3 0 0 0 3 3a3 3 0 0 0 3-3a3 3 0 0 0-3-3"
                  /></svg
                >
              </a>
            </div> -->
          </div>
          <h1 class="my-0 text-2xl font-medium lg:text-3xl xl:text-4xl">
            {product?.title}
          </h1>
        </div>
        <div class="col-span-2 col-start-1 row-start-3 sm:col-span-1 sm:col-start-2 sm:row-start-2">
          {@html product?.descriptionHtml}
        </div>
        <div class="col-start-2 row-start-2 sm:col-start-2 sm:row-start-3">
          {#if selectedVariant.discontinued?.value === 'true'}
            <div
              class="rounded-r-lg border-l-4 border-primary bg-muted p-4 text-argasso-500"
              role="alert"
            >
              <p class="font-bold">Utgått</p>
              <p>Denna titel har utgått och går inte längre att köpa.</p>
            </div>
            <!-- <a
                href={`https://www.bokfynd.nu/${selectedVariant.barcode}`}
                target="_blank"
                class="focus:shadow-outline ml-auto flex rounded-full bg-slate-200 px-12 py-4 shadow-lg"
              >
                Köp via Bokfynd
              </a> -->
          {:else}
            <div class="flex flex-col items-center justify-end gap-4 sm:flex-row">
              <Price
                class="text-argasso2-200 text-xl font-semibold"
                price={selectedVariant.price}
              />
              <BuyButton size="lg" variantId={selectedVariant.id} />
            </div>
          {/if}
        </div>
        <div class="col-span-2 row-start-4 sm:col-span-1 sm:col-start-2 sm:row-start-4">
          <BookDetails {details} />
          {#if variants.length > 1}
            <h4>Finns i flera format</h4>
            <div class="my-2 flex gap-2">
              {#each variants as variant, i}
                <button
                  class="flex items-center gap-3 rounded border-2 border-solid bg-gray-50 p-2 text-sm shadow-sm {selectedVariant.id ===
                  variant.id
                    ? 'border-argasso2-200'
                    : ''}"
                  disabled={selectedVariant.id === variant.id}
                  on:click={() => (selectedVariant = variant)}
                >
                  <div class="flex-none">
                    <ShopifyImage
                      image={variant.image}
                      height={40}
                      on:click={() => {
                        currentImageIndex = i
                      }}
                    />
                  </div>
                  <div class="flex-grow">
                    {variant.selectedOptions.map((o) => o.value).join(' - ')}
                  </div>
                  <Price class="flex-none" price={variant.price} />
                </button>
              {/each}
            </div>
          {/if}
        </div>
      </div>
    </section>
  {/if}
</div>

<style>
  .book {
    box-shadow: 2px 4px 16px rgba(0, 0, 0, 0.12);
  }

  .book:hover {
    box-shadow: 0 16px 40px rgba(0, 0, 0, 0.16);
    transform: scale(1.01);
  }

  .book-overlay {
    border-radius: 0 3px 3px 0;
    background: linear-gradient(
      to right,
      rgba(0, 0, 0, 0.02) 0%,
      rgba(0, 0, 0, 0.05) 0.75%,
      rgba(255, 255, 255, 0.5) 1%,
      rgba(255, 255, 255, 0.6) 1.3%,
      rgba(255, 255, 255, 0.5) 1.4%,
      rgba(255, 255, 255, 0.3) 1.5%,
      rgba(255, 255, 255, 0.3) 2.4%,
      rgba(0, 0, 0, 0.05) 2.7%,
      rgba(0, 0, 0, 0.05) 3.5%,
      rgba(255, 255, 255, 0.3) 4%,
      rgba(255, 255, 255, 0.3) 4.5%,
      rgba(244, 244, 244, 0.1) 5.4%,
      rgba(244, 244, 244, 0.1) 99%,
      rgba(144, 144, 144, 0.2) 100%
    );
    box-shadow: inset 0 -1px 4px rgba(0, 0, 0, 0.12);
  }
</style>
