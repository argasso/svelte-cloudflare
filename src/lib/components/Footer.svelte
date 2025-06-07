<script lang="ts">
  import Logo from '$lib/components/logo/Logo.svelte'
  import type { MenuItem } from '$lib/menu'
  import Button from './Button.svelte'
  import Wave from './Wave.svelte'

  export let informationMenu: MenuItem | undefined
</script>

<Wave class="gradient-inverted" inversed />
<footer class="gradient text-gray-100">
  <div class="container">
    <div class="order-first flex flex-wrap text-center md:text-left">
      <nav class="mb-10 w-full md:w-1/2 lg:w-1/4">
        <h3 class="mb-3">Kontaktuppgifter</h3>
        <ul class="list-none p-0">
          <li class="mb-2">
            Villagatan 34
            <br />
            891 37 Örnsköldsvik
          </li>
          <li class="mb-2">0660 - 27 36 40</li>
          <li class="mb-2">info@argasso.se</li>
        </ul>
      </nav>
      {#if informationMenu}
        <nav class="mb-10 w-full md:w-1/2 lg:w-1/4">
          <h3 class="mb-3">{informationMenu.name}</h3>
          <ul class="list-none p-0">
            {#each informationMenu.children as { href, name }}
              <li class="mb-2">
                <a {href} class="mb-2">{name}</a>
              </li>
            {/each}
          </ul>
        </nav>
      {/if}
      <nav class="mb-10 w-full md:w-1/2 lg:w-1/4">
        <h3 class="mb-3">Villkor</h3>
        <ul class="list-none p-0">
          <li class="mb-2">
            <a href="/forsaljningsvillkor" class="mb-2">Försäljnings- och leveransvilkor</a>
          </li>
          <li class="mb-2">
            <a href="/integritetspolicy" class="mb-2">Integritetspolicy</a>
          </li>
        </ul>
      </nav>
      <div class="mb-10 w-full md:w-1/2 lg:w-1/4">
        <h3 class="mb-3"><label for="mce-EMAIL">Nyhetsbrev</label></h3>
        <div
          class="flex flex-wrap items-end justify-center md:flex-nowrap md:justify-start lg:flex-wrap xl:flex-nowrap"
        >
          <div class="relative mr-2 sm:mr-4 sm:w-auto lg:mr-0 xl:mr-4">
            <form
              id="mc-embedded-subscribe-form"
              action="https://argasso.us18.list-manage.com/subscribe/post?u=77df9b40f7b88d80d2730b6bb&amp;id=b391a49e94"
              method="post"
              name="mc-embedded-subscribe-form"
              target="_blank"
              class="flex w-full max-w-sm items-center space-x-2"
            >
              <input
                id="mce-EMAIL"
                name="EMAIL"
                type="email"
                placeholder="Din e-postadress"
                class="bg-white text-black"
              />
              <Button
                id="mc-embedded-subscribe"
                name="subscribe"
                type="submit"
                class="drop-shadow-md">Prenumerera</Button
              >
            </form>
          </div>
        </div>
      </div>
      <div class="w-full border-t border-red-300 text-gray-100 opacity-75">
        <div class="flex items-center">
          <a
            href="/"
            class="title-font flex items-center justify-center font-medium md:justify-start"
          >
            <Logo class="h-16 w-32" />
          </a>
          <div class="mt-4 text-sm sm:ml-6 sm:mt-0">
            © 2020 Argasso —
            <a
              href="https://twitter.com/ArgassoBok"
              rel="noopener noreferrer"
              class="ml-1"
              target="_blank"
            >
              @ArgassoBok
            </a>
          </div>
          <span class="mt-4 inline-flex justify-center sm:ml-auto sm:mt-0 sm:justify-start">
            <a
              href="https://www.facebook.com/ArgassoBok"
              aria-label="Read more about Argasso on Facebook"
              class="ml-3"
            >
              <svg
                fill="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-Width="2"
                class="h-5 w-5"
                viewBox="0 0 24 24"
              >
                <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
              </svg>
            </a>
            <a
              href="https://instagram.com/ArgassoBok"
              aria-label="Read more about Argasso on Instagram"
              class="ml-3"
            >
              <svg
                fill="none"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                class="h-5 w-5"
                viewBox="0 0 24 24"
              >
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zm1.5-4.87h.01" />
              </svg>
            </a>
          </span>
        </div>
      </div>
    </div>
  </div>
</footer>
