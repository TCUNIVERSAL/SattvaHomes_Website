import { useEffect, useRef, useState } from 'react'
import poster from '../assets/images/aerial-poster.webp'
import { PauseIcon, PlayIcon } from './Icons'

// The films live in public/video (not imported), so the inlined artifact build stays small; there the poster stands in.
const film = (size: '720' | '1080') => `${import.meta.env.BASE_URL}video/aerial-${size}.mp4`

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
    <section id="difference" aria-labelledby="difference-title" className="relative px-5 py-20 sm:px-8 md:py-28 lg:px-12">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(40%_50%_at_85%_60%,rgb(236_220_194/.6),transparent_70%),radial-gradient(35%_45%_at_10%_30%,rgb(207_224_245/.8),transparent_70%)]"
      />
      <div className="relative mx-auto max-w-[1340px]">
        <div className="reveal">
          <p className="eyebrow">Why Sattva</p>
          <h2 id="difference-title" className="display-2 mt-4">
            Considered in every <em>detail.</em>
          </h2>
        </div>

        <div className="reveal-img relative mt-12 md:mt-14">
          {/* Offset frame behind the film */}
          <div aria-hidden="true" className="absolute inset-0 translate-x-4 translate-y-4 rounded-[34px] border border-bronze/40 sm:translate-x-6 sm:translate-y-6" />
          <div className="relative overflow-hidden rounded-[32px] bg-mist shadow-[0_40px_80px_-40px_rgb(31_43_66/.35)]">
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
              aria-label="Drone footage of two finished single-storey homes"
              onPlay={() => setPlaying(true)}
              onPause={() => setPlaying(false)}
              className="aspect-[4/3] h-auto w-full object-cover object-[50%_35%] sm:aspect-video lg:aspect-[2/1]"
            >
              <source src={film('1080')} type="video/mp4" media="(min-width: 768px)" />
              <source src={film('720')} type="video/mp4" />
            </video>
            <button
              type="button"
              onClick={toggle}
              aria-label={playing ? 'Pause video' : 'Play video'}
              className="glass absolute bottom-4 right-4 grid size-12 cursor-pointer place-items-center rounded-full text-ink transition-transform duration-300 hover:scale-105 sm:bottom-5 sm:right-5"
            >
              {playing ? <PauseIcon className="size-5" /> : <PlayIcon className="size-5" />}
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
