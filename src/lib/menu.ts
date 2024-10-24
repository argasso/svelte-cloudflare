import { isNonNil, isType } from '$lib'
import type { ResultOf } from '../graphql'
import type { mainMenuQuery } from './components/NavMenu.svelte'

type ShopifyMenuItem = ResultOf<typeof mainMenuQuery>['menu']

export type MenuItem = {
  id: string
  href: string
  name: string
  parent?: MenuItem
  children: MenuItem[]
}

export function makeMenu(
  menu: ShopifyMenuItem | undefined,
  parent?: MenuItem,
): MenuItem | undefined {
  if (menu) {
    const id = menu.id
    const name = menu.name?.value ?? menu.title?.value ?? menu.handle
    const href = parent ? `${parent.href === '/' ? '' : parent.href}/${menu.handle}` : '/'
    const item = { id, name, href, parent, children: [] as MenuItem[] }
    const children =
      menu?.children?.references?.nodes
        ?.filter(isType('Metaobject'))
        .map((child) => makeMenu(child as ShopifyMenuItem, item))
        .filter(isNonNil) ?? []
    item.children.push(...children)
    return item
  }
}

// export function makeMenu(menu: ShopifyMenuItem, parent?: MenuItem): MenuItem[] {
//   return onlyMetaobjects(menu?.children?.references?.nodes).map((child) => {
//     const id = child.id
//     const name = child.name?.value ?? child.title?.value ?? child.handle
//     const href = `${parent?.href ?? ''}/${child.handle}`
//     const children = [] as MenuItem[]
//     const item = { id, name, href, parent, children }
//     item.children.push(...makeMenu(child as ShopifyMenuItem, item))
//     return item
//   })
// }

export function findMenuItem(menu: MenuItem | undefined, path: string): MenuItem | undefined {
  if (menu) {
    if (menu.href === path) {
      return menu
    }
    for (const item of menu.children) {
      const match = findMenuItem(item, path)
      if (match) {
        return match
      }
    }
  }
}

export function getPathToItem(item: MenuItem | undefined): MenuItem[] {
  if (item?.parent) {
    return [...getPathToItem(item.parent), item]
  }
  return item ? [item] : []
}

export function flatten(item: MenuItem | undefined): MenuItem[] {
  if (item?.children && item.children.length > 0) {
    return [item, ...item.children.flatMap((c) => flatten(c))]
  }
  return item ? [item] : []
}
