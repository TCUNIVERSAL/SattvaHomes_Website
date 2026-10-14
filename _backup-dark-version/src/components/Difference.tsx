import interior from '../assets/images/sattva-interior.jpg'
import { values } from '../data/content'

export function Difference() {
  return (
    <section id="difference" aria-labelledby="difference-title" className="relative px-5 py-20 sm:px-8 md:py-28 lg:px-12">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(40%_50%_at_85%_60%,rgb(170_132_85/.16),transparent_70%),radial-gradient(35%_45%_at_10%_30%,rgb(60_80_140/.2),transparent_70%)]"
      />
      <div className="relative mx-auto grid max-w-[1340px] items-center gap-14 lg:grid-cols-[1.05fr_1fr] lg:gap-20">
        <div className="reveal-img relative">
          {/* Offset frame behind the photo */}
          <div aria-hidden="true" className="absolute inset-0 translate-x-4 translate-y-4 rounded-[34px] border border-bronze-light/35 sm:translate-x-6 sm:translate-y-6" />
          <div className="relative overflow-hidden rounded-[32px] shadow-[0_40px_80px_-40px_rgb(0_0_0/.8)]">
            <img
              src={interior}
              alt="Light-filled kitchen with timber cabinetry featured by Sattva Homes"
              width={1920}
              height={873}
              loading="lazy"
              className="parallax h-[380px] w-full scale-110 object-cover object-[57%_center] sm:h-[520px] lg:h-[640px]"
            />
            <span className="glass absolute bottom-5 left-5 rounded-full px-4 py-2.5 text-[10px] font-bold tracking-[.2em] text-white">
              THOUGHTFUL IN THE DETAILS.
            </span>
          </div>
        </div>

        <div>
          <div className="reveal">
            <p className="eyebrow">Why Sattva</p>
            <h2 id="difference-title" className="display-2 mt-4 text-white">
              Confidence is built in.
              <br />
              <em>Before the first brick.</em>
            </h2>
            <p className="mt-6 max-w-[360px] text-[17px] leading-relaxed text-cream/75">A home is personal. So is how we work with you.</p>
          </div>

          <ol className="mt-10 grid gap-3">
            {values.map((value, i) => (
              <li key={value.title} className="glass reveal flex gap-5 rounded-[22px] px-6 py-5">
                <span className="pt-0.5 text-[11px] font-bold tracking-[.18em] text-bronze-light">{String(i + 1).padStart(2, '0')}</span>
                <div>
                  <h3 className="font-sans text-[17px] font-semibold text-white">{value.title}</h3>
                  <p className="mt-1.5 text-[15px] leading-relaxed text-cream/70">{value.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
