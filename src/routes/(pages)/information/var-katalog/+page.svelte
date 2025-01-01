<script>
  import Button from '$lib/components/Button.svelte'
  import Section from '$lib/components/Section.svelte'
  import { Turnstile } from 'svelte-turnstile'
  import { mode } from 'mode-watcher'

  let disabled = true

  function activate() {
    disabled = false
  }
</script>

<Section title="Beställ katalog" level={2} class="bg-card pb-20">
  <form class="mt-8 max-w-md text-sm" name="katalog" method="POST" data-netlify="true">
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
        <Turnstile siteKey="0x4AAAAAAA4AVzp7D1Cwe4K-" on:callback={activate} theme={$mode} />
      </div>

      <p>
        <Button size="lg" type="submit" {disabled}>Beställ</Button>
      </p>
    </div>
  </form>
</Section>
