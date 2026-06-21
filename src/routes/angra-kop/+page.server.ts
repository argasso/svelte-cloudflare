import { error, fail } from '@sveltejs/kit'
import type { Actions, PageServerLoad } from './$types'

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export const load: PageServerLoad = async ({ platform }) => {
  return {
    TURNSTILE_SITE_KEY: platform?.env.TURNSTILE_SITE_KEY,
  }
}

export const actions = {
  default: async ({ request, platform }) => {
    if (!platform?.env.TURNSTILE_SECRET_KEY) {
      error(500, 'Serverfel: TURNSTILE_SECRET_KEY saknas')
    }
    if (!platform?.env.RESEND_API_KEY) {
      error(500, 'Serverfel: RESEND_API_KEY saknas')
    }

    const body = await request.formData()
    const token = body.get('cf-turnstile-response') as string | null

    if (!token) {
      return fail(400, { error: 'Robotverifiering saknas. Försök igen.' })
    }

    const turnstileForm = new FormData()
    turnstileForm.append('secret', platform.env.TURNSTILE_SECRET_KEY)
    turnstileForm.append('response', token)
    const ip = request.headers.get('CF-Connecting-IP')
    if (ip) turnstileForm.append('remoteip', ip)

    const turnstileRes = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: turnstileForm,
    })
    const outcome = (await turnstileRes.json()) as { success: boolean }

    if (!outcome.success) {
      return fail(400, { error: 'Robotverifiering misslyckades. Försök igen.' })
    }

    const fornamn = (body.get('fornamn') as string | null)?.trim() ?? ''
    const efternamn = (body.get('efternamn') as string | null)?.trim() ?? ''
    const email = (body.get('email') as string | null)?.trim() ?? ''
    const ordernummer = (body.get('ordernummer') as string | null)?.trim() ?? ''
    const varor = (body.get('varor') as string | null)?.trim() ?? ''
    const meddelande = (body.get('meddelande') as string | null)?.trim() ?? ''

    if (!fornamn || !efternamn || !email || !ordernummer || !varor) {
      return fail(400, { error: 'Fyll i alla obligatoriska fält.' })
    }

    const datum = new Date().toLocaleString('sv-SE', { timeZone: 'Europe/Stockholm' })

    const row = (label: string, value: string) =>
      `<tr>
        <td style="padding:8px 12px;font-weight:600;white-space:nowrap;border-bottom:1px solid #eee;vertical-align:top">${label}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #eee">${value}</td>
      </tr>`

    const preWrap = (text: string) =>
      `<pre style="margin:0;white-space:pre-wrap;font-family:inherit">${escapeHtml(text)}</pre>`

    const staffHtml = `
      <div style="font-family:sans-serif;max-width:600px">
        <h2 style="color:#1a1a1a">Ny ångerrättsanmälan</h2>
        <table style="border-collapse:collapse;width:100%;background:#f9f9f9">
          ${row('Datum', escapeHtml(datum))}
          ${row('Namn', escapeHtml(`${fornamn} ${efternamn}`))}
          ${row('E-post', `<a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a>`)}
          ${row('Ordernummer', escapeHtml(ordernummer))}
          ${row('Varor att returnera', preWrap(varor))}
          ${meddelande ? row('Meddelande', preWrap(meddelande)) : ''}
        </table>
      </div>`

    const confirmationHtml = `
      <div style="font-family:sans-serif;max-width:600px">
        <h2 style="color:#1a1a1a">Vi har tagit emot din ångerrätt</h2>
        <p>Hej ${escapeHtml(fornamn)},</p>
        <p>Vi bekräftar att vi mottagit din begäran om att frånträda ditt köpeavtal. Vi återkommer via e-post för att verifiera dina orderuppgifter och ge dig instruktioner för returfrakten.</p>
        <h3 style="color:#1a1a1a">Dina uppgifter</h3>
        <table style="border-collapse:collapse;width:100%;background:#f9f9f9">
          ${row('Datum för anmälan', escapeHtml(datum))}
          ${row('Ordernummer', escapeHtml(ordernummer))}
          ${row('Varor att returnera', preWrap(varor))}
          ${meddelande ? row('Meddelande', preWrap(meddelande)) : ''}
        </table>
        <p style="margin-top:24px;color:#555">Med vänliga hälsningar,<br><strong>Argasso</strong></p>
      </div>`

    const resendHeaders = {
      Authorization: `Bearer ${platform.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    }

    const [staffRes, customerRes] = await Promise.all([
      fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: resendHeaders,
        body: JSON.stringify({
          from: 'noreply@argasso.se',
          to: 'info@argasso.se',
          reply_to: email,
          subject: `Ångerrätt – Order ${ordernummer} – ${fornamn} ${efternamn}`,
          html: staffHtml,
        }),
      }),
      fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: resendHeaders,
        body: JSON.stringify({
          from: 'noreply@argasso.se',
          to: email,
          subject: 'Bekräftelse av ångerrätt – Argasso',
          html: confirmationHtml,
        }),
      }),
    ])

    if (!staffRes.ok || !customerRes.ok) {
      console.error('Resend error', {
        staff: { status: staffRes.status, body: await staffRes.text() },
        customer: { status: customerRes.status, body: await customerRes.text() },
      })
      return fail(500, {
        error:
          'Kunde inte skicka e-post. Försök igen eller kontakta oss direkt på info@argasso.se.',
      })
    }

    return { success: true }
  },
} satisfies Actions
