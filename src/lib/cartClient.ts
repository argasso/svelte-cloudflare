import { toast } from 'svelte-sonner'
import type { SubmitFunction } from '../routes/(default)/cart/$types'
import { applyAction } from '$app/forms'
import { goto, invalidateAll } from '$app/navigation'
import { cart } from './stores/cartStore'

const position = 'top-right'

export const cartSubmitFunction: SubmitFunction = () => {
  return async ({ result }) => {
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
