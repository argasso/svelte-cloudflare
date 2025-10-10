<script lang="ts">
  import { isType } from '$lib'
  import type { MenuItem } from '$lib/menu'
  import BookCardPromo from '../BookCardPromo.svelte'
  import Section from './Section.svelte'
  import type { TSektionBokgalleri } from './SektionBokgalleri.gql'

  let className = ''
  export { className as class }
  export let section: TSektionBokgalleri
  export let menu: MenuItem | undefined

  $: variants = section.varianter?.references?.nodes.filter(isType('ProductVariant'))
</script>

<Section title={section.rubrik?.value || ''} level={2} class={className}>
  <div class="flex flex-col justify-stretch lg:flex-row">
    {#each variants ?? [] as variant, index}
      {#if index > 0}
        <div class="hidden self-stretch px-8 md:flex">
          <hr class="vertical" />
        </div>
      {/if}
      <div class="mb-5 flex-1 md:mb-0">
        <BookCardPromo {variant} {menu} />
      </div>
    {/each}
  </div>
  <!-- <Carousel.Root
    opts={{
      align: 'start',
    }}
    class="w-full"
  >
    <Carousel.Content>
      {#each $data.bocker?.references?.nodes ?? [] as book}
        <Carousel.Item class="md:basis-1/2 lg:basis-1/3">
          <div class="p-1">
            <Card.Root>
              <Card.Content class="flex aspect-square items-center justify-center p-6">
                <BookCardPromo {book} />
              </Card.Content>
            </Card.Root>
          </div>
        </Carousel.Item>
      {/each}
    </Carousel.Content>
    <Carousel.Previous />
    <Carousel.Next />
  </Carousel.Root> -->
</Section>
