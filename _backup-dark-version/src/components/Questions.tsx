import { contact, faqs } from '../data/content'
import { PlusIcon } from './Icons'

export function Questions() {
  return (
    <section id="questions" aria-labelledby="questions-title" className="relative px-5 py-20 sm:px-8 md:py-28 lg:px-12">
      <div className="mx-auto grid max-w-[1340px] gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-24">
        <div className="reveal">
          <p className="eyebrow">Common questions</p>
          <h2 id="questions-title" className="display-2 mt-4 text-white">
            Big plans.
            <br />
            <em>Good questions.</em>
          </h2>
          <p className="mt-6 max-w-[280px] text-[17px] leading-relaxed text-cream/75">Quick answers before you call.</p>
        </div>

        <div className="grid content-start gap-3">
          {faqs.map((faq, i) => {
            const last = i === faqs.length - 1
            return (
              <details key={faq.q} className="faq glass reveal rounded-[22px]">
                <summary className="flex cursor-pointer items-center justify-between gap-6 px-6 py-5 text-[17px] font-medium text-white">
                  {faq.q}
                  <span aria-hidden="true" className="faq-icon grid size-9 shrink-0 place-items-center rounded-full border border-white/20 text-cream">
                    <PlusIcon className="size-4" />
                  </span>
                </summary>
                <p className="px-6 pb-6 pr-16 text-[15px] leading-relaxed text-cream/75">
                  {faq.a}
                  {last && (
                    <>
                      {' '}
                      <a href={contact.phoneHref} className="text-white underline decoration-bronze-light underline-offset-4">
                        Call {contact.phone}
                      </a>{' '}
                      to arrange a visit.
                    </>
                  )}
                </p>
              </details>
            )
          })}
        </div>
      </div>
    </section>
  )
}
