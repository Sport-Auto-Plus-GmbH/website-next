// The minimal shape every Payload block shares before its blockType is known — see
// lib/cms/page/blocks/index.ts's block-mapper registry.
export interface RawBlock {
  id: string
  blockType: string
}
