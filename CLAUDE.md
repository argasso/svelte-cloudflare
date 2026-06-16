# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # start dev server
npm run build        # production build
npm run preview      # build + run locally via wrangler pages dev
npm run check        # TypeScript + Svelte type check
npm run lint         # prettier --check + eslint
npm run format       # prettier --write
npm run deploy       # build + wrangler pages deploy
npm run cf-typegen   # regenerate Cloudflare worker types → src/worker-configuration.d.ts
npm run tada-generate # regenerate Shopify GraphQL schema introspection from live API
```

There are no automated tests.

## Architecture

This is a **SvelteKit storefront for Argasso** (Swedish educational book publisher) deployed to **Cloudflare Pages**, pulling content from **Shopify Storefront API** via GraphQL.

### Key layers

**GraphQL / Shopify client** (`src/client.ts`, `src/graphql.ts`)
- `src/client.ts` exports a urql `Client` configured with the Shopify Storefront API endpoint and access token.
- `src/graphql.ts` exports the `graphql` tagged template function from `gql.tada`, initialized with the Shopify schema introspection. All GraphQL fragments and queries use this function for full type safety.
- Every component that needs data defines its GraphQL fragment in a co-located `.gql.ts` file (e.g., `BookCard.svelte` + `BookCard.gql.ts`).

**Navigation / Menu** (`src/lib/menu.ts`)
- The site navigation is built from Shopify Metaobjects (a recursive tree). `makeMenu()` converts the Shopify response into a typed `MenuItem` tree. URL paths are derived from the menu hierarchy.
- Loaded once in the root `+layout.server.ts` and passed through `parent()` to child load functions.

**CMS pages** (`src/routes/(pages)/`)
- The catch-all route `(pages)/[...path]` resolves any URL by looking up the last path segment as a Shopify page `handle`.
- Pages have a `sections` metafield (list of Metaobject references). `Sections.svelte` dispatches on `section.type` (e.g., `sektion_bokgalleri`, `section_download`, `studiematerial`) to render the right section component.
- Section data can be decorated server-side before passing to the client (e.g., `section_download` nodes have their file info resolved from R2 via `/api/files/[handle]/info`).

**Cart** (`src/lib/cartService.ts`, `src/routes/cart/`)
- Cart ID is stored as a `cartId` cookie, read in `hooks.server.ts` and placed in `event.locals`.
- All cart mutations (create, add lines, update lines) go through the Shopify Storefront API. Cart expires after 6 days of inactivity.
- Cart add/update are form actions at `/cart?/cartAdd` and `/cart?/cartUpdate`.

**Cloudflare bindings** (`src/app.d.ts`, `wrangler.toml`)
- `ARGASSO_FILES` — R2 bucket for downloadable files, served via `/api/files/[handle]`
- `TURNSTILE_SECRET_KEY` / `TURNSTILE_SITE_KEY` — Cloudflare Turnstile for form spam protection

**UI components**
- `src/lib/components/ui/` — shadcn-style primitives built on `bits-ui`
- `src/lib/components/` — domain components (book cards, filters, cart, navigation)
- Styling: Tailwind CSS with `tailwind-variants` and `tailwind-merge` (`cn()` helper in `src/lib/utils.ts`)
- Icons: `lucide-svelte`

### Conventions
- All user-visible text and error messages are in **Swedish**.
- Type guards `isType<T>()` and `getByType<T>()` from `$lib` narrow Shopify union types (e.g., `MetafieldReference`).
- Fragment types are exported from `.gql.ts` files as `TComponentName` (e.g., `TSectionComponent`).
- The `(pages)` and `(shopify)` route groups share a layout but keep policy pages (privacy, terms) separate from CMS-driven pages.
