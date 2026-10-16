import { useEffect, useRef, useState } from 'react'
import modelPoster from '../assets/images/house-model-poster.webp'
import { ArrowUpRight, PauseIcon, PlayIcon } from './Icons'

const modelVideo = `${import.meta.env.BASE_URL}video/final3dvideo.mp4`

export function HouseModel() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const wantsPlay = useRef(true)
  const [playing, setPlaying] = useState(false)
  const [videoError, setVideoError] = useState(false)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    // Explicitly guarantee muted state for modern browser autoplay policies
    video.muted = true
    video.defaultMuted = true

    wantsPlay.current = !window.matchMedia('(prefers-reduced-motion: reduce)').matches
    // Load and play the film when it is visible; preserve a visitor's choice to pause.
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && wantsPlay.current) {
          video.play().catch(() => {
            // The play button remains available if the browser declines autoplay.
          })
        } else if (!entry.isIntersecting) {
          video.pause()
        }
      },
      { threshold: 0.15 },
    )
    observer.observe(video)

    return () => {
      observer.disconnect()
      video.pause()
    }
  }, [])

  const togglePlayback = () => {
    const video = videoRef.current
    if (!video) return

    wantsPlay.current = video.paused
    if (video.paused) video.play().catch(() => {})
    else video.pause()
  }

  return (
    <section id="house-model" aria-labelledby="house-model-title" className="relative overflow-clip px-4 py-16 sm:px-6 md:py-24 lg:px-12">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(45%_55%_at_10%_65%,rgb(236_220_194/.65),transparent_75%),radial-gradient(45%_60%_at_90%_70%,rgb(207_224_245/.7),transparent_75%)]"
      />

      <div className="relative mx-auto max-w-[1340px]">
        <div className="reveal">
          <p className="eyebrow">3D House model</p>
          <h2 id="house-model-title" className="display-2 mt-4 max-w-[660px]">
            See your home<br className="hidden sm:block" /> before you <em>build.</em>
          </h2>
        </div>

        <div className="reveal-img mt-9 grid items-stretch gap-5 sm:mt-12 lg:grid-cols-[.9fr_1.7fr] lg:gap-6">
          <div className="glass flex min-w-0 flex-col justify-center rounded-[24px] p-7 sm:rounded-[28px] sm:p-8 xl:p-9">
            <span aria-hidden="true" className="mb-6 h-px w-12 bg-bronze" />
            <div className="font-serif text-[24px] leading-[1.3] tracking-[-.015em] text-ink xl:text-[25px] 2xl:text-[28px]">
              <p>
                We provide a 3D model of your home so you can explore it <em className="text-bronze-deep">inside and out.</em>
              </p>
              <p className="mt-4 text-ink-soft">
                Walk through the rooms, look around outside, and see how it all comes together.
              </p>
            </div>
            <p className="mt-6 border-t border-bronze/25 pt-5 font-serif text-[22px] leading-[1.25] tracking-[-.01em] text-ink xl:text-[23px] 2xl:text-[25px]">
              <strong className="font-semibold">Less guesswork. More confidence in the home you choose.</strong>
            </p>
          </div>

          <figure className="glass min-w-0 self-start overflow-hidden rounded-[24px] sm:rounded-[28px]">
            <div className="relative aspect-[2260/1080] overflow-hidden bg-mist">
              <video
                ref={videoRef}
                src={modelVideo}
                poster={modelPoster}
                width={2286}
                height={1080}
                autoPlay
                preload="metadata"
                muted
                loop
                playsInline
                disablePictureInPicture
                disableRemotePlayback
                id="house-model-video"
                aria-label="Preview of the Sattva Homes 3D house model"
                aria-describedby="house-model-video-caption"
                onPlay={() => setPlaying(true)}
                onPause={() => setPlaying(false)}
                onError={() => setVideoError(true)}
                className="block size-full object-cover object-center"
              >
                Your browser does not support this video. <a href={modelVideo}>Watch the 3D house model preview.</a>
              </video>
              {!videoError && (
                <button
                  type="button"
                  onClick={togglePlayback}
                  aria-label={playing ? 'Pause 3D model video' : 'Play 3D model video'}
                  aria-controls="house-model-video"
                  className="glass absolute bottom-3 right-3 grid size-11 cursor-pointer place-items-center rounded-full text-ink shadow-md transition-transform duration-300 hover:scale-105 sm:bottom-5 sm:right-5 sm:size-12"
                >
                  {playing ? <PauseIcon className="size-5" /> : <PlayIcon className="size-5" />}
                </button>
              )}
            </div>
            <figcaption id="house-model-video-caption" className="flex min-h-[80px] flex-wrap items-center justify-between gap-x-4 gap-y-2 px-5 py-4 sm:px-6">
              <div>
                <p className="eyebrow text-[10px]">The 3D preview</p>
                <p className="mt-1 font-serif text-[23px] leading-tight">Get to know every detail.</p>
              </div>
              {videoError && (
                <p role="status" className="w-full text-sm text-ink-soft">
                  Having trouble playing the preview? <a href={modelVideo} className="link-underline text-ink">Open the video</a>.
                </p>
              )}
            </figcaption>
          </figure>
        </div>

        <div className="reveal mt-7 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
          <p className="max-w-[440px] text-[14px] text-ink-soft">Picture your Home here, before the first brick is laid.</p>
          <a href="#contact" className="inline-flex min-h-11 items-center gap-2 text-[14px] font-semibold text-ink transition-colors hover:text-bronze-deep">
            Let’s talk about your home <ArrowUpRight className="size-[18px]" />
          </a>
        </div>
      </div>
    </section>
  )
}
