import { findMenuItem, getPathToItem } from '$lib/menu'

export const load = async (event) => {
  const { parent, url } = event
  const { menu } = await parent()
  const path = url.pathname.split('/').slice(0, -1).join('/')
  const crumbs = getPathToItem(findMenuItem(menu, url.pathname))

  return {
    crumbs,
  }
}
