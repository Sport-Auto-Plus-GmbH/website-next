export type HeadingTag = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'

export interface VideoTeaserHeading {
  text: string
  tag: HeadingTag
  color: string
  fontSize: string
}

export interface VideoTeaserImage {
  alt: string
  url: string
}

export type VideoTeaserSource =
  { kind: 'upload'; mimeType: string; url: string } | { embedUrl: string; kind: 'youtube' }

export interface VideoTeaserDesign {
  lightboxBackdropColor: string
  lightboxFrameColor: string
  lightboxFrameWidth: string
  lightboxMaxWidth: string
  lightboxRadius: string
  overlayColor: string
  playButtonBackgroundColor: string
  playButtonRadius: string
  playButtonTextColor: string
}

export interface VideoTeaserDefaults {
  design: VideoTeaserDesign
  headline: Omit<VideoTeaserHeading, 'text'>
  subheadline: Omit<VideoTeaserHeading, 'text'>
  youtube: VideoTeaserYouTubeConsent
}

export interface VideoTeaserYouTubeConsent {
  buttonLabel: string
  required: boolean
  text: string
}

export interface VideoTeaserBlock {
  blockType: 'videoTeaser'
  design: VideoTeaserDesign
  durationLabel: string
  headline: VideoTeaserHeading
  id: string
  subheadline: VideoTeaserHeading
  teaserImage: VideoTeaserImage
  video: VideoTeaserSource
  youtubeConsent: VideoTeaserYouTubeConsent
}
