<script lang="ts">
  import { getByType } from '$lib'
  import type { MenuItem } from '$lib/menu'
  import { convertSchemaToHtml } from '$lib/richtext/shopifyRichText'
  import Download from 'lucide-svelte/icons/download'
  import DownloadButton from '../DownloadButton.svelte'
  import ShopifyImage from '../image/ShopifyImage.svelte'
  import Section from './Section.svelte'
  import type { TSektionStudiematerial } from './SektionStudiematerial.gql'
  import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'

  let className = ''
  export { className as class }
  export let section: TSektionStudiematerial

  const physicalShopCategories = [
    'gid://shopify/Metaobject/82501730639',
    'gid://shopify/Metaobject/82501763407',
  ]
  $: html = section.content?.value
    ? convertSchemaToHtml(JSON.parse(section.content.value))
    : undefined
  $: description = section.description?.value
    ? convertSchemaToHtml(JSON.parse(section.description.value))
    : undefined
  $: elevFile = getByType('GenericFile', section.elevmaterial?.reference)
  $: lararFile = getByType('GenericFile', section.lararmaterial?.reference)
  $: image = getByType('MediaImage', section.image?.reference)?.image
</script>

{#if description && image}
  <Section class={className} hClass="mb-3">
    <div
      class="grid grid-cols-[1fr_2fr] grid-rows-[auto_1fr_auto_auto] gap-10 gap-y-6 sm:grid-rows-[auto_auto_auto_auto] lg:grid-cols-[1fr_2fr_2fr]"
    >
      <div class="group">
        <div class="book gr grid">
          <ShopifyImage
            class="col-start-1 row-start-1 rounded-r-sm sm:top-16"
            {image}
            alt={`Omslag för ${section.rubrik?.value}}`}
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
      <div class="">
        <div class="flex items-center justify-between">
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
        <h1 id={section.handle} class="my-2 text-2xl font-medium lg:text-3xl xl:text-4xl">
          {section.rubrik?.value}
        </h1>
        {#if description}
          <div
            class="col-span-2 col-start-1 row-start-3 sm:col-span-1 sm:col-start-2 sm:row-start-2"
          >
            {@html description}
          </div>
        {/if}
      </div>
      <!-- {#if variant}
        <div
          class="col-start-2 row-start-2 sm:col-start-2 sm:row-start-3 lg:col-span-2 lg:col-start-2 lg:row-start-3"
        >
          {#if variant?.discontinued?.value === 'true'}
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
              <p class="font-bold">Den digitala boken inte tillgänglig här</p>
              <p>Besök bokhandel eller bibliotek för köp eller lån av denna titel.</p>
            </div>
          {:else}
            <div class="flex flex-col items-center justify-end gap-4 sm:flex-row">
              <Price class="text-argasso2-200 text-xl font-semibold" price={variant?.price} />
              <BuyButton size="lg" variantId={variant.id} />
            </div>
          {/if}
        </div>
      {/if} -->
      <div
        class="col-span-2 row-start-4 sm:col-span-1 sm:col-start-2 sm:row-start-4 lg:col-start-3 lg:row-span-4 lg:row-start-1"
      >
        <Card class="border-muted">
          <CardHeader>
            <CardTitle title="asdf" class="text-2xl font-normal">Studiematerial</CardTitle>
          </CardHeader>
          <CardContent>
            {#if html}
              <div>
                <p>{@html html}</p>
              </div>
            {/if}
            {#if elevFile}
              <DownloadButton text="Ladda ned Elevmaterial" file={elevFile} />
            {/if}
            {#if lararFile}
              <DownloadButton text="Ladda ned Lärarmaterial" file={lararFile} />
            {/if}
          </CardContent>
        </Card>
      </div>
    </div>
  </Section>
{/if}
