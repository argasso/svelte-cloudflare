<script lang="ts" context="module">
  import { type VariantProps, tv } from 'tailwind-variants'

  const buttonVariants = tv({
    base: 'hover:no-underline gap-2 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring disabled:pointer-events-none disabled:opacity-50',
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground shadow hover:bg-primary/90',
        destructive: 'bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90',
        outline:
          'border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground',
        secondary: 'bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground border-transparent',
        header: 'bg-transparent hover:bg-white/10 hover:text-white border-transparent',
        link: 'text-primary underline-offset-4 hover:underline',
        buy: 'bg-primary/70 text-primary-foreground shadow rounded-full p-2 text-xs',
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-8 rounded-md px-3 text-xs gap-1',
        lg: 'h-12 rounded-full px-8 text-lg gap-3',
        icon: 'h-9 w-9 p-1',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  })

  export type Variant = VariantProps<typeof buttonVariants>['variant']
  export type Size = VariantProps<typeof buttonVariants>['size']
  interface ButtonProps extends HTMLButtonAttributes {
    variant?: Variant
    size?: Size
    href?: string | null | undefined
  }
  interface AnchorProps extends HTMLAnchorAttributes {
    variant?: Variant
    size?: Size
    href: string
  }
</script>

<script lang="ts">
  import { cn } from '$lib/utils.js'
  import type { HTMLAnchorAttributes, HTMLButtonAttributes } from 'svelte/elements'

  type $$Props = ButtonProps | AnchorProps

  let className: $$Props['class'] = undefined
  export let variant: $$Props['variant'] = 'default'
  export let size: $$Props['size'] = 'default'
  export let href: $$Props['href'] = undefined
  export { className as class }
</script>

{#if href}
  <a class={cn(buttonVariants({ variant, size, className }))} {href} {...$$restProps}>
    <slot />
  </a>
{:else}
  <button
    class={cn(buttonVariants({ variant, size, className }))}
    type="button"
    {...$$restProps}
    on:click
    on:keydown
  >
    <slot />
  </button>
{/if}
