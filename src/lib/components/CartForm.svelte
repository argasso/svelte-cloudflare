<script lang="ts">
  import { enhance } from '$app/forms'
  import { bookUrl } from '$lib'
  import { cartSubmitFunction } from '$lib/cartClient'
  import type { cartFragment } from '$lib/cartService'
  import type { FragmentOf } from '../../graphql'
  import Authors from './Authors.svelte'
  import Icons from './Icons.svelte'
  import Cart from 'lucide-svelte/icons/shopping-cart'
  import Minus from './icons/Minus.svelte'
  import Plus from './icons/Plus.svelte'
  import Trash from './icons/Trash.svelte'
  import BookImage from './image/BookImage.svelte'
  import Price from './Price.svelte'
  import { Button } from './ui/button'

  export let cart: FragmentOf<typeof cartFragment>
  export let showTotal = false

  $: items = cart?.lines.edges ?? []
</script>

{#if cart && items.length > 0}
  <div class="max-w-xl">
    {#each items as item, i (i)}
      {#if i > 0}
        <hr />
      {/if}

      <div class="flex w-full gap-4 py-5">
        <div class="self-start">
          <a href={bookUrl(item.node.merchandise.product.handle, item.node.merchandise.sku)}>
            <BookImage width={64} image={item.node.merchandise.product.images.edges[0]?.node} />
          </a>
        </div>
        <div class="flex flex-1 flex-col justify-between">
          <div class="flex-1">
            <Authors book={item.node.merchandise.product}></Authors>
            <h3 class="m-0 font-sans text-base font-semibold">
              <a
                class="text-foreground"
                href={bookUrl(item.node.merchandise.product.handle, item.node.merchandise.sku)}
              >
                {item.node.merchandise.product.title}
              </a>
              <span class="text-xs font-normal text-muted-foreground"
                >- {item.node.merchandise.binding?.value}, {item.node.merchandise.barcode}
              </span>
            </h3>

            {#if item.node.merchandise.title !== 'Default Title'}
              <p class="m-0 text-sm">{item.node.merchandise.title}</p>
            {/if}
          </div>
          <form
            name={item.node.id}
            method="POST"
            action={'/cart?/cartUpdate'}
            use:enhance={cartSubmitFunction}
          >
            <div class="flex-0 flex items-center gap-2">
              <input type="hidden" name="variantId" value={item.node.merchandise.id} />
              <input type="hidden" name="lineId" value={item.node.id} />
              <div class="flex items-stretch">
                <Button
                  type="submit"
                  size="icon"
                  variant="outline"
                  name="quantity"
                  value={Math.max(item.node.quantity - 1, 0)}
                  class="h-8 w-8 rounded-r-none shadow-none"
                >
                  <Minus class="h-5 w-5" />
                </Button>
                <div class="flex min-w-14 items-center border-y border-input px-3 text-sm">
                  {item.node.quantity} st
                </div>
                <Button
                  type="submit"
                  size="icon"
                  variant="outline"
                  name="quantity"
                  value={item.node.quantity + 1}
                  class="h-8 w-8 rounded-l-none shadow-none"
                >
                  <Plus class="h-5 w-5" />
                </Button>
              </div>
              <Button
                type="submit"
                size="icon"
                variant="ghost"
                name="quantity"
                value="0"
                class="h-8 w-8"
              >
                <Trash class="h-5 w-5" />
              </Button>
              <div class="ml-auto">
                <Price class="m-0 font-bold" price={item.node.cost.totalAmount}></Price>
              </div>
            </div>
          </form>
        </div>
      </div>
    {/each}
    {#if showTotal}
      <hr />
      <div class="my-4 flex flex-row justify-between text-right">
        <h2 class="m-0 text-base">Delsumma inkl. moms</h2>
        <Price class="font-bold" price={cart?.cost.totalAmount} />
      </div>
      <p class="text-xs italic">
        Fraktkostnad beräknas i nästa steg. Alltid gratis frakt över 600 kr.
      </p>
    {/if}
    <div class="flex flex-col justify-end gap-3 py-10 sm:flex-row">
      <Button
        on:click={() => {
          window.history.back()
        }}
        variant="outline"
        size="lg">Fortsätt handla</Button
      >
      <Button href={cart.checkoutUrl} target="_self" size="lg">
        <span> Till betalning </span>
        <Icons type="cart-checkout" class="ml-3" />
      </Button>
    </div>
  </div>
{:else}
  <div class="my-10 flex w-full flex-col items-center justify-center overflow-hidden">
    <Cart size="80" class="text-primary opacity-40" />
    <h2 class="my-6 text-center text-3xl">Din varukorg är tom.</h2>
    <p class="mx-auto w-80 text-center text-muted-foreground">
      Det finns inga böcker i din varukorg. Hitta din nästa favorit bland alla våra böcker.
    </p>
    <Button href="/bocker" size="lg" class="my-6 bg-primary text-white hover:no-underline"
      >Se alla våra böcker</Button
    >
  </div>
{/if}
