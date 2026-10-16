import { HomeFinder } from './HomeFinder'
import heroSrc from '../assets/images/hero-day.webp'

export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="hero relative isolate flex min-h-svh flex-col overflow-clip">
      {/* Photograph + light washes (white only, no dark overlays) */}
      <div className="absolute inset-0 -z-10" aria-hidden="true">
        <img
          src={heroSrc}
          alt=""
          width={1024}
          height={894}
          fetchPriority="high"
          decoding="async"
          className="hero-photo size-full object-cover object-[center_65%] md:object-center"
        />
        {/* Morning mist across the sky so navy type reads clearly */}
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgb(245_247_250/.9)_0%,rgb(245_247_250/.62)_20%,rgb(245_247_250/.18)_42%,transparent_58%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(55%_38%_at_50%_30%,rgb(255_255_255/.6),transparent_72%)]" />
        {/* Fade into the page */}
        <div className="absolute inset-0 bg-[linear-gradient(0deg,var(--color-paper)_0%,rgb(245_247_250/.55)_14%,transparent_34%)]" />
        <div className="hero-shade absolute inset-0 bg-paper" />
      </div>

      <div className="mx-auto flex w-full max-w-[1180px] flex-1 flex-col items-center px-5 pb-8 pt-[clamp(100px,14vh,170px)] text-center sm:px-8 [@media(max-height:820px)]:pb-5">
        <p className="eyebrow rise hero-text flex items-center gap-3 [--d:.05s]">
          <span className="h-px w-6 bg-current" aria-hidden="true" />
          Queensland home builder
          <span className="h-px w-6 bg-current" aria-hidden="true" />
        </p>

        <h1 id="hero-title" className="display-1 hero-text mt-6 [@media(max-height:820px)]:mt-3">
          <span className="rise block [--d:.15s]">A home to love.</span>
          <span className="rise block [--d:.28s]">
            A builder to <em>trust.</em>
          </span>
        </h1>

        <p className="glass rise rise-soft mt-5 max-w-[36ch] [@media(max-height:820px)]:mt-3 rounded-[22px] px-5 py-2 text-[16px] font-medium leading-relaxed text-ink [--d:.4s] sm:rounded-full sm:text-[17px] lg:max-w-none">
          A home worth choosing, a life worth living.
        </p>

        <div className="mt-[clamp(20px,4vh,48px)] w-full max-w-[1040px] [@media(max-height:820px)]:mt-[3vh]">
          <HomeFinder />
        </div>

        {/* Bottom row: scroll cue + the two actions */}
        <div className="rise mt-auto flex flex-col items-center gap-4 pt-10 [--d:.9s] [@media(max-height:820px)]:pt-5">
          <span className="scroll-line h-12 w-px bg-ink/15 [@media(max-height:820px)]:h-4" aria-hidden="true" />
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-3">
            <a href="#collections" className="btn btn-ink">
              See our homes
            </a>
            <a href="#difference" className="btn btn-outline">
              Why Sattva?
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
