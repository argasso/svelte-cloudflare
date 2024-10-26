<script lang="ts">
  import { isNonNil } from '$lib'

  type Option = { value: string; label: string }

  let className = ''
  export { className as class }
  export let name: string
  export let value: string | undefined = undefined
  export let options: (Option | string)[]
  export let suffix: string | undefined = undefined
  export let placeholder: string | undefined = undefined
  export let label: string

  let opts: Option[]
  $: opts = options
    .map((o) => (typeof o === 'string' ? { value: o, label: optionalJoin(o, suffix) } : o))
    .map((o, i, arr) => (i === 0 && !arr.find((a) => a.value == '') ? { ...o, value: '' } : o))

  function optionalJoin(...values: (string | undefined)[]) {
    return values.filter(isNonNil).join(' ')
  }
  $: console.log(name, value, options)
</script>

<div class="custom-select">
  <select
    class="rounded-md border-2 border-input bg-transparent px-3 py-2 pr-8 text-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
    {name}
    {value}
  >
    {#each opts as item}
      <option value={item.value} selected={item.value === value}>{item.label}</option>
    {/each}
  </select>
</div>

<style>
  .custom-select {
    /* min-width: 80px; */
    position: relative;
    width: auto;
  }

  .custom-select select {
    appearance: none;
    /* width: 100%; */
    width: auto;

    /* padding: 0.675em 6em 0.675em 1em; */
    /* color: #000; */
    cursor: pointer;
  }
  .custom-select::before,
  .custom-select::after {
    --size: 0.3rem;
    position: absolute;
    content: '';
    right: 1rem;
    pointer-events: none;
  }

  .custom-select::before {
    border-left: var(--size) solid transparent;
    border-right: var(--size) solid transparent;
    border-bottom: var(--size) solid currentColor;
    top: 35%;
    opacity: 0.5;
  }

  .custom-select::after {
    border-left: var(--size) solid transparent;
    border-right: var(--size) solid transparent;
    border-top: var(--size) solid currentColor;
    top: 52%;
    opacity: 0.5;
  }
</style>
