import { graphql, type FragmentOf } from '../../graphql'
import { sectionComponentFragment } from './section/SectionComponent.gql'
import { sectionDownloadFragment } from './section/SectionDownload.gql'
import { sectionNewsFragment } from './section/SectionNews.gql'
import { sektionBokgalleri } from './section/SektionBokgalleri.gql'
import { sektionStudiematerial } from './section/SektionStudiematerial.gql'

export const sectionsFragment = graphql(
  `
    fragment SectionsFragment on Metaobject @_unmask {
      sections: field(key: "sektioner") {
        references(first: 100) {
          nodes {
            ... on Metaobject {
              type
            }
            ...SektionBokgalleri
            ...SectionNewsFragment
            ...SectionDownloadFragment
            ...SectionComponentFragment
            ...SektionStudiematerial
          }
        }
      }
    }
  `,
  [
    sektionBokgalleri,
    sectionNewsFragment,
    sectionDownloadFragment,
    sectionComponentFragment,
    sektionStudiematerial,
  ],
)

export type TSectionsFragment = FragmentOf<typeof sectionsFragment>
