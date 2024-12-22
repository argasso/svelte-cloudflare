<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements'
  import { cn } from '$lib/utils'

  type $$Props = HTMLAttributes<HTMLDetailsElement> & {
    name: string
  }

  let className: $$Props['class'] = undefined
  export { className as class }
  export let name: $$Props['name']
</script>

<details
  {name}
  class="cursor-pointer p-1 transition-all [&_.left]:open:-rotate-45 [&_.right]:open:rotate-45"
>
  <summary
    class={cn(
      'flex flex-1 items-center justify-between rounded py-2 text-sm font-medium hover:underline focus-visible:ring',
      className,
    )}
  >
    <slot name="title"></slot>
    <div class="flex h-6 w-6">
      <div class="flex items-center overflow-hidden">
        <span
          class={cn([
            'h-0 w-3 border border-card-foreground bg-card-foreground transition-transform duration-200',
            'left translate-x-[3px] rotate-45 rounded-l-full',
          ])}
        ></span>
      </div>
      <div class="flex items-center overflow-hidden">
        <span
          class={cn([
            'h-0 w-3 border border-card-foreground bg-card-foreground transition-transform duration-200',
            'right -translate-x-[3px] -rotate-45 rounded-r-full',
          ])}
        ></span>
      </div>
    </div>
  </summary>
  <slot />
</details>

<style>
  details {
    overflow: hidden;
  }

  details * {
    margin: 0;
  }
  /* details {
    transition: grid-template-rows 150ms cubic-bezier(0.4, 0, 0.2, 1);
  } */

  /* slot[id='details-content']::slotted(*) {
    background: blue;
  } */

  details::details-content {
    block-size: 0;
    transition:
      block-size 150ms cubic-bezier(0.4, 0, 0.2, 1),
      content-visibility 150ms cubic-bezier(0.4, 0, 0.2, 1);
    transition-behavior: allow-discrete;
  }

  details[open]::details-content {
    block-size: auto;
  }

  /* .content {
    display: grid;
    grid-template-rows: 0fr;
    transition: grid-template-rows 150ms cubic-bezier(0.4, 0, 0.2, 1);
  }

  .content div {
    overflow: hidden;
    transition: all 150ms cubic-bezier(0.4, 0, 0.2, 1);
  } */

  /* details[open] + .content,
  .content:focus-within {
    grid-template-rows: 1fr;
  } */
</style>
