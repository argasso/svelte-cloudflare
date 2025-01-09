export const load = async ({ platform }) => {
  const TURNSTILE_SITE_KEY = platform?.env.TURNSTILE_SITE_KEY
  return { TURNSTILE_SITE_KEY }
}

import { error } from '@sveltejs/kit'
import type { Actions } from './$types'

export const actions = {
  default: async ({ request, platform }) => {
    if (!platform?.env.TURNSTILE_SECRET_KEY) {
      error(500, 'No TURNSTILE_SECRET_KEY set')
    }

    const body = await request.formData()
    // Turnstile injects a token in "cf-turnstile-response".
    const token = body.get('cf-turnstile-response')
    const ip = request.headers.get('CF-Connecting-IP')

    if (!token) {
      error(400, 'Missing token (cf-turnstile-response)')
    }
    // if (!ip) {
    //   error(400, 'Missing IP (CF-Connecting-IP)')
    // }

    // Validate the token by calling the
    // "/siteverify" API endpoint.
    let formData = new FormData()
    formData.append('secret', platform.env.TURNSTILE_SECRET_KEY)
    formData.append('response', token)
    formData.append('remoteip', ip ?? '')

    const url = 'https://challenges.cloudflare.com/turnstile/v0/siteverify'
    const result = await fetch(url, {
      body: formData,
      method: 'POST',
    })

    const outcome = (await result.json()) as any
    console.log('Turnstile response', { outcome })

    if (outcome && outcome.success) {
      console.log('TODO: send email')
      return { success: true, message: 'Tack! Beställning av katalogen är mottagen.' }
    }
    return {
      sucess: false,
      message:
        'Tyvärr, beställningen kunde inte slutföras. Vi kan inte verifiera att du inte är en robot.',
    }
  },
} satisfies Actions
