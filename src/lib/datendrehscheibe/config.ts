/**
 * Base URL of the Datendrehscheibe's HTTP API. Server-only — never exposed to the
 * client bundle, since every request happens in Server Components, Server Actions,
 * or Route Handlers (see .ai/backend/DATENDREHSCHEIBE_CLIENT.md).
 */
export const DATENDREHSCHEIBE_API_URL =
  process.env.DATENDREHSCHEIBE_API_URL || 'http://localhost:8080'
