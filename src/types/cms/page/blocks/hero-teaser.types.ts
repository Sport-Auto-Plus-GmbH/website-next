// FontSize/StyledText are heroTeaser-only for now (its 3 fields share the shape). Move
// them to a shared location once a second block needs the same "editable text with
// size + color" shape — don't redefine it there, reuse this one.
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
