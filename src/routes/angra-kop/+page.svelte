<script lang="ts">
  import { enhance } from '$app/forms'
  import { Turnstile } from 'svelte-turnstile'
  import Button from '$lib/components/Button.svelte'
  import Section from '$lib/components/Section.svelte'
  import CircleAlert from 'lucide-svelte/icons/circle-alert'
  import CircleCheck from 'lucide-svelte/icons/circle-check'

  export let data
  export let form

  $: siteKey = data.TURNSTILE_SITE_KEY ?? '1x00000000000000000000AA'
</script>

<svelte:head>
  <title>Ångra köp – Argasso</title>
  <meta
    name="description"
    content="Ångra ditt köp hos Argasso. Fyll i formuläret för att utöva din ångerrätt inom 14 dagar."
  />
</svelte:head>

<Section title="Ångra köp" level={1}>
  <div class="max-w-2xl">
    <p class="text-muted-foreground">
      Enligt EU:s konsumentdirektiv har du rätt att ångra ditt köp inom 14 dagar från det att du
      mottog varan, utan att ange något skäl. Fyll i formuläret nedan för att påbörja din
      returprocess.
    </p>

    {#if form?.success}
      <div
        class="mt-6 flex items-start gap-3 rounded-lg border border-green-200 bg-green-50 p-4 text-green-800 dark:border-green-800 dark:bg-green-950 dark:text-green-200"
      >
        <CircleCheck class="mt-0.5 h-5 w-5 shrink-0" />
        <div>
          <p class="font-medium">Ångerrätt registrerad</p>
          <p class="mt-1 text-sm">
            En bekräftelse har skickats till din e-postadress. Vi återkommer med instruktioner för
            returfrakten.
          </p>
        </div>
      </div>
    {:else}
      {#if form?.error}
        <div
          class="mt-6 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-200"
        >
          <CircleAlert class="mt-0.5 h-5 w-5 shrink-0" />
          <p>{form.error}</p>
        </div>
      {/if}

      <form method="POST" use:enhance class="mt-8 grid grid-cols-1 gap-6">
        <div class="grid grid-cols-2 gap-4">
          <label class="block">
            <span class="mb-1 block text-sm font-medium"
              >Förnamn <span class="text-red-500">*</span></span
            >
            <input
              type="text"
              name="fornamn"
              required
              autocomplete="given-name"
              class="block w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </label>
          <label class="block">
            <span class="mb-1 block text-sm font-medium"
              >Efternamn <span class="text-red-500">*</span></span
            >
            <input
              type="text"
              name="efternamn"
              required
              autocomplete="family-name"
              class="block w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </label>
        </div>

        <label class="block">
          <span class="mb-1 block text-sm font-medium"
            >E-postadress <span class="text-red-500">*</span></span
          >
          <input
            type="email"
            name="email"
            required
            autocomplete="email"
            placeholder="namn@exempel.se"
            class="block w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </label>

        <label class="block">
          <span class="mb-1 block text-sm font-medium"
            >Ordernummer <span class="text-red-500">*</span></span
          >
          <input
            type="text"
            name="ordernummer"
            required
            placeholder="t.ex. #1001"
            class="block w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <p class="mt-1 text-xs text-muted-foreground">
            Ordernumret hittar du i orderbekräftelsen du fick via e-post.
          </p>
        </label>

        <label class="block">
          <span class="mb-1 block text-sm font-medium"
            >Varor att returnera <span class="text-red-500">*</span></span
          >
          <textarea
            name="varor"
            required
            rows={4}
            placeholder="Ange titel och antal för varje vara du vill returnera"
            class="block w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          ></textarea>
        </label>

        <label class="block">
          <span class="mb-1 block text-sm font-medium"
            >Meddelande <span class="font-normal text-muted-foreground">(valfritt)</span></span
          >
          <textarea
            name="meddelande"
            rows={3}
            placeholder="Övrig information du vill förmedla"
            class="block w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          ></textarea>
        </label>

        <div>
          <span class="mb-1 block text-sm font-medium">Verifiera att du inte är en robot</span>
          <Turnstile {siteKey} theme="auto" language="sv" />
          <noscript>
            <div class="mt-2 flex items-center gap-2 rounded-lg bg-secondary p-3 text-sm">
              <CircleAlert class="h-4 w-4 shrink-0" />
              <span>Javascript måste vara aktiverat för att skicka formuläret.</span>
            </div>
          </noscript>
        </div>

        <div>
          <Button type="submit" size="lg">Bekräfta ångerrätt</Button>
          <p class="mt-3 max-w-prose text-xs text-muted-foreground">
            Genom att klicka på "Bekräfta ångerrätt" förklarar du att du frånträder ditt
            köpeavtal. En automatisk bekräftelse skickas till din e-post direkt efter inskickning.
            Vi återkommer via e-post för att verifiera dina orderuppgifter och ge dig instruktioner
            för returfrakten.
          </p>
        </div>
      </form>
    {/if}
  </div>
</Section>
