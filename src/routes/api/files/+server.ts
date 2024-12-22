export async function GET(event) {
  const obj = await event.platform?.env.ARGASSO_FILES.list()

  if (obj == null) {
    return new Response('Not found', { status: 404 })
  }
  const keys = obj.objects.map((o) => o.key)
  console.log('Found keys', keys.length, keys)

  return new Response('Found keys: ' + keys)
}
