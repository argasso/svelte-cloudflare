// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
  namespace App {
    interface Platform {
      env: Env
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
