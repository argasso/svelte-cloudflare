<script lang="ts">
  import { onMount } from 'svelte'
  import {
    getCurrentConsent,
    setTrackingConsentForHeadless,
    shouldShowBanner,
  } from '$lib/shopify/customerPrivacy'

  type BannerState = 'idle' | 'loading' | 'ready' | 'saving' | 'saved' | 'error'

  let visible = false
  let state: BannerState = 'idle'
  let errorMessage: string | null = null

  // Toggleable consent categories
  let marketing = false
  let analytics = false
  let preferences = false
  let saleOfData = false // false means "opt OUT" when we save it as sale_of_data: false

  onMount(async () => {
    state = 'loading'
    try {
      const show = await shouldShowBanner()

      // Even if shouldShowBanner() is false, you might still want to show a
      // "Manage preferences" UI somewhere else – in that case, ignore `show`
      visible = true

      if (visible) {
        // Initialize from current consent, so user can adjust rather than start from scratch
        const raw = await getCurrentConsent()
        console.log('current concent', raw)

        marketing = raw.marketing === 'yes'
        analytics = raw.analytics === 'yes'
        preferences = raw.preferences === 'yes'
        // For sale_of_data: 'no' means opt-out, which corresponds to false in our UI.
        saleOfData = raw.sale_of_data === 'yes'
      }

      state = 'ready'
    } catch (err) {
      console.error(err)
      state = 'error'
      errorMessage = (err as Error).message
      visible = false
    }
  })

  async function acceptAll() {
    await saveConsent({
      marketing: true,
      analytics: true,
      preferences: true,
      sale_of_data: true,
    })
  }

  async function rejectAll() {
    // Example: disallow all non-essential purposes.
    await saveConsent({
      marketing: false,
      analytics: false,
      preferences: false,
      // sale_of_data: false => explicit opt-out of data sale/sharing
      sale_of_data: false,
    })
  }

  async function saveCustom() {
    await saveConsent({
      marketing,
      analytics,
      preferences,
      sale_of_data: saleOfData,
    })
  }

  async function saveConsent(consent: {
    marketing: boolean
    analytics: boolean
    preferences: boolean
    sale_of_data: boolean
  }) {
    state = 'saving'
    errorMessage = null

    try {
      await setTrackingConsentForHeadless(consent)
      state = 'saved'
      visible = false
    } catch (err) {
      console.error(err)
      state = 'error'
      errorMessage = (err as Error).message
    }
  }
</script>

{#if visible}
  <div class="cookie-banner text-xs" data-state={state}>
    <div class=" container">
      <h2>Preferenser för Cookies</h2>
      <p>
        We use cookies to personalize content, provide social media features, and analyze traffic.
        Manage your preferences below.
      </p>

      <form class="cookie-banner__form" on:submit|preventDefault={saveCustom}>
        <label>
          <input type="checkbox" bind:checked={preferences} />
          <span>Preferences (e.g. language, currency)</span>
        </label>
        <label>
          <input type="checkbox" bind:checked={analytics} />
          <span>Analytics (understand how our site is used)</span>
        </label>
        <label>
          <input type="checkbox" bind:checked={marketing} />
          <span>Marketing &amp; advertising</span>
        </label>
        <label>
          <input type="checkbox" bind:checked={saleOfData} />
          <span> Allow sale / sharing of data (uncheck to opt out where applicable) </span>
        </label>

        {#if errorMessage}
          <p class="cookie-banner__error">
            {errorMessage}
          </p>
        {/if}

        <div class="cookie-banner__actions">
          <button
            type="button"
            class="btn btn-secondary"
            disabled={state === 'saving'}
            on:click|preventDefault={rejectAll}
          >
            Reject all
          </button>

          <button
            type="button"
            class="btn btn-outline"
            disabled={state === 'saving'}
            on:click|preventDefault={acceptAll}
          >
            Accept all
          </button>

          <button type="submit" class="btn btn-primary" disabled={state === 'saving'}>
            {state === 'saving' ? 'Saving…' : 'Save preferences'}
          </button>
        </div>
      </form>
    </div>
  </div>
{/if}

<style>
  .cookie-banner {
    position: fixed;
    inset-inline: 0;
    bottom: 0;
    z-index: 1000;
    background: rgba(0, 0, 0, 0.85);
    color: #fff;
    padding: 1.5rem;
    display: flex;
    justify-content: center;
  }

  .cookie-banner__content {
    max-width: 48rem;
    width: 100%;
    background: #111;
    border-radius: 0.5rem;
    padding: 1.5rem;
  }

  .cookie-banner__form fieldset {
    border: none;
    margin: 0.75rem 0;
  }

  .cookie-banner__form label {
    display: flex;
    gap: 0.5rem;
    align-items: center;
    font-size: 0.95rem;
  }

  .cookie-banner__actions {
    margin-top: 1.5rem;
    display: flex;
    gap: 0.75rem;
    justify-content: flex-end;
    flex-wrap: wrap;
  }

  .btn {
    border-radius: 999px;
    padding: 0.5rem 1rem;
    cursor: pointer;
    border: 1px solid transparent;
    font-size: 0.9rem;
  }

  .btn-primary {
    background: #fff;
    color: #000;
  }

  .btn-secondary {
    background: #333;
    color: #fff;
  }

  .btn-outline {
    background: transparent;
    color: #fff;
    border-color: #fff;
  }

  .btn:disabled {
    opacity: 0.6;
    cursor: default;
  }

  .cookie-banner__error {
    margin-top: 0.75rem;
    color: #ffb3b3;
    font-size: 0.85rem;
  }
</style>
