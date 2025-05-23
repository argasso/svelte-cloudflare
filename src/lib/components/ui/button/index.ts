import { type VariantProps, tv } from 'tailwind-variants'
import type { Button as ButtonPrimitive } from 'bits-ui'
import Root from './button.svelte'

const buttonVariants = tv({
  base: 'gap-2 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
  variants: {
    variant: {
      default: 'bg-primary text-primary-foreground shadow hover:bg-primary/90',
      destructive: 'bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90',
      outline:
        'border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground',
      secondary: 'bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80',
      ghost: 'hover:bg-accent hover:text-accent-foreground',
      header: 'bg-transparent hover:bg-white/10 hover:text-white',
      link: 'text-primary underline-offset-4 hover:underline',
      buy: 'bg-primary/70 text-primary-foreground shadow rounded-full p-2 text-xs',
    },
    size: {
      default: 'h-9 px-4 py-2',
      sm: 'h-8 rounded-md px-3 text-xs gap-1',
      lg: 'h-12 rounded-full px-8 text-lg gap-3',
      icon: 'h-9 w-9',
      iconSm: 'h-9 w-7',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
  },
})

type Variant = VariantProps<typeof buttonVariants>['variant']
type Size = VariantProps<typeof buttonVariants>['size']

type Props = ButtonPrimitive.Props & {
  variant?: Variant
  size?: Size
}

type Events = ButtonPrimitive.Events

export {
  Root,
  type Props,
  type Events,
  //
  Root as Button,
  type Props as ButtonProps,
  type Events as ButtonEvents,
  buttonVariants,
}
