<script lang="ts">
  import { isNonNil, isType, publishMonth } from '$lib'
  import Authors from '$lib/components/Authors.svelte'
  import BookCard from '$lib/components/BookCard.svelte'
  import BookDetails from '$lib/components/BookDetails.svelte'
  import Breadcrumb from '$lib/components/Breadcrumbs.svelte'
  import Button from '$lib/components/Button.svelte'
  import BuyButton from '$lib/components/BuyButton.svelte'
  import ShopifyImage from '$lib/components/image/ShopifyImage.svelte'
  import Price from '$lib/components/Price.svelte'
  import Seo from '$lib/components/Seo.svelte'
  import { findMenuItemByHandle } from '$lib/menu.js'
  import Download from 'lucide-svelte/icons/download'

  export let data

  const physicalShopCategories = [
    'gid://shopify/Metaobject/82501730639',
    'gid://shopify/Metaobject/82501763407',
  ]

  $: ({ product, variant, otherVariants, metafieldLabels, menu, recommendations } = data)
  //   $: variants = product?.variants.nodes ?? []
  //   $: selectedVariant = product?.variants.nodes.at(0)
  $: isbn = variant?.barcode ? [{ label: 'ISBN', key: 'isbn', value: [item(variant.barcode)] }] : []
  $: metafields =
    variant?.metafields.filter(isNonNil).map((metafield) => {
      const { key, type, references } = metafield
      const label = metafieldLabels.get(key) ?? key
      if (type === 'list.metaobject_reference') {
        const value = references?.nodes
          .filter(isType('Metaobject'))
          .map((m) =>
            m?.title?.value
              ? item(m?.name?.value ?? m.title.value, findMenuItemByHandle(menu, m.handle)?.href)
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
  $: otherDetails = otherVariants.map((v) => ({
    key: v.id,
    label: { text: v.selectedOptions.at(0)?.value ?? '', href: `/bok/${product.handle}/${v.sku}` },
    value: [item(`${v.barcode}, utgiven ${getPublishMonth(v)}`)],
  }))
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
  function getPublishMonth(v: (typeof otherVariants)[number]) {
    return publishMonth(v.metafields.find((m) => m?.key === 'publish_month')?.value)
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

<div class="container">
  <Breadcrumb {crumbs} />
  <section class="py-12">
    <div
      class="grid grid-cols-[1fr_2fr] grid-rows-[auto_1fr_auto_auto] gap-10 gap-y-6 sm:grid-rows-[auto_auto_auto_1fr] lg:grid-cols-[1fr_1fr_1fr]"
    >
      <a
        class="group row-span-2 h-full sm:row-span-4"
        href={variant.image?.url}
        aria-label="Klicka för att ladda ned omslag i full skala"
      >
        <div class="group">
          <div class="book gr grid">
            <ShopifyImage
              class="col-start-1 row-start-1 rounded-r-sm sm:top-16"
              image={variant.image}
              alt={`Omslag för ${product?.title} - ${variant.selectedOptions.map((o) => `${o.name}: ${o.value}`).join(', ')}`}
            />
            <div class="book-overlay col-start-1 row-start-1"></div>
            <div class="invisible col-start-1 row-start-1 flex justify-end p-2 group-hover:visible">
              <div
                class="flex items-end justify-end gap-2 self-end rounded bg-foreground p-3 text-sm text-background"
              >
                <Download size="20" /> Ladda ned omslaget i full skala
              </div>
            </div>
          </div>
        </div>
      </a>
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
        <h1 class="my-2 text-2xl font-medium lg:text-3xl xl:text-4xl">
          {product?.title}
        </h1>
      </div>
      <div class="col-span-2 col-start-1 row-start-3 sm:col-span-1 sm:col-start-2 sm:row-start-2">
        {@html product?.descriptionHtml}
      </div>
      <div
        class="col-start-2 row-start-2 sm:col-start-2 sm:row-start-3 lg:col-span-2 lg:col-start-2 lg:row-start-3"
      >
        {#if variant.discontinued?.value === 'true'}
          <div
            class="rounded-r-lg border-l-4 border-primary bg-muted p-4 text-argasso-500"
            role="alert"
          >
            <p class="font-bold">Utgått</p>
            <p>Denna titel har utgått och går inte längre att köpa.</p>
          </div>
        {:else if variant.bokfynd?.value === 'true'}
          <div class="flex justify-end">
            <Button href={`https://www.bokfynd.nu/${variant.sku}`} target="_blank" size="lg">
              Köp via Bokfynd
            </Button>
          </div>
        {:else if physicalShopCategories.some((c) => variant.category?.value.includes(c))}
          <div class="rounded-r-lg border-l-4 border-primary bg-muted p-4" role="alert">
            <p class="font-bold">Inte tillgänglig här</p>
            <p>Besök bokhandel eller bibliotek för köp eller lån av denna titel.</p>
          </div>
        {:else}
          <div class="flex flex-col items-center justify-end gap-4 sm:flex-row">
            <Price class="text-argasso2-200 text-xl font-semibold" price={variant.price} />
            <BuyButton size="lg" variantId={variant.id} />
          </div>
        {/if}
      </div>
      <div
        class="col-span-2 row-start-4 sm:col-span-1 sm:col-start-2 sm:row-start-4 lg:col-start-3 lg:row-span-1 lg:row-start-2"
      >
        <BookDetails class="my-3" title="Bokfakta" {details} />
        {#if otherDetails.length > 0}
          <BookDetails class="my-3" title="Fler format" details={otherDetails} />
        {/if}
      </div>
    </div>
  </section>
</div>

<div class="bg-muted">
  {#if recommendations && recommendations.length > 0}
    <section class="container mt-10 pt-10">
      <h3>Liknande titlar</h3>
      <div
        class="grid grid-cols-2 justify-items-start gap-x-3 gap-y-10 py-10 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"
      >
        {#each recommendations as bookThumb (bookThumb.handle)}
          <div class="self-end">
            <BookCard {bookThumb} />
          </div>
        {/each}
      </div>
    </section>
  {/if}
</div>
