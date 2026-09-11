'use client'

import { useEffect, useRef, useState, type CSSProperties } from 'react'

import type { VideoTeaserBlock } from '@/types/cms/page/blocks/video-teaser.types'

type VideoTeaserProps = Omit<VideoTeaserBlock, 'blockType' | 'id'>

export function VideoTeaser({
  design,
  durationLabel,
  headline,
  subheadline,
  teaserImage,
  video,
  youtubeConsent,
}: VideoTeaserProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [isYouTubeEnabled, setIsYouTubeEnabled] = useState(false)
  const Heading = headline.tag
  const Subheadline = subheadline.tag

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) {
      return
    }

    if (isOpen && !dialog.open) {
      dialog.showModal()
    }
    if (!isOpen && dialog.open) {
      dialog.close()
    }
  }, [isOpen])

  function closeDialog() {
    setIsOpen(false)
    setIsYouTubeEnabled(false)
  }

  return (
    <section className="mx-auto w-full max-w-6xl px-6 py-12">
      <div className="relative aspect-[5/4] w-full overflow-hidden rounded-3xl bg-black md:aspect-video">
        <img className="h-full w-full object-cover" src={teaserImage.url} alt={teaserImage.alt} />
        <span
          className="absolute inset-0"
          style={{ backgroundColor: design.overlayColor }}
          aria-hidden="true"
        />
        <div className="pointer-events-none absolute left-4 top-4 z-10 max-w-[78%] md:left-12 md:top-12 md:max-w-[62%]">
          <Heading
            className="font-heading leading-none tracking-wide text-balance"
            style={{ color: headline.color, fontSize: headline.fontSize }}
          >
            {headline.text}
          </Heading>
          {subheadline.text && (
            <Subheadline
              className="mt-2 font-heading leading-none tracking-wide text-balance"
              style={{ color: subheadline.color, fontSize: subheadline.fontSize }}
            >
              {subheadline.text}
            </Subheadline>
          )}
        </div>
        <div
          className="pointer-events-none absolute bottom-4 left-4 z-10 flex min-h-11 items-center gap-3 px-2 py-1.5 text-sm font-medium md:bottom-7 md:left-7 md:min-h-12 md:text-base"
          style={
            {
              backgroundColor: design.playButtonBackgroundColor,
              borderRadius: design.playButtonRadius,
              color: design.playButtonTextColor,
            } as CSSProperties
          }
          aria-hidden="true"
        >
          <span className="grid size-10 place-items-center rounded-full bg-white/20 md:size-13">
            <span className="ml-0.5 size-0 border-y-[7px] border-l-[10px] border-y-transparent border-l-current" />
          </span>
          <span>Video abspielen</span>
          {durationLabel && <span className="opacity-90">{durationLabel}</span>}
        </div>
        <button
          className="absolute inset-0 z-20 rounded-3xl focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-4 focus-visible:ring-offset-secondary"
          type="button"
          aria-label={`Video abspielen${headline.text ? `: ${headline.text}` : ''}`}
          onClick={() => setIsOpen(true)}
        />
      </div>

      <dialog
        ref={dialogRef}
        className="video-teaser-dialog m-auto w-[90vw] max-w-none overflow-hidden rounded-xl border-2 bg-black p-0 text-white"
        style={
          {
            '--video-teaser-backdrop-color': design.lightboxBackdropColor,
            borderColor: design.lightboxFrameColor,
            borderWidth: design.lightboxFrameWidth,
            maxWidth: design.lightboxMaxWidth,
            borderRadius: design.lightboxRadius,
          } as CSSProperties
        }
        aria-label={`Video: ${headline.text}`}
        onClose={closeDialog}
        onClick={(event) => {
          if (event.target === event.currentTarget) {
            closeDialog()
          }
        }}
      >
        <div className="relative aspect-video">
          <button
            className="absolute right-2 top-2 z-10 grid size-9 place-items-center rounded-full bg-black/60 text-2xl leading-none focus-visible:ring-2 focus-visible:ring-white"
            type="button"
            aria-label="Video schließen"
            onClick={closeDialog}
          >
            ×
          </button>
          {video.kind === 'youtube' && youtubeConsent.required && !isYouTubeEnabled ? (
            <div className="flex h-full flex-col items-center justify-center gap-4 bg-black/70 px-6 text-center">
              <p className="max-w-xl">{youtubeConsent.text}</p>
              <button
                className="rounded-full border border-white/80 px-4 py-2 focus-visible:ring-2 focus-visible:ring-white"
                type="button"
                onClick={() => setIsYouTubeEnabled(true)}
              >
                {youtubeConsent.buttonLabel}
              </button>
            </div>
          ) : video.kind === 'youtube' ? (
            <iframe
              className="size-full border-0"
              src={video.embedUrl}
              title={headline.text || 'YouTube-Video'}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          ) : (
            <video
              className="size-full object-cover"
              controls
              autoPlay
              poster={teaserImage.url}
              preload="metadata"
            >
              <source src={video.url} type={video.mimeType} />
              Dein Browser unterstützt die Videowiedergabe nicht.
            </video>
          )}
        </div>
      </dialog>
    </section>
  )
}
