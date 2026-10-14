import { HomeFinder } from './HomeFinder'
import { PinIcon } from './Icons'

const heroSrc = `${import.meta.env.BASE_URL}images/hero-night.webp`

export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="hero relative isolate flex min-h-svh flex-col overflow-clip">
      {/* Photograph + shading */}
      <div className="absolute inset-0 -z-10" aria-hidden="true">
        <img
          src={heroSrc}
          alt=""
          width={1672}
          height={941}
          fetchPriority="high"
          decoding="async"
          className="hero-photo size-full object-cover object-[62%_center] md:object-center"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgb(9_13_22/.7)_0%,rgb(9_13_22/.15)_24%,transparent_40%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(60%_42%_at_50%_30%,rgb(9_13_22/.5),transparent_75%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(0deg,var(--color-night)_0%,rgb(9_13_22/.55)_16%,transparent_42%)]" />
        <div className="hero-shade absolute inset-0 bg-night" />
      </div>

      <div className="mx-auto flex w-full max-w-[1180px] flex-1 flex-col items-center px-5 pb-8 pt-[clamp(100px,14vh,170px)] text-center sm:px-8">
        <p className="eyebrow rise hero-text flex items-center gap-3 [--d:.05s]">
          <span className="h-px w-6 bg-current" aria-hidden="true" />
          Queensland home builder
          <span className="h-px w-6 bg-current" aria-hidden="true" />
        </p>

        <h1 id="hero-title" className="display-1 hero-text mt-6 text-white [@media(max-height:820px)]:mt-4">
          <span className="rise block [--d:.15s]">A home to love.</span>
          <span className="rise block [--d:.28s]">
            A builder to <em>trust.</em>
          </span>
        </h1>

        <p className="rise hero-text mt-5 max-w-[34ch] text-[17px] leading-relaxed text-cream/85 [--d:.4s] lg:max-w-none">
          Thoughtfully designed homes, with clear answers before you commit.
        </p>

        <div className="mt-[clamp(24px,4vh,48px)] w-full max-w-[1040px]">
          <HomeFinder />
        </div>

        {/* Bottom row: caption, scroll cue + actions, location */}
        <div className="mt-auto grid w-full grid-cols-1 items-end gap-6 pt-10 lg:grid-cols-[1fr_auto_1fr] [@media(max-height:820px)]:pt-5">
          <figure className="glass rise rise-soft order-3 mx-auto w-full max-w-[330px] rounded-3xl px-5 py-4 text-left [--d:.9s] lg:order-none lg:mx-0 [@media(max-height:820px)]:py-3">
            <p className="eyebrow !text-[10px] !tracking-[.22em]">The art of feeling at home</p>
            <figcaption className="mt-2 font-serif text-[22px] leading-snug text-white">
              Space for your everyday.
              <br />
              <em className="text-champagne">And everything to come.</em>
            </figcaption>
          </figure>

          <div className="rise flex flex-col items-center gap-4 [--d:1s]">
            <span className="scroll-line h-12 w-px bg-white/25 [@media(max-height:820px)]:h-6" aria-hidden="true" />
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
              <a href="#collections" className="btn btn-cream">
                See our homes
              </a>
              <a href="#difference" className="link-underline text-[14px] text-white">
                Why Sattva?
              </a>
            </div>
          </div>

          <div className="flex flex-col items-center gap-2 lg:items-end">
            <p className="glass rise rise-soft inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-[13px] text-cream [--d:1.1s]">
              <PinIcon className="size-4 text-bronze-light" />
              Display home in Willawong
            </p>
            <span className="rise text-[11px] tracking-wide text-cream/60 [--d:1.15s]">Concept image</span>
          </div>
        </div>
      </div>
    </section>
  )
}
