<script lang="ts">
  import { browser } from '$app/environment'
  import Cart from 'lucide-svelte/icons/shopping-cart'
  import { cart } from '$lib/stores/cartStore'
  import Button from './Button.svelte'

  $: items = $cart?.lines.edges ?? []
  $: quantity = $cart?.totalQuantity ?? 0
  $: cartHref = browser ? '' : '/cart'

  // async function checkout() {
  //   let checkoutUrl = localStorage.getItem('cartUrl')
  //   window.open(parseJSON(checkoutUrl), '_blank')
  // }
</script>

<Button
  aria-label="Varukorg"
  href="/cart"
  variant="header"
  size="icon"
  class="relative inline-flex text-white hover:bg-white/10"
>
  {#if quantity > 0}
    <div
      class="absolute -end-1 -top-1 inline-flex h-5 w-5 items-center justify-center rounded-full border-2 border-[#9e003e] bg-white text-xs font-bold text-[#9e003e]"
    >
      {quantity}
    </div>
  {/if}
  <div class="flex h-full items-center">
    <Cart />
  </div>
</Button>

<!-- <Drawer.Root shouldScaleBackground={false} direction="right" bind:open={$cartOpen}>
  <Drawer.Trigger asChild let:builder>
    <Button
      href={cartHref}
      builders={[builder]}
      variant="header"
      size="icon"
      class="relative flex-none text-white"
    >
      {#if quantity > 0}
        <div
          class="absolute -right-1 -top-1 min-w-5 rounded-full border-2 border-[#9e003e] bg-white px-1 text-xs text-primary"
        >
          {quantity}
        </div>
        <Icons type="cart-heart" />
      {:else}
        <Cart class="" />
      {/if}
    </Button>
  </Drawer.Trigger>
  <Drawer.Content direction="right">
    <div class="flex h-full flex-col">
      {#if cart && items.length > 0}
        <Drawer.Header class="flex-0 h-14 flex-shrink-0 items-center border-b p-0 sm:text-center">
          <h2 class="m-0 text-lg font-semibold">{$cart?.totalQuantity} böcker i varukorgen</h2>
        </Drawer.Header>
        <ScrollArea class="flex-0 min-h-0 border-b">
          <div class="p-8 py-3">
            <CartForm cart={$cart} />
          </div>
        </ScrollArea>
        <div class="my-4 flex flex-row justify-between px-8 text-right">
          <h2 class="m-0 text-base">Delsumma inkl. moms</h2>
          <Price price={$cart?.cost.totalAmount} />
        </div>
        <p class="mx-8 text-xs italic">
          Fraktkostnad beräknas i nästa steg. Alltid gratis frakt över 600 kr.
        </p>
        <Drawer.Footer class="flex grow p-10 py-6">
          <Drawer.Close asChild let:builder>
            <Button class="" builders={[builder]} variant="outline" size="lg"
              >Fortsätt handla</Button
            >
          </Drawer.Close>
          <Button class="" on:click={() => {}} target="_self" size="lg">
            <span> Till betalning </span>
            <Icons type="cart-checkout" class="ml-3" />
          </Button>
        </Drawer.Footer>
      {:else}
        <div class="mt-20 flex w-full flex-col items-center justify-center overflow-hidden">
          <div
            class="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-4xl text-gray-500"
          >
            <Icons type="cart" />
          </div>
          <h3 class="mt-6 text-center text-2xl">Varukorgen är tom.</h3>
        </div>
      {/if}
    </div>
  </Drawer.Content>
</Drawer.Root> -->
