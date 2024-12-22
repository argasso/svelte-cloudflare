<script lang="ts">
  import { page } from '$app/stores'
  export let href: string
  export let exact = false
  $: active =
    $page.url.pathname && href && exact
      ? $page.url.pathname === href
      : $page.url.pathname.includes(href)
</script>

<a
  {href}
  class:active
  class="mb-[2px] mt-[6px] flex border-b-4 border-transparent hover:border-white hover:border-opacity-70 hover:no-underline"
>
  <span class="my-auto">
    <slot />
  </span>
</a>

<style lang="postcss">
  a.active:not(:has(+ * + dialog:popover-open)) {
    @apply border-white;
  }

  a {
    position: relative;
  }

  a:not(:hover):after {
    opacity: 0;
    transform: translateY(10px);
    transition: all 300ms;
    transition-behavior: allow-discrete;
  }

  a:not(:hover):has(+ * + dialog:popover-open):after {
    content: '';
    width: 0;
    height: 0;
    border-left: 7px solid transparent;
    border-right: 7px solid transparent;
    border-bottom: 7px solid hsl(var(--muted));
    position: absolute;
    bottom: -6px;
    left: 50%;
    margin-left: -5px;

    opacity: 1;
    transform: translateY(0);
    @starting-style {
      opacity: 0;
      transform: translateY(10px);
    }
  }
</style>
