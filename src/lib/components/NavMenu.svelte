<script lang="ts" context="module">
  export const menuFragment = graphql(`
    fragment MenuFragment on Metaobject @_unmask {
      id
      handle
      title: field(key: "title") {
        value
      }
      name: field(key: "name") {
        value
      }
    }
  `)

  export const mainMenuQuery = graphql(
    `
      query MainMenu {
        menu: metaobject(handle: { handle: "startsida", type: "page" }) {
          ...MenuFragment
          children: field(key: "sub_pages") {
            references(first: 10) {
              nodes {
                ... on Metaobject {
                  ...MenuFragment
                  children: field(key: "sub_pages") {
                    references(first: 10) {
                      nodes {
                        ... on Metaobject {
                          ...MenuFragment
                          children: field(key: "sub_pages") {
                            references(first: 10) {
                              nodes {
                                ... on Metaobject {
                                  ...MenuFragment
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    `,
    [menuFragment],
  )
</script>

<script lang="ts">
  import type { MenuItem } from '$lib/menu'
  import { graphql } from '../../graphql'
  import NavMenuItem from './NavMenuItem.svelte'

  let className = ''
  export { className as class }
  export let menu: MenuItem

  $: menuItems = menu?.children ?? []
  $: rootItem = { ...menu, children: [] }
</script>

<ul class="list-none pl-0 {className}">
  <div class="border-b border-border">
    <NavMenuItem menuItem={rootItem} />
    {#each menuItems as menuItem}
      <NavMenuItem {menuItem} />
    {/each}
  </div>
</ul>
