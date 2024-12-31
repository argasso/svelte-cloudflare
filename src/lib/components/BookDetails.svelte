<script lang="ts">
  import * as Card from '$lib/components/ui/card'
  import Pill from './Pill.svelte'
  import ReadingLevel from './ReadingLevel.svelte'

  type DetailsItem = {
    key: string
    label: string
    value:
      | {
          text: string
          href?: string | undefined
        }[]
      | undefined
  }

  export let details: DetailsItem[] = []
</script>

<Card.Root>
  <!-- <Card.Header>
		<Card.Title>Detaljer</Card.Title>
	</Card.Header> -->
  <Card.Content class="p-0">
    <dl>
      {#each details as item, index}
        <div class:odd={index % 2 === 0} class="grid grid-cols-3 gap-4 p-6 py-2">
          <dt class="overflow-hidden text-ellipsis text-sm font-medium">
            {item.label}
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
  .odd {
    background-color: hsl(var(--background) / 50%);
  }
</style>
