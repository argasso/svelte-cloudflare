<script lang="ts">
  import * as Card from '$lib/components/ui/card'
  import Pill from './Pill.svelte'
  import ReadingLevel from './ReadingLevel.svelte'
  import type { HTMLAttributes } from 'svelte/elements'

  type DetailsItem = {
    key: string
    label:
      | string
      | {
          text: string
          href?: string | undefined
        }
    value:
      | {
          text: string
          href?: string | undefined
        }[]
      | undefined
  }
  interface $$Props extends HTMLAttributes<HTMLDivElement> {
    details: DetailsItem[]
    title: string | undefined
  }

  let className: $$Props['class'] = undefined
  export { className as class }

  export let details: $$Props['details']
  export let title: $$Props['title']
</script>

<Card.Root class={className} {...$$restProps}>
  {#if title}
    <Card.Header class="overflow-hidden rounded-t-lg bg-accent py-1 ">
      <Card.Title class="my-2">{title}</Card.Title>
    </Card.Header>
  {/if}
  <Card.Content class="p-0">
    <dl>
      {#each details as item, index}
        <div class:even={index % 2 !== 0} class="grid grid-cols-3 gap-4 p-6 py-2">
          <dt class="overflow-hidden text-ellipsis text-sm font-medium">
            {#if typeof item.label === 'string'}
              {item.label}
            {:else}
              <a href={item.label.href}>{item.label.text}</a>
            {/if}
          </dt>
          <dd class="col-span-2 text-sm">
            {#if item.value}
              {#each item.value as { text, href }}
                {#if item.key === 'reading_level'}
                  <ReadingLevel level={parseInt(text)} />
                {:else if href}
                  <Pill {href} name={text} />
                {:else}
                  {text}
                {/if}
              {/each}
            {/if}
          </dd>
        </div>
      {/each}
    </dl>
  </Card.Content>
</Card.Root>

<style lang="postcss">
  .even {
    background-color: hsl(var(--accent) / 30%);
  }
</style>
