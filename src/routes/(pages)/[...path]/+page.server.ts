import { error } from '@sveltejs/kit'

export const load = async ({ parent }) => {
  const { page } = await parent()

  if (!page) {
    error(404, 'Kan inte hitta sidan')
  }
  return {
    page,
  }
}
