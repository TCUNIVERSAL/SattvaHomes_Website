import { steps } from '../data/content'

export function Journey() {
  return (
    <section id="journey" aria-labelledby="journey-title" className="relative overflow-clip px-4 py-16 sm:px-6 md:py-24 lg:px-12">
      {/* Ambient light for the glass to catch */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute left-[8%] top-[30%] size-[460px] rounded-full bg-[radial-gradient(circle,rgb(236_220_194/.9),transparent_65%)]" />
        <div className="absolute right-[6%] top-[45%] size-[520px] rounded-full bg-[radial-gradient(circle,rgb(190_212_242/.9),transparent_65%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgb(31_43_66/.05)_1px,transparent_1px),linear-gradient(90deg,rgb(31_43_66/.05)_1px,transparent_1px)] bg-[size:72px_72px] [mask-image:radial-gradient(70%_60%_at_50%_55%,#000,transparent)]" />
      </div>

      <div className="relative mx-auto max-w-[1340px]">
        <div className="reveal flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="eyebrow">How it works</p>
            <h2 id="journey-title" className="display-2 mt-4">
              A clearer way <em>home.</em>
            </h2>
          </div>
          <p className="max-w-[300px] text-[16px] leading-relaxed text-ink-soft">
            Three simple steps.
            <br />
            You don’t need every answer.
          </p>
        </div>

        <ol className="relative mt-14 grid gap-4 md:grid-cols-3">
          <span
            aria-hidden="true"
            className="absolute left-[8%] right-[8%] top-[52px] hidden h-px bg-[linear-gradient(90deg,transparent,rgb(170_132_85/.45),transparent)] md:block"
          />
          {steps.map((step, i) => (
            <li key={step.label} className="glass reveal relative flex flex-col rounded-[28px] p-7 sm:p-8">
              <span className="font-serif text-[44px] leading-none text-bronze-deep">
                {String(i + 1).padStart(2, '0')}
                <span className="text-ink/25"> /</span>
              </span>
              <h3 className="mt-8 text-[28px] leading-tight">
                {step.lead} <em>{step.accent}</em>
              </h3>
              <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">{step.text}</p>
              <span className="mt-auto pt-8 text-[10px] font-bold tracking-[.22em] text-bronze-deep">{step.label}</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
