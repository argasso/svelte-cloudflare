<script lang="ts" context="module">
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
          ...SeoFragment
        }
      }
    `,
    [menuFragment, heroFragment, sectionsFragment, seoFragment],
  )
</script>

<script lang="ts">
  import Hero2, { heroFragment } from '$lib/components/Hero.svelte'
  import { menuFragment } from '$lib/components/NavMenu.svelte'
  import Sections, { sectionsFragment } from '$lib/components/Sections.svelte'
  import { seoFragment } from '$lib/components/Seo.svelte'
  import Wave from '$lib/components/Wave.svelte'
  import { graphql } from '../graphql'

  export let data

  $: ({ page, menu } = data)
  $: title = page?.title?.value
  $: pageTop = page?.pageTop
</script>

<section class="gradient">
  <Hero2 {title} {pageTop} />
</section>
<Wave class="gradient" />
<Sections {page} {menu} />
