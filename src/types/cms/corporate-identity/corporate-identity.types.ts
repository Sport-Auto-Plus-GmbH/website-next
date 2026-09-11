export interface CorporateIdentityColors {
  primary: string
  secondary: string
  destructive: string
}

export interface CorporateIdentity {
  colors: CorporateIdentityColors
  logoUrl: string
  videoTeaser: VideoTeaserDefaults
}
import type { VideoTeaserDefaults } from '@/types/cms/page/blocks/video-teaser.types'
