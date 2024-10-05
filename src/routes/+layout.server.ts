import { MainMenuStore } from '$houdini'

export async function load(event) {
  const store = new MainMenuStore()
  const MainMenu = await store.fetch({ event })
  return { MainMenu: MainMenu.data?.menu }
}
