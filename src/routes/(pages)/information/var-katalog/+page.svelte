<script>
  // import Button from '$lib/components/Button.svelte'
  // import Section from '$lib/components/Section.svelte'
  // import { Turnstile } from 'svelte-turnstile'
  // import { mode } from 'mode-watcher'
  // import { enhance } from '$app/forms'
  // import CircleAlert from 'lucide-svelte/icons/circle-alert'

  // export let data

  // $: siteKey = data.TURNSTILE_SITE_KEY ?? '2x00000000000000000000AB' // Default value is blocking

  // let disabled = true

  // function activate() {
  //   disabled = false
  // }
</script>

<!-- <Section title="Beställ katalog" level={2} class="bg-card">
  <form class="mt-8 max-w-md text-sm" name="katalog" method="POST" use:enhance>
    <div class="grid grid-cols-1 gap-6">
      <label class="block">
        <span>Beställt antal kataloger</span>
        <input type="text" name="antal" class="mt-1 block w-full rounded-md" placeholder="" />
      </label>
      <label class="block">
        <span>Namn</span>
        <input
          type="text"
          name="namn"
          class="mt-1 block w-full rounded-md"
          placeholder="Ange för- och efternamn"
        />
      </label>
      <label class="block">
        <span>Adress</span>
        <input type="text" name="adress1" class="mt-1 block w-full rounded-md" placeholder="" />
      </label>
      <label class="block">
        <span>Adress 2</span>
        <input type="text" name="adress2" class="mt-1 block w-full rounded-md" placeholder="" />
      </label>
      <div class="flex gap-5">
        <label class="block">
          <span>Postnummer</span>
          <input
            type="text"
            name="postnummer"
            class="mt-1 block w-full rounded-md"
            placeholder=""
          />
        </label>
        <label class="block">
          <span>Ort</span>
          <input type="text" name="postort" class="mt-1 block w-full rounded-md" placeholder="" />
        </label>
      </div>
      <label class="block">
        <span>E-postadress</span>
        <input
          type="email"
          name="epostadress"
          class="mt-1 block w-full rounded-md"
          placeholder="namn@exempel.se"
        />
      </label>

      <div class="block">
        <span>Verifiera att du inte är en robot</span>
        <Turnstile {siteKey} on:callback={activate} theme={$mode} />
        <noscript>
          <div
            class="mb-4 flex items-center rounded-lg bg-secondary p-4 text-sm text-argasso-800"
            role="alert"
          >
            <CircleAlert />
            <span class="sr-only">Info</span>
            <div>Javascript är inte aktiverat. Detta behövs för att kunna beställa katalogen.</div>
          </div>
        </noscript>
      </div>

      <p>
        <Button size="lg" type="submit" {disabled}>Beställ</Button>
      </p>
    </div>
  </form>
</Section> -->
