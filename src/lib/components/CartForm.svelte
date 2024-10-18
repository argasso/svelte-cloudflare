<script lang="ts">
  import { enhance } from '$app/forms'
  import type { Cart$result } from '$houdini'
  import { cartSubmitFunction, cartUpdateAction } from '$lib/cartService'
  import Cart from './icons/Cart.svelte'
  import Minus from './icons/Minus.svelte'
  import Plus from './icons/Plus.svelte'
  import Trash from './icons/Trash.svelte'
  import BookImage from './image/BookImage.svelte'
  import Price from './Price.svelte'
  import { Button } from './ui/button'

  export let cart: Cart$result['cart']
  export let showTotal = false

  $: items = cart?.lines.edges ?? []
</script>

{#if cart && items.length > 0}
  {#each items as item, i (i)}
    {#if i > 0}
      <hr />
    {/if}

    <div class="flex w-full gap-4 py-3">
      <div class="self-start">
        <BookImage width={64} image={item.node.merchandise.product.images.edges[0]?.node} />
      </div>
      <div class="flex flex-1 flex-col justify-between py-2">
        <div class="flex-1">
          <h3 class="m-0 text-base font-semibold">
            {item.node.merchandise.product.title}
          </h3>
          {#if item.node.merchandise.title !== 'Default Title'}
            <p class="m-0 text-sm">{item.node.merchandise.title}</p>
          {/if}
        </div>
        <form
          name={item.node.id}
          method="POST"
          action={cartUpdateAction}
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
              <Price class="m-0" price={item.node.cost.totalAmount}></Price>
            </div>
          </div>
        </form>
      </div>
    </div>
  {/each}
  {#if showTotal}
    <hr />
    <div class="my-4 flex flex-row justify-between px-8 text-right">
      <h2 class="m-0 text-base">Delsumma inkl. moms</h2>
      <Price price={cart?.cost.totalAmount} />
    </div>
    <p class="mx-8 text-xs italic">
      Fraktkostnad beräknas i nästa steg. Alltid gratis frakt över 600 kr.
    </p>
  {/if}
{:else}
  <div class="mt-20 flex w-full flex-col items-center justify-center overflow-hidden">
    <div
      class="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-4xl text-gray-500"
    >
      <Cart />
    </div>
    <h3 class="mt-6 text-center text-2xl">Varukorgen är tom.</h3>
  </div>
{/if}
