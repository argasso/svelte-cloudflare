<script lang="ts">
  import { applyAction, enhance } from '$app/forms'
  import { cartSubmitFunction } from '$lib/cartClient'
  import type { SubmitFunction } from '@sveltejs/kit'
  import type { Size } from './Button.svelte'
  import Icons from './Icons.svelte'
  import { Button } from './ui/button'
  import { goto, invalidateAll } from '$app/navigation'
  import { cart } from '$lib/stores/cartStore'
  import { toast } from 'svelte-sonner'

  export let variantId: string
  export let size: Size = undefined

  const variant = 'buy'
  let loading = false

  const position = 'top-right'
  export const submitFunction: SubmitFunction = async (input) => {
    loading = true
    return async ({ result }) => {
      loading = false
      if (result.type === 'redirect') {
        goto(result.location)
      } else if (result.type === 'success') {
        invalidateAll()
        await applyAction(result)
        cart.set(result.data?.cart)
        const message = result.data?.message ?? 'Uppdaterade varukorgen'
        const description = result.data?.merchandise?.product.title ?? ''
        toast.success(message, { position, description })
      } else if (result.type === 'failure') {
        const description = 'Kunde inte uppdatera varukorgen.'
        toast.error('Oj', { position, description })
      }
    }
  }
</script>

<form
  method="POST"
  action="/cart?/cartAdd"
  use:enhance={submitFunction}
  class="col-start-1 row-start-1 -mb-3 -mr-4 self-end justify-self-end"
>
  {#if size}
    <Button
      type="submit"
      name="variantId"
      value={variantId}
      aria-label="Lägg i varukorg"
      variant="default"
      {size}
      class="items-center"
    >
      <div class="flex-1 whitespace-nowrap px-2">Lägg i varukorg</div>
      {#if loading}
        <Icons class="flex-0 h-5 w-5" type="loading" />
      {:else}
        <Icons class="flex-0 h-5 w-5" type="cart-add" />
      {/if}
    </Button>
  {:else}
    <Button
      type="submit"
      name="variantId"
      value={variantId}
      aria-label="Lägg i varukorg"
      {variant}
      size="icon"
      class="group items-center hover:w-auto hover:bg-primary focus:w-auto focus:bg-primary"
    >
      <div class="hidden flex-1 whitespace-nowrap px-2 group-hover:block group-focus:block">
        Lägg i varukorg
      </div>
      {#if loading}
        <Icons class="flex-0 h-5 w-5" type="loading" />
      {:else}
        <Icons class="flex-0 h-5 w-5" type="cart-add" />
      {/if}
    </Button>
  {/if}
</form>
