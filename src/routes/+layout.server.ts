import { MainMenuStore } from '$houdini'
import { makeMenu } from '$lib/menu.js'
import { error } from '@sveltejs/kit'

export async function load(event) {
  const store = new MainMenuStore()
  const response = await store.fetch({ event })

  if (response.errors) {
    console.error('MainMenuStore fetch failed', response.errors.map((e) => e.message).join(', '))
    throw error(500, 'Oj, någonting gick snett när vi försökte ladda sidan')
  }

  const mainMenu = makeMenu(response.data?.menu)

  return { mainMenu }
}
