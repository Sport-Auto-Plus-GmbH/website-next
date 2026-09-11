// Shared by every block field that offers editors "editable text with size + color" —
// first introduced for heroTeaser, reused by vehicleListing's heading/subheading.
export type FontSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl'

export interface StyledText {
  text: string
  fontSize: FontSize
  color: string
}
