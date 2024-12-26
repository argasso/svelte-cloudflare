import { json } from '@sveltejs/kit'

export type FileInfoType = Pick<
  R2Object,
  'key' | 'size' | 'uploaded' | 'checksums' | 'httpMetadata'
>

export async function GET(event) {
  const obj = await event.platform?.env.ARGASSO_FILES.get(event.params.handle)

  if (obj == null) {
    return new Response('Not found', { status: 404 })
  }

  const { key, size, uploaded, checksums, httpMetadata } = obj

  return json(
    { key, size, uploaded, checksums, httpMetadata },
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  )
}
