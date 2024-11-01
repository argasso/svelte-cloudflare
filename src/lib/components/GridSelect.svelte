<script lang="ts">
  import { isNonNil } from '$lib'
  import { cn } from '$lib/utils'
  import type { HTMLAttributes } from 'svelte/elements'

  interface $$Props extends HTMLAttributes<HTMLSelectElement> {
    name: string
    value: string | undefined
    options: (Option | string)[]
    suffix: string | undefined
    requestSubmit: () => void
  }

  type Option = { value: string; label: string }

  let className: $$Props['class'] = undefined
  export { className as class }
  export let name: $$Props['name']
  export let value: $$Props['value'] = undefined
  export let options: $$Props['options']
  export let suffix: $$Props['suffix'] = undefined
  export let requestSubmit: $$Props['requestSubmit']

  let opts: Option[]
  $: opts = options.map((o) =>
    typeof o === 'string' ? { value: o, label: optionalJoin(o, suffix) } : o,
  )
  // .map((o, i, arr) => (i === 0 && !arr.find((a) => a.value == '') ? { ...o, value: '' } : o))

  function optionalJoin(...values: (string | undefined)[]) {
    return values.filter(isNonNil).join(' ')
  }
  //   $: console.log(name, value, options)
</script>

<select
  class={cn(
    'block appearance-none rounded px-4 py-2 pr-8 text-sm leading-tight hover:border-gray-500 focus:outline-none focus:ring',
    className,
  )}
  {name}
  {value}
  on:change={requestSubmit}
>
  {#each opts as item}
    <option value={item.value} selected={item.value === value}>{item.label}</option>
  {/each}
</select>

<style>
  /* .custom-select {
      position: relative;
    }
  
    .custom-select select {
      appearance: none;
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
    } */
</style>
