import { error } from '@sveltejs/kit'
import { AuthorsStore } from '$houdini'

export async function load(event) {
  const authorsStore = new AuthorsStore()
  const response = await authorsStore.fetch({ event })

  if (response.errors) {
    throw error(500, response.errors.map((e) => e.message).join(', '))
  }

  const authors = response?.data?.metaobjects.nodes ?? []

  return { authors }
}
