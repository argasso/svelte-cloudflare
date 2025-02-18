export async function GET(event) {
  const obj = await event.platform?.env.ARGASSO_FILES.get(event.params.handle)

  if (obj == null) {
    return new Response('Not found', { status: 404 })
  }

  return new Response(obj.body)
}
