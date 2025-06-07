import { graphql } from '../../graphql'

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
      informationMenu: metaobject(handle: { handle: "information", type: "page" }) {
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
  `,
  [menuFragment],
)
