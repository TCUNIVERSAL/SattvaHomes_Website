import { promises } from '../data/content'

export function PromiseBar() {
  return (
    <div className="relative px-4 sm:px-6 lg:px-12">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -top-24 h-64 bg-[radial-gradient(50%_60%_at_30%_50%,rgb(236_220_194/.7),transparent_70%),radial-gradient(40%_60%_at_75%_40%,rgb(207_224_245/.85),transparent_70%)]"
      />
      <div className="glass reveal relative mx-auto grid max-w-[1340px] grid-cols-1 gap-y-5 rounded-[24px] px-6 py-6 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-6 sm:rounded-[28px] md:grid-cols-[1.1fr_1fr_1fr_1fr] md:items-center md:px-10 md:py-7">
        <p className="font-serif text-[22px] leading-tight text-ink">
          Our promise
          <br />
          to <em className="text-bronze-deep">you.</em>
        </p>
        {promises.map((promise, i) => (
          <p key={promise} className="flex items-center gap-3.5 text-[14px] font-medium leading-snug text-ink">
            <span className="grid size-9 shrink-0 place-items-center rounded-full border border-bronze/50 bg-white/60 text-[11px] font-bold text-bronze-deep">
              {String(i + 1).padStart(2, '0')}
            </span>
            {promise}
          </p>
        ))}
      </div>
    </div>
  )
}
