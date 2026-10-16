import { formatArea, series, storeyLabel, type Design } from '../data/designs'
import { compare, useCompareList } from '../lib/compare'
import { to } from '../lib/router'
import { ArrowRight, BathIcon, BedIcon, CarIcon, CheckIcon, PlusIcon, SofaIcon } from './Icons'

/** Bedrooms, bathrooms, car spaces and living areas as a compact icon row. */
function Specs({ design, className = '' }: { design: Design; className?: string }) {
  const items = [
    { icon: BedIcon, value: design.bedrooms, label: 'bedrooms' },
    { icon: BathIcon, value: design.bathrooms, label: 'bathrooms' },
    { icon: CarIcon, value: design.cars, label: 'car spaces' },
    { icon: SofaIcon, value: design.living, label: 'living areas' },
  ].filter((item) => item.value !== null)

  return (
    <ul className={`flex flex-wrap items-center gap-x-4 gap-y-2 text-[14px] font-semibold text-ink ${className}`}>
      {items.map(({ icon: Icon, value, label }) => (
        <li key={label} className="flex items-center gap-1.5">
          <Icon className="size-[18px] text-bronze-deep" />
          {value}
          <span className="sr-only"> {label}</span>
        </li>
      ))}
    </ul>
  )
}

/** Toggles a home in the compare list. The tray explains when the list is already full. */
export function CompareToggle({ design, size = 'sm' }: { design: Design; size?: 'sm' | 'lg' }) {
  const on = useCompareList().includes(design.slug)
  const Icon = on ? CheckIcon : PlusIcon
  const look =
    size === 'lg'
      ? `btn w-full ${on ? 'btn-ink' : 'btn-outline'}`
      : `inline-flex min-h-10 items-center gap-1.5 rounded-full border px-3.5 text-[13px] font-semibold transition-colors ${
          on ? 'border-ink bg-ink text-white' : 'border-ink/20 bg-white/70 text-ink hover:border-ink/50 hover:bg-white'
        }`

  return (
    <button type="button" aria-pressed={on} onClick={() => compare.toggle(design.slug)} className={`relative z-10 cursor-pointer ${look}`}>
      <Icon className={size === 'lg' ? '' : 'size-4'} />
      {size === 'lg' ? (on ? 'Added to compare' : 'Add to compare') : on ? 'Comparing' : 'Compare'}
      <span className="sr-only"> {design.name}</span>
    </button>
  )
}

export function HomeCard({ design }: { design: Design }) {
  return (
    <article className="home-card group relative flex flex-col rounded-[26px] border border-white bg-white/60 p-2 shadow-[0_20px_50px_-36px_rgb(31_43_66/.4)]">
      <div className="relative aspect-[4/3] overflow-hidden rounded-[20px] bg-mist">
        <img
          src={design.image}
          alt=""
          loading="lazy"
          decoding="async"
          onError={(e) => (e.currentTarget.style.visibility = 'hidden')}
          className="size-full object-cover transition-[scale] duration-700 ease-[var(--ease-expo)] group-hover:scale-[1.04]"
        />
        <span className="glass absolute left-3 top-3 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[.18em] text-ink">
          {series[design.series].name}
        </span>
      </div>

      <div className="flex flex-1 flex-col px-3 pb-2 pt-4">
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="text-[25px] leading-tight">
            {/* The whole card is the link; the compare button sits above it */}
            <a
              href={to(`/designs/${design.slug}`)}
              className="after:absolute after:inset-0 after:rounded-[26px] focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-offset-2 focus-visible:after:outline-bronze-deep"
            >
              {design.name}
            </a>
          </h3>
          <span className="shrink-0 text-[14px] font-semibold tabular-nums text-ink">{formatArea(design.area)}</span>
        </div>
        <p className="mt-1 text-[13px] text-ink-soft">
          {storeyLabel(design.storeys)} · for {design.frontage} m frontage
        </p>
        <Specs design={design} className="mt-4" />
        {/* Pushes the footer down so the rows line up across a grid row */}
        <div className="flex-1" />
        <div className="mt-4 flex items-center justify-between gap-3 border-t border-ink/10 pt-3">
          <span aria-hidden="true" className="flex items-center gap-1.5 text-[13px] font-semibold text-ink">
            View home <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
          </span>
          <CompareToggle design={design} />
        </div>
      </div>
    </article>
  )
}
