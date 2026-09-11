import { PAYLOAD_PUBLIC_URL } from '@/lib/cms/config'
import type {
  HeadingTag,
  VideoTeaserBlock,
  VideoTeaserDesign,
  VideoTeaserDefaults,
  VideoTeaserHeading,
  VideoTeaserImage,
  VideoTeaserSource,
  VideoTeaserYouTubeConsent,
} from '@/types/cms/page/blocks/video-teaser.types'

export const DEFAULT_VIDEO_TEASER_DEFAULTS: VideoTeaserDefaults = {
  headline: {
    tag: 'h2',
    color: '#FFFFFF',
    fontSize: 'clamp(1.8rem, 4.5vw, 4.4rem)',
  },
  subheadline: {
    tag: 'h3',
    color: '#E94E1D',
    fontSize: 'clamp(1.4rem, 3.2vw, 4rem)',
  },
  design: {
    overlayColor: 'rgba(0, 0, 0, 0.24)',
    playButtonBackgroundColor: 'rgba(63, 64, 66, 0.9)',
    playButtonTextColor: '#FFFFFF',
    playButtonRadius: '18px',
    lightboxBackdropColor: 'rgba(0, 0, 0, 0.8)',
    lightboxFrameColor: '#FFFFFF',
    lightboxFrameWidth: '2px',
    lightboxMaxWidth: '80rem',
    lightboxRadius: '14px',
  },
  youtube: {
    required: true,
    text: 'Zum Laden des YouTube-Videos wird eine Verbindung zu YouTube aufgebaut.',
    buttonLabel: 'Video laden',
  },
}
const HEADING_TAGS: readonly HeadingTag[] = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6']
const HEX_COLOR_PATTERN = /^#[0-9a-fA-F]{6}$/
const RGB_COLOR_PATTERN =
  /^rgba?\((?:\s*\d{1,3}%?\s*,){2}\s*\d{1,3}%?(?:\s*,\s*(?:0|1|0?\.\d+))?\s*\)$/
const CSS_LENGTH_PATTERN = /^(?:0|\d+(?:\.\d+)?(?:px|rem|em|vw|vh|%)|clamp\([^;{}<>]+\))$/

interface PayloadMedia {
  alt?: string | null
  mimeType?: string | null
  sourceType?: string | null
  url?: string | null
  youtubeUrl?: string | null
}

interface PayloadHeading {
  color?: string | null
  fontSize?: string | null
  tag?: string | null
  text?: string | null
}

interface PayloadVideoTeaserBlock {
  blockType: 'videoTeaser'
  design?: Partial<Record<keyof VideoTeaserDesign, string | null>> | null
  durationLabel?: string | null
  headline?: PayloadHeading | null
  id: string
  subheadline?: PayloadHeading | null
  teaserMedia?: PayloadMedia | number | null
  videoMedia?: PayloadMedia | number | null
  youtube?: {
    consentButtonLabel?: string | null
    consentRequired?: boolean | null
    consentText?: string | null
  } | null
}

function asText(value: unknown, fallback = ''): string {
  return typeof value === 'string' && value.trim() ? value.trim() : fallback
}

export function isValidVideoTeaserColor(value: string): boolean {
  return HEX_COLOR_PATTERN.test(value) || RGB_COLOR_PATTERN.test(value)
}

export function isValidVideoTeaserCssLength(value: string): boolean {
  return CSS_LENGTH_PATTERN.test(value)
}

function mapColor(value: unknown, fallback: string): string {
  const color = asText(value)
  return isValidVideoTeaserColor(color) ? color : fallback
}

function mapCssLength(value: unknown, fallback: string): string {
  const length = asText(value)
  return isValidVideoTeaserCssLength(length) ? length : fallback
}

function mapHeadingTag(value: unknown, fallback: HeadingTag): HeadingTag {
  return HEADING_TAGS.includes(value as HeadingTag) ? (value as HeadingTag) : fallback
}

function mapHeading(
  value: PayloadHeading | null | undefined,
  fallback: Pick<VideoTeaserHeading, 'color' | 'fontSize' | 'tag'>,
): VideoTeaserHeading {
  return {
    text: asText(value?.text),
    tag: mapHeadingTag(value?.tag, fallback.tag),
    color: mapColor(value?.color, fallback.color),
    fontSize: mapCssLength(value?.fontSize, fallback.fontSize),
  }
}

