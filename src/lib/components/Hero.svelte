<script lang="ts">
  import { getByType, isType } from '$lib'
  import Button from './Button.svelte'
  import type { THeroFragment } from './Hero.gql'

  export let title: string | null = 'Upplev böcker från Argasso bokförlag'
  export let intro: string = 'Lättare att läsa för barn och ungdomar'
  export let pageTop: THeroFragment['pageTop'] | null | undefined

  $: titleParts = title?.split('Argasso') ?? []
  $: slides = getByType('Metaobject', pageTop?.reference)?.slides?.references?.nodes.filter(
    isType('Metaobject'),
  )
</script>

<div class="text-white">
  <div class="container flex flex-col flex-wrap items-center md:flex-row">
    <div
      class="flex w-full flex-col items-center justify-center text-center md:items-start md:pr-10"
    >
      <h1 class="text-center font-sans text-3xl font-semibold text-white md:text-left md:text-5xl">
        {#each titleParts as part, index}
          {#if index > 0}
            <span class="bg-gradient-to-r from-pink-300 to-violet-300 bg-clip-text text-transparent"
              >Argasso</span
            >
          {/if}
          {part}
        {/each}
      </h1>
      <h2 class="my-3 font-serif text-xl font-normal italic text-red-100">{intro}</h2>
      <Button
        href="/bocker"
        size="lg"
        class="hover my-4 mb-0 bg-red-50 text-gray-800 hover:bg-white hover:text-black hover:no-underline"
        >Se alla våra böcker</Button
      >
    </div>
    {#if slides && slides.length > 0}
      <div class="my-4 w-full md:my-0 md:w-2/5">
        <!-- <Carousel.Root
          opts={{
            align: 'start',
          }}
          class="w-full"
        >
          <Carousel.Content>
            {#each slides as slide}
              <Carousel.Item class="">
                <div class="p-1">
                  <Card.Root class="gradient2 border-none text-white mix-blend-multiply">
                    <Card.Content class="flex items-start justify-stretch gap-8 p-6">
                      <BookStack books={slide}></BookStack>
                      <div class="flex flex-1 flex-col">
                        <h3 class="mb-4 mt-0 font-sans font-semibold">{slide?.title?.value}</h3>
                        {#if slide?.text?.value}
                          <div class="flex-0 text-sm text-red-200">
                            {@html convertSchemaToHtml(JSON.parse(slide.text.value))}
                          </div>
                        {/if}
                        <div class="flex-1 items-end">
                          <Button>Läs mer</Button>
                        </div>
                      </div>
                    </Card.Content>
                  </Card.Root>
                </div>
              </Carousel.Item>
            {/each}
          </Carousel.Content>
          <Carousel.Previous class="hidden bg-primary text-white md:flex" />
          <Carousel.Next class="hidden bg-primary text-white md:flex" />
        </Carousel.Root> -->
      </div>
    {/if}
  </div>
</div>
