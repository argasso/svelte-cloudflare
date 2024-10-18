<script lang="ts">
  import { enhance } from '$app/forms'
  import { cartSubmitFunction } from '$lib/cartService'
  import Icons from './Icons.svelte'
  import { Button } from './ui/button'

  export let variantId: string

  let loading = false
</script>

<form
  method="POST"
  action="/cart?/cartAdd"
  use:enhance={cartSubmitFunction}
  class="col-start-1 row-start-1 -mb-3 -mr-4 self-end justify-self-end"
>
  <Button
    type="submit"
    name="variantId"
    value={variantId}
    aria-label="Lägg i varukorg"
    variant="buy"
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
</form>
