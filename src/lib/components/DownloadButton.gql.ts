import { graphql, type FragmentOf } from '../../graphql'

export const genericFileFragment = graphql(`
  fragment GenericFileFragment on GenericFile @_unmask {
    id
    alt
    url
    mimeType
    originalFileSize
    previewImage {
      height
      width
      url
    }
  }
`)

export type TGenericFile = FragmentOf<typeof genericFileFragment>
