<script lang="ts">
  import Sun from '$lib/components/icons/Sun.svelte'
  import Moon from '$lib/components/icons/Moon.svelte'
  import { toggleMode } from 'mode-watcher'
  import Button from './Button.svelte'
</script>

<Button on:click={toggleMode} size="icon" variant="header" class="text-white hover:bg-white/10">
  <Sun class="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
  <Moon class="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
  <span class="sr-only">Ändra tema</span>
</Button>
