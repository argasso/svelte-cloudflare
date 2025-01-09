// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
  namespace App {
    interface Platform {
      env: {
        ARGASSO_FILES: R2Bucket
        TURNSTILE_SECRET_KEY: string
        TURNSTILE_SITE_KEY: string
      }
      cf: CfProperties
      ctx: ExecutionContext
      caches: CacheStorage & { default: Cache }
    }
    interface Error {
      message: string
      fields?: Record<string, any>
    }
    interface Locals {
      cartId: string | undefined
    }
  }
}

export {}
