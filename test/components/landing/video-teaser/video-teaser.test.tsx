import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'

import { VideoTeaser } from '@/components/landing/video-teaser/video-teaser'

beforeEach(() => {
  HTMLDialogElement.prototype.showModal = function showModal() {
    this.setAttribute('open', '')
  }
  HTMLDialogElement.prototype.close = function close() {
    this.removeAttribute('open')
  }
})

const props = {
  headline: { text: 'Unser Video', tag: 'h2' as const, color: '#FFFFFF', fontSize: '2rem' },
  subheadline: { text: 'Jetzt ansehen', tag: 'h3' as const, color: '#E94E1D', fontSize: '1.5rem' },
  durationLabel: '00:30',
  teaserImage: { url: 'https://cdn.example.com/teaser.webp', alt: 'Fahrzeug vor Bergkulisse' },
  video: {
    kind: 'youtube' as const,
    embedUrl: 'https://www.youtube-nocookie.com/embed/video-id?autoplay=1',
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
  youtubeConsent: {
    required: true,
    text: 'YouTube erst nach Einwilligung laden.',
    buttonLabel: 'Video laden',
  },
}

describe('VideoTeaser', () => {
  it('keeps the YouTube iframe out of the DOM until consent is given', () => {
    render(<VideoTeaser {...props} />)

    fireEvent.click(screen.getByRole('button', { name: 'Video abspielen: Unser Video' }))
    expect(screen.getByText('YouTube erst nach Einwilligung laden.')).toBeInTheDocument()
    expect(screen.queryByTitle('Unser Video')).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Video laden' }))
    expect(screen.getByTitle('Unser Video')).toHaveAttribute('src', props.video.embedUrl)
  })
})
