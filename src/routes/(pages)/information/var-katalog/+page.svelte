<script>
  import Button from '$lib/components/Button.svelte'
  import Section from '$lib/components/Section.svelte'
  import { Turnstile } from 'svelte-turnstile'
  import { mode } from 'mode-watcher'
  import { enhance } from '$app/forms'

  export let data
  export let form

  let disabled = true

  function activate() {
    disabled = false
  }
</script>

{#if form?.success}
  <noscript>
    <div
      id="alert-additional-content-5"
      class="rounded-lg border border-gray-300 bg-gray-50 p-4 dark:border-gray-600 dark:bg-gray-800"
      role="alert"
    >
      <div class="flex items-center">
        <svg
          class="me-2 h-4 w-4 flex-shrink-0 dark:text-gray-300"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"
          />
        </svg>
        <span class="sr-only">Info</span>
        <h3 class="text-lg font-medium text-gray-800 dark:text-gray-300">{form.message}</h3>
      </div>
      <div class="mb-4 mt-2 flex text-sm text-gray-800 dark:text-gray-300">
        <p>Mera text asdf asdf adsf</p>
      </div>
      <div class="flex">
        <button
          type="button"
          class="me-2 inline-flex items-center rounded-lg bg-gray-700 px-3 py-1.5 text-center text-xs font-medium text-white hover:bg-gray-800 focus:outline-none focus:ring-4 focus:ring-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 dark:focus:ring-gray-800"
        >
          <svg
            class="me-2 h-3 w-3 dark:text-gray-300"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 14"
          >
            <path
              d="M10 0C4.612 0 0 5.336 0 7c0 1.742 3.546 7 10 7 6.454 0 10-5.258 10-7 0-1.664-4.612-7-10-7Zm0 10a3 3 0 1 1 0-6 3 3 0 0 1 0 6Z"
            />
          </svg>
          View more
        </button>
        <button
          type="button"
          class="rounded-lg border border-gray-700 bg-transparent px-3 py-1.5 text-center text-xs font-medium text-gray-800 hover:bg-gray-800 hover:text-white focus:outline-none focus:ring-4 focus:ring-gray-300 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white dark:focus:ring-gray-800"
          data-dismiss-target="#alert-additional-content-5"
          aria-label="Close"
        >
          Dismiss
        </button>
      </div>
    </div>
  </noscript>
{/if}

<Section title="Beställ katalog" level={2} class="bg-card pb-20">
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
        <Turnstile siteKey="0x4AAAAAAA4AVzp7D1Cwe4K-" on:callback={activate} theme={$mode} />
      </div>

      <p>
        <Button size="lg" type="submit" {disabled}>Beställ</Button>
      </p>
    </div>
  </form>
</Section>
