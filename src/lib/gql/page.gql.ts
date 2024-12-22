import { heroFragment } from '$lib/components/Hero.gql'
import { menuFragment } from '$lib/components/NavMenu.gql'
import { sectionsFragment } from '$lib/components/Sections.gql'
import { metaobjecSeoFragment } from '$lib/components/Seo.graphql'
import { graphql } from '../../graphql'

export const pageQuery = graphql(
  `
    query Page($handle: String!) {
      page: metaobject(handle: { handle: $handle, type: "page" }) {
        ...MenuFragment
        content: field(key: "content") {
          value
        }
        children: field(key: "sub_pages") {
          references(first: 10) {
            nodes {
              ... on Metaobject {
                ...MenuFragment
              }
            }
          }
        }
        ...HeroFragment
        ...SectionsFragment
        ...MetaobjectSeoFragment
      }
    }
  `,
  [menuFragment, heroFragment, sectionsFragment, metaobjecSeoFragment],
)