function toAbsoluteAssetUrl(url: string | null | undefined): string | null {
  const value = asText(url)
  if (!value) {
    return null
  }

  return value.startsWith('http') ? value : `${PAYLOAD_PUBLIC_URL}${value}`
}

function mapTeaserImage(value: PayloadVideoTeaserBlock['teaserMedia']): VideoTeaserImage | null {
  if (!value || typeof value !== 'object') {
    return null
  }

  if (!value.mimeType?.startsWith('image/')) {
    return null
  }

  const url = toAbsoluteAssetUrl(value.url)
  return url ? { url, alt: asText(value.alt, 'Video-Teaser') } : null
}

function extractYouTubeVideoId(value: string | null | undefined): string | null {
  if (!value) {
    return null
  }

  try {
    const url = new URL(value)
    const host = url.hostname.replace(/^www\./, '')
    if (host === 'youtu.be') {
      return url.pathname.split('/').filter(Boolean)[0] ?? null
    }
    if (host === 'youtube.com' || host === 'm.youtube.com') {
      if (url.pathname === '/watch') return url.searchParams.get('v')
      const [type, id] = url.pathname.split('/').filter(Boolean)
      return type === 'embed' || type === 'shorts' ? (id ?? null) : null
    }
  } catch {
    return null
  }

  return null
}

function mapVideoSource(value: PayloadVideoTeaserBlock['videoMedia']): VideoTeaserSource | null {
  if (!value || typeof value !== 'object') {
    return null
  }

  if (value.sourceType === 'youtube') {
    const videoId = extractYouTubeVideoId(value.youtubeUrl)
    return videoId
      ? {
          kind: 'youtube',
          embedUrl: `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1`,
        }
      : null
  }

  if (!value.mimeType?.startsWith('video/')) {
    return null
  }

  const url = toAbsoluteAssetUrl(value.url)
  return url ? { kind: 'upload', url, mimeType: value.mimeType } : null
}

function mapDesign(
  value: PayloadVideoTeaserBlock['design'],
  defaults: VideoTeaserDesign,
): VideoTeaserDesign {
  return {
    overlayColor: mapColor(value?.overlayColor, defaults.overlayColor),
    playButtonBackgroundColor: mapColor(
      value?.playButtonBackgroundColor,
      defaults.playButtonBackgroundColor,
    ),
    playButtonTextColor: mapColor(value?.playButtonTextColor, defaults.playButtonTextColor),
    playButtonRadius: mapCssLength(value?.playButtonRadius, defaults.playButtonRadius),
    lightboxBackdropColor: mapColor(value?.lightboxBackdropColor, defaults.lightboxBackdropColor),
    lightboxFrameColor: mapColor(value?.lightboxFrameColor, defaults.lightboxFrameColor),
    lightboxFrameWidth: mapCssLength(value?.lightboxFrameWidth, defaults.lightboxFrameWidth),
    lightboxMaxWidth: mapCssLength(value?.lightboxMaxWidth, defaults.lightboxMaxWidth),
    lightboxRadius: mapCssLength(value?.lightboxRadius, defaults.lightboxRadius),
  }
}

function mapYouTubeConsent(
  value: PayloadVideoTeaserBlock['youtube'],
  defaults: VideoTeaserYouTubeConsent,
): VideoTeaserYouTubeConsent {
  return {
    required: value?.consentRequired ?? defaults.required,
    text: asText(value?.consentText, defaults.text),
    buttonLabel: asText(value?.consentButtonLabel, defaults.buttonLabel),
  }
}

export function mapVideoTeaserBlock(
  block: PayloadVideoTeaserBlock,
  defaults: VideoTeaserDefaults = DEFAULT_VIDEO_TEASER_DEFAULTS,
): VideoTeaserBlock | null {
  const teaserImage = mapTeaserImage(block.teaserMedia)
  const video = mapVideoSource(block.videoMedia)
  if (!teaserImage || !video) {
    return null
  }

  return {
    id: block.id,
    blockType: 'videoTeaser',
    headline: mapHeading(block.headline, defaults.headline),
    subheadline: mapHeading(block.subheadline, defaults.subheadline),
    durationLabel: asText(block.durationLabel),
    teaserImage,
    video,
    design: mapDesign(block.design, defaults.design),
    youtubeConsent: mapYouTubeConsent(block.youtube, defaults.youtube),
  }
}

export type { PayloadVideoTeaserBlock }
