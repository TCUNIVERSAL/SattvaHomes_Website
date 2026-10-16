import { contact, faqs } from '../data/content'
import { PlusIcon } from './Icons'

export function Questions() {
  return (
    <section id="questions" aria-labelledby="questions-title" className="relative px-4 py-16 sm:px-6 md:py-24 lg:px-12">
      <div className="mx-auto grid max-w-[1340px] gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-24">
        <div className="reveal">
          <p className="eyebrow">Common questions</p>
          <h2 id="questions-title" className="display-2 mt-4">
            Big plans.
            <br />
            <em>Good questions.</em>
          </h2>
          <p className="mt-4 sm:mt-6 max-w-[280px] text-[16px] sm:text-[17px] leading-relaxed text-ink-soft">Quick answers before you call.</p>
        </div>

        <div className="grid content-start gap-3">
          {faqs.map((faq, i) => {
            const last = i === faqs.length - 1
            return (
              <details key={faq.q} className="faq glass reveal rounded-[22px]">
                <summary className="flex cursor-pointer items-center justify-between gap-4 px-5 py-4 sm:px-6 sm:py-5 text-[16px] sm:text-[17px] font-semibold text-ink">
                  {faq.q}
                  <span aria-hidden="true" className="faq-icon grid size-8 sm:size-9 shrink-0 place-items-center rounded-full border border-ink/20 bg-white/60 text-ink">
                    <PlusIcon className="size-3.5 sm:size-4" />
                  </span>
                </summary>
                <p className="px-5 pb-5 pr-6 sm:px-6 sm:pb-6 sm:pr-14 text-[14px] sm:text-[15px] leading-relaxed text-ink-soft">
                  {faq.a}
                  {last && (
                    <>
                      {' '}
                      <a href={contact.phoneHref} className="font-semibold text-ink underline decoration-bronze underline-offset-4">
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
