import goldenHour from '../assets/images/concept-golden-hour.webp'
import { contact } from '../data/content'
import { ArrowRight, MailIcon, PhoneIcon, PinIcon } from './Icons'

export function Contact() {
  return (
    <section id="contact" aria-labelledby="contact-title" className="relative isolate overflow-clip px-4 py-16 sm:px-6 md:py-28 lg:px-12">
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <img src={goldenHour} alt="" loading="lazy" className="parallax size-full scale-110 object-cover" />
        {/* White wash only: blends the photo into the page above and below */}
        <div className="absolute inset-0 bg-[linear-gradient(180deg,var(--color-paper)_0%,rgb(245_247_250/.3)_24%,rgb(245_247_250/.12)_70%,var(--color-mist)_100%)]" />
      </div>

      <div className="glass-strong reveal mx-auto grid max-w-[1340px] gap-10 rounded-[28px] p-6 sm:rounded-[36px] sm:p-12 lg:grid-cols-[1.35fr_1fr] lg:gap-16 lg:p-16">
        <div>
          <p className="eyebrow">Your next step</p>
          <h2 id="contact-title" className="mt-4 sm:mt-5 text-[clamp(2.2rem,1.4rem+3.2vw,4.4rem)] leading-[1.04] tracking-[-.025em]">
            Let’s make room
            <br />
            for <em>your next chapter.</em>
          </h2>
          <p className="mt-4 sm:mt-6 text-[16px] sm:text-[17px] leading-relaxed text-ink-soft">
            A question, a block, a sketch on a napkin.
            <br />
            We’d love to hear it.
          </p>
          <div className="mt-7 sm:mt-9 flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3">
            <a className="btn btn-ink w-full sm:w-auto" href={contact.emailHref}>
              <MailIcon /> Email {contact.email}
            </a>
            <a className="btn btn-outline w-full sm:w-auto" href={contact.phoneHref}>
              <PhoneIcon /> Call {contact.phone}
            </a>
          </div>
        </div>

        <div className="flex flex-col justify-center border-t border-ink/10 pt-10 lg:border-l lg:border-t-0 lg:pl-14 lg:pt-0">
          <p className="eyebrow !text-[10px]">Come and say hello</p>
          <h3 className="mt-3 text-[34px] leading-[1.15]">
            Visit us in
            <br />
            <em>Willawong.</em>
          </h3>
          <a
            className="map-card mt-6 flex w-full max-w-[360px] flex-col gap-4 rounded-[22px] border border-white bg-white/75 p-4 shadow-[0_10px_30px_-20px_rgb(31_43_66/.25)]"
            href={contact.mapsHref}
            target="_blank"
            rel="noopener"
          >
            <span className="flex items-start gap-3.5">
              <span className="grid size-11 shrink-0 place-items-center rounded-full bg-mist text-bronze-deep">
                <PinIcon className="size-5" />
              </span>
              <span className="flex flex-col text-[14px] leading-normal text-ink-soft">
                <small className="text-[10px] font-bold uppercase tracking-[.18em] text-bronze-deep">Our office</small>
                <strong className="text-[16px] font-semibold text-ink">71 Waters Street</strong>
                <span>Willawong, Queensland 4110</span>
              </span>
            </span>
            <span className="flex items-center justify-between rounded-[14px] bg-ink px-4 py-3 text-[14px] font-semibold text-white">
              Get directions <ArrowRight className="map-arrow size-[18px]" />
            </span>
          </a>
          <small className="mt-4 text-[12px] font-medium text-ink-soft">Call ahead before visiting.</small>
        </div>
      </div>
    </section>
  )
}
