export type FontSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl'

export interface StyledText {
  text: string
  fontSize: FontSize
  color: string
}

export interface HeroTeaserBlock {
  id: string
  blockType: 'heroTeaser'
  headline: StyledText
  subheadline: StyledText
  description: StyledText
}

export type PageBlock = HeroTeaserBlock

export interface Page {
  id: number
  title: string
  slug: string
  blocks: PageBlock[]
}
