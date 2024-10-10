<script lang="ts">
  import { graphql, type SektionBokgalleri$data } from '$houdini'
  import { onlyProduct, onlyProducts } from '$lib'
  import type { MenuItem } from '$lib/menu'
  import BookCardPromo from '../BookCardPromo.svelte'
  import Section from './Section.svelte'

  let className = ''
  export { className as class }
  export let section: SektionBokgalleri$data
  export let menu: MenuItem | undefined

  graphql(`
    fragment SektionBokgalleri on Metaobject {
      id
      rubrik: field(key: "rubrik") {
        value
      }
      visa: field(key: "visa_antal") {
        value
      }
      bocker: field(key: "bocker") {
        references(first: 10) {
          nodes {
            ...BookPromo
          }
        }
      }
    }
  `)
</script>

<Section title={section.rubrik?.value || ''} level={2} class={className}>
  <div class="flex flex-col justify-stretch md:flex-row">
    {#each onlyProducts(section.bocker?.references?.nodes) ?? [] as book, index}
      {#if index > 0}
        <div class="hidden self-stretch px-8 md:flex">
          <!-- <Separator orientation="vertical" /> -->
        </div>
      {/if}
      <div class="mb-5 flex-1 md:mb-0">
        <BookCardPromo {book} {menu} />
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
