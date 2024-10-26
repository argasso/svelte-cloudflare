<script lang="ts">
  import ChevronLeft from 'lucide-svelte/icons/chevron-left'
  import type { FragmentOf } from '../../graphql'
  import type { pageInfoFragment } from './ProductsGrid.svelte'
  import ChevronRight from 'lucide-svelte/icons/chevron-right'
  import Button from './Button.svelte'
  import { page } from '$app/stores'

  export let pageInfo: FragmentOf<typeof pageInfoFragment>['pageInfo']
</script>

<Button
  type="submit"
  name="before"
  value={pageInfo.startCursor}
  variant="ghost"
  class="gap-1 pl-2.5 font-normal"
  disabled={!pageInfo.hasPreviousPage}
>
  <ChevronLeft class="h-4 w-4" />
  <span>Föregående</span>
</Button>

<Button
  type="submit"
  name="after"
  value={pageInfo.endCursor}
  variant="ghost"
  class="gap-1 pr-2.5  font-normal"
  disabled={!pageInfo.hasNextPage}
>
  <span>Nästa</span>
  <ChevronRight class="h-4 w-4" />
</Button>
