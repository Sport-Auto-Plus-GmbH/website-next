/**
 * Base URL of the payload-next CMS's REST API. Server-only — never exposed to the
 * client bundle, since every fetch against it happens in Server Components, Server
 * Actions, or Route Handlers (see .ai/backend/CMS_CLIENT.md).
 */
export const PAYLOAD_API_URL = process.env.PAYLOAD_API_URL || 'http://localhost:3000'

/**
 * Same origin as PAYLOAD_API_URL, but public: Live Preview's useLivePreview hook runs
 * client-side (components/landing/page-renderer/) and needs it to verify the postMessage
 * it receives actually came from Payload's admin panel.
 */
export const PAYLOAD_PUBLIC_URL = process.env.NEXT_PUBLIC_PAYLOAD_API_URL || 'http://localhost:3000'
