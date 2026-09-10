import createClient from 'openapi-fetch'

import { DATENDREHSCHEIBE_API_URL } from '@/lib/datendrehscheibe/config'
// Generated from openapi/datendrehscheibe/api-vehicles-v1.0.yaml — regenerate with
// `pnpm generate:datendrehscheibe-types` after updating the vendored spec. When a
// second domain (e.g. checkout) is vendored, merge its `paths` type in here too.
import type { paths } from '@/lib/datendrehscheibe/generated/vehicles'

/**
 * Typed HTTP client for the Datendrehscheibe. The only thing in this project allowed
 * to build a request against its API — everything else goes through
 * `lib/datendrehscheibe/<domain>/` functions that use this client.
 */
export const datendrehscheibeClient = createClient<paths>({
  baseUrl: DATENDREHSCHEIBE_API_URL,
  // Resolve globalThis.fetch at call time rather than once at client creation —
  // otherwise tests stubbing global fetch after this module loads would have no
  // effect, since openapi-fetch captures its `fetch` option eagerly by default.
  fetch: (input) => globalThis.fetch(input),
})
