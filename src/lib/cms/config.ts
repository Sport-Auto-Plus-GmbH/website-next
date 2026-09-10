/**
 * Base URL of the payload-next CMS's REST API. Server-only — never exposed to the
 * client bundle, since every fetch against it happens in Server Components, Server
 * Actions, or Route Handlers (see .ai/backend/CMS_CLIENT.md).
 */
export const PAYLOAD_API_URL = process.env.PAYLOAD_API_URL || 'http://localhost:3000'
