import { useEffect, useRef, useState } from 'react'
import poster from '../assets/images/aerial-poster.webp'
import { PauseIcon, PlayIcon } from './Icons'

// The film lives in public/video (not imported), so the inlined artifact build stays small; there the poster stands in.
const filmSrc = `${import.meta.env.BASE_URL}video/useme.mp4`

export function AerialFilm() {
  const videoRef = useRef<HTMLVideoElement>(null)
  // Plays on its own unless the visitor prefers reduced motion; the play/pause button overrides this either way.
  const wantsPlay = useRef(true)
  const [near, setNear] = useState(false)
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    wantsPlay.current = !window.matchMedia('(prefers-reduced-motion: reduce)').matches
    // Fetch the poster and footage only as the film nears the screen, and pause it once it scrolls away.
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setNear(true)
          if (wantsPlay.current) video.play().catch(() => {})
        } else {
          video.pause()
        }
      },
      { rootMargin: '200px 0px' },
    )
    observer.observe(video)
    return () => observer.disconnect()
  }, [])

  const toggle = () => {
    const video = videoRef.current
    if (!video) return
    wantsPlay.current = video.paused
    if (video.paused) video.play().catch(() => {})
    else video.pause()
  }

  return (
    <section id="difference" aria-labelledby="difference-title" className="relative px-4 py-16 sm:px-6 md:py-24 lg:px-12">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(40%_50%_at_85%_60%,rgb(236_220_194/.6),transparent_70%),radial-gradient(35%_45%_at_10%_30%,rgb(207_224_245/.8),transparent_70%)]"
      />
      <div className="relative mx-auto max-w-[1240px]">
        <div className="reveal">
          <p className="eyebrow">Why Sattva</p>
          <h2 id="difference-title" className="display-2 mt-3 sm:mt-4">
            Considered in every <em>detail.</em>
          </h2>
        </div>

        <div className="reveal-img relative mt-8 sm:mt-12 md:mt-14">
          <div className="relative overflow-hidden rounded-[20px] sm:rounded-[32px] border border-bronze/35 bg-mist shadow-[0_25px_60px_-20px_rgb(31_43_66/.25)] ring-1 ring-white/60">
            <video
              ref={videoRef}
              poster={near ? poster : undefined}
              width={1920}
              height={1080}
              preload="none"
              muted
              loop
              playsInline
              disablePictureInPicture
              disableRemotePlayback
              aria-label="Sattva Homes video footage"
              onPlay={() => setPlaying(true)}
              onPause={() => setPlaying(false)}
              className="aspect-video h-auto w-full object-cover object-center"
            >
              <source src={filmSrc} type="video/mp4" />
            </video>
            <button
              type="button"
              onClick={toggle}
              aria-label={playing ? 'Pause video' : 'Play video'}
              className="glass absolute bottom-3 right-3 grid size-10 cursor-pointer place-items-center rounded-full text-ink shadow-md transition-transform duration-300 hover:scale-105 sm:bottom-5 sm:right-5 sm:size-12"
            >
              {playing ? <PauseIcon className="size-4 sm:size-5" /> : <PlayIcon className="size-4 sm:size-5" />}
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
