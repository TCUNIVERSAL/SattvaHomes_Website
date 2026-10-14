import { useEffect, useMemo, useState, type CSSProperties, type ReactNode } from 'react'
import { contact } from '../data/content'
import { designs, series, seriesKeys } from '../data/designs'
import { HomeCard } from '../components/HomeCard'
import { ChevronRight, CloseIcon, PhoneIcon, SlidersIcon } from '../components/Icons'
import { Breadcrumb, PageShell } from '../components/PageShell'
import {
  activeFilters,
  applyFilters,
  AREA_RANGE,
  countMatches,
  emptyFilters,
  filterParams,
  options,
  readFilters,
  sorts,
  type Filters,
} from '../lib/filters'
import { replaceHash, to } from '../lib/router'

/** Cards per batch: enough to compare at a glance, few enough not to overwhelm. */
const BATCH = 12
// How many cards were showing for each set of filters, so coming back from a home lands where you left off.
const shownMemory = new Map<string, number>()

export function DesignsPage({ query }: { query: URLSearchParams }) {
  const search = query.toString()
  const filters = useMemo(() => readFilters(new URLSearchParams(search)), [search])
  const results = useMemo(() => applyFilters(filters), [filters])
  const active = activeFilters(filters)
  const filterKey = JSON.stringify({ ...filters, sort: '' })

  const [shown, setShown] = useState(() => shownMemory.get(filterKey) ?? BATCH)
  const [panelOpen, setPanelOpen] = useState(false)

  // New filters start from the first batch again; a new sort keeps what's showing.
  useEffect(() => setShown(shownMemory.get(filterKey) ?? BATCH), [filterKey])
  useEffect(() => {
    shownMemory.set(filterKey, shown)
  }, [filterKey, shown])

  const update = (patch: Partial<Filters>) => replaceHash(to('/designs', filterParams({ ...filters, ...patch })))
  const clearAll = () => replaceHash(to('/designs', filterParams({ ...emptyFilters, sort: filters.sort })))

  const current = filters.series ? series[filters.series] : null
  useEffect(() => {
    document.title = `${current ? `${current.name} collection` : 'Home designs'} | Sattva Homes`
  }, [current])

  const seriesCounts = useMemo(
    () => Object.fromEntries(['', ...seriesKeys].map((key) => [key, countMatches({ ...filters, series: key as Filters['series'] })])),
    [filters],
  )

  return (
    <PageShell>
      <div className="mx-auto max-w-[1340px]">
        <Breadcrumb items={[{ label: 'Home', href: '#' }, { label: 'Home designs' }]} />

        <header className="mt-6 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="eyebrow">{current ? `${current.name} collection` : 'Home designs'}</p>
            <h1 tabIndex={-1} className="display-2 mt-4 max-w-[16ch]">
              {current ? (
                <>
                  {current.tagline.replace(/\.$/, '')}
                  <em>.</em>
                </>
              ) : (
                <>
                  Find the home that <em>fits.</em>
                </>
              )}
            </h1>
          </div>
          <p className="max-w-[380px] text-[16px] leading-relaxed text-ink-soft">
            {current
              ? current.summary
              : `${designs.length} designs across three collections. Start with your block and the rooms you need; you can compare up to three side by side.`}
          </p>
        </header>

        {/* Collections: the counts follow the other filters, so you can see where the matches are before you click */}
        <div role="group" aria-label="Collection" className="mt-10 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {(['', ...seriesKeys] as Filters['series'][]).map((key) => {
            const selected = filters.series === key
            return (
              <button
                key={key || 'all'}
                type="button"
                aria-pressed={selected}
                onClick={() => update({ series: key })}
                className={`flex cursor-pointer items-baseline justify-between gap-3 rounded-[20px] border px-4 py-4 text-left sm:px-5 transition-[background-color,border-color,box-shadow] duration-300 ${
                  selected
                    ? 'border-bronze bg-white shadow-[0_0_0_1px_var(--color-bronze),0_20px_40px_-28px_rgb(31_43_66/.35)]'
                    : 'border-white bg-white/50 hover:bg-white/80'
                }`}
              >
                <span className="font-serif text-[19px] leading-none text-ink sm:text-[22px]">{key ? series[key].name : 'All homes'}</span>
                <span className={`text-[13px] font-semibold tabular-nums ${selected ? 'text-bronze-deep' : 'text-ink-soft'}`}>
                  {seriesCounts[key]}
                </span>
              </button>
            )
          })}
        </div>

        <div className="mt-6 grid items-start gap-6 lg:grid-cols-[300px_1fr]">
          {/* Filters: always open on large screens, behind a button on small ones */}
          <div className="lg:sticky lg:top-[96px]">
            <button
              type="button"
              aria-expanded={panelOpen}
              aria-controls="design-filters"
              onClick={() => setPanelOpen((open) => !open)}
              className="btn btn-outline w-full lg:hidden"
            >
              <SlidersIcon />
              {panelOpen ? 'Hide filters' : 'Filters'}
              {active.length > 0 && (
                <span className="grid size-6 place-items-center rounded-full bg-ink text-[12px] text-white">{active.length}</span>
              )}
            </button>
            <FilterPanel filters={filters} update={update} clearAll={clearAll} hasActive={active.length > 0} open={panelOpen} />
          </div>

          <section aria-labelledby="results-title">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 id="results-title" aria-live="polite" className="font-sans text-[15px] font-semibold text-ink">
                {results.length === designs.length ? `All ${results.length} homes` : `${results.length} of ${designs.length} homes`}
              </h2>
              <label className="relative flex items-center gap-2 text-[13px] font-semibold text-ink-soft">
                Sort
                <select
                  value={filters.sort}
                  onChange={(e) => update({ sort: e.target.value })}
                  className="cursor-pointer appearance-none rounded-full border border-ink/15 bg-white/70 py-2.5 pl-4 pr-9 text-[14px] font-semibold text-ink hover:border-ink/40"
                >
                  {sorts.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
                <ChevronRight className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 rotate-90 text-ink" />
              </label>
            </div>

            {active.length > 0 && (
              <ul aria-label="Active filters" className="mt-4 flex flex-wrap items-center gap-2">
                {active.map((item) => (
                  <li key={item.key}>
                    <button
                      type="button"
                      onClick={() => update(item.reset)}
                      className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-bronze/40 bg-white/70 py-1.5 pl-3.5 pr-2.5 text-[13px] font-semibold text-ink hover:border-bronze"
                    >
                      {item.label}
                      <CloseIcon className="size-3.5 text-bronze-deep" />
                      <span className="sr-only">(remove)</span>
                    </button>
                  </li>
                ))}
                <li>
                  <button type="button" onClick={clearAll} className="link-underline cursor-pointer px-2 text-[13px] font-semibold text-ink">
                    Clear all
                  </button>
                </li>
              </ul>
            )}

            {results.length > 0 ? (
              <>
                <ul className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {results.slice(0, shown).map((design) => (
                    <li key={design.slug} className="flex">
                      <HomeCard design={design} />
                    </li>
                  ))}
                </ul>
                {results.length > shown && (
                  <div className="mt-10 flex flex-col items-center gap-3">
                    <button type="button" onClick={() => setShown((n) => n + BATCH)} className="btn btn-outline cursor-pointer">
                      Show {Math.min(BATCH, results.length - shown)} more
                    </button>
                    <p className="text-[13px] text-ink-soft">
                      Showing {shown} of {results.length}
                    </p>
                  </div>
                )}
              </>
            ) : (
              <NoResults filters={filters} update={update} clearAll={clearAll} />
            )}

            <aside className="glass mt-12 flex flex-col items-start justify-between gap-5 rounded-[28px] p-6 sm:flex-row sm:items-center sm:p-8">
              <div>
                <p className="font-serif text-[24px] leading-tight text-ink">
                  Can’t see quite the right <em className="text-bronze-deep">fit?</em>
                </p>
                <p className="mt-2 max-w-[460px] text-[15px] leading-relaxed text-ink-soft">
                  Bring your ideas. We’ll tell you what’s possible for your block and budget.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <a href="#contact" className="btn btn-ink">
                  Let’s talk
                </a>
                <a href={contact.phoneHref} className="btn btn-outline">
                  <PhoneIcon /> {contact.phone}
                </a>
              </div>
            </aside>
          </section>
        </div>
      </div>
    </PageShell>
  )
}

function FilterPanel({
  filters,
  update,
  clearAll,
  hasActive,
  open,
}: {
  filters: Filters
  update: (patch: Partial<Filters>) => void
  clearAll: () => void
  hasActive: boolean
  open: boolean
}) {
  const span = AREA_RANGE.max - AREA_RANGE.min
  const rangeStyle = {
    '--low': (filters.areaMin - AREA_RANGE.min) / span,
    '--high': (filters.areaMax - AREA_RANGE.min) / span,
  } as CSSProperties

  return (
    <form
      id="design-filters"
      aria-label="Filters"
      onSubmit={(e) => e.preventDefault()}
      className={`glass-strong mt-3 flex-col gap-6 rounded-[28px] p-5 lg:mt-0 lg:flex ${open ? 'flex' : 'hidden'}`}
    >
      <div className="flex items-center justify-between">
        <p className="font-serif text-[24px] leading-none text-ink">Filters</p>
        {hasActive && (
          <button type="button" onClick={clearAll} className="link-underline cursor-pointer text-[13px] font-semibold text-ink">
            Clear all
          </button>
        )}
      </div>

      <Group label="Storeys">
        {options.storeys.map((o) => (
          <Chip key={o.value || 'any'} name="f-storeys" checked={filters.storeys === o.value} onChange={() => update({ storeys: o.value })}>
            {o.label}
          </Chip>
        ))}
      </Group>
      <Group label="Bedrooms">
        {options.bed.map((n) => (
          <Chip key={n} name="f-bed" checked={filters.bed === n} onChange={() => update({ bed: n })}>
            {n ? `${n}+` : 'Any'}
          </Chip>
        ))}
      </Group>
      <Group label="Bathrooms">
        {options.bath.map((n) => (
          <Chip key={n} name="f-bath" checked={filters.bath === n} onChange={() => update({ bath: n })}>
            {n ? `${n}+` : 'Any'}
          </Chip>
        ))}
      </Group>
      <Group label="Car spaces">
        {options.car.map((n) => (
          <Chip key={n} name="f-car" checked={filters.car === n} onChange={() => update({ car: n })}>
            {n ? `${n}+` : 'Any'}
          </Chip>
        ))}
      </Group>
      <Group label="My block’s frontage" hint="Its width at the street. We’ll show homes drawn for a block this wide or narrower.">
        {options.block.map((n) => (
          <Chip key={n} name="f-block" checked={filters.block === n} onChange={() => update({ block: n })}>
            {n ? `${n} m` : 'Any'}
          </Chip>
        ))}
      </Group>

      <div role="group" aria-labelledby="f-area-label" className="flex flex-col gap-3">
        <div className="flex items-baseline justify-between gap-4">
          <span id="f-area-label" className="text-[13px] font-semibold text-ink-soft">
            Home size
          </span>
          <span className="text-[13px] font-semibold tabular-nums text-ink" aria-hidden="true">
            {filters.areaMin}–{filters.areaMax} m²
          </span>
        </div>
        <div className="range-pair" style={rangeStyle}>
          <label className="sr-only" htmlFor="f-area-min">
            Smallest home size
          </label>
          <input
            id="f-area-min"
            type="range"
            min={AREA_RANGE.min}
            max={AREA_RANGE.max}
            value={filters.areaMin}
            aria-valuetext={`${filters.areaMin} square metres`}
            onChange={(e) => {
              const low = Number(e.target.value)
              update({ areaMin: low, areaMax: Math.max(low, filters.areaMax) })
            }}
            style={{ zIndex: filters.areaMin > AREA_RANGE.max - 50 ? 2 : undefined }}
          />
          <label className="sr-only" htmlFor="f-area-max">
            Largest home size
          </label>
          <input
            id="f-area-max"
            type="range"
            min={AREA_RANGE.min}
            max={AREA_RANGE.max}
            value={filters.areaMax}
            aria-valuetext={`${filters.areaMax} square metres`}
            onChange={(e) => {
              const high = Number(e.target.value)
              update({ areaMax: high, areaMin: Math.min(high, filters.areaMin) })
            }}
          />
        </div>
      </div>
    </form>
  )
}

function Group({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <fieldset className="flex flex-col gap-2.5">
      <legend className="mb-2.5 text-[13px] font-semibold text-ink-soft">{label}</legend>
      <div className="flex flex-wrap gap-1.5">{children}</div>
      {hint && <p className="text-[12px] leading-snug text-ink-soft">{hint}</p>}
    </fieldset>
  )
}

function Chip({ name, checked, onChange, children }: { name: string; checked: boolean; onChange: () => void; children: ReactNode }) {
  return (
    <label className="chip">
      <input type="radio" name={name} checked={checked} onChange={onChange} className="sr-only" />
      {children}
    </label>
  )
}

/** No dead ends: offer the single change that brings homes back, with how many it would show. */
function NoResults({ filters, update, clearAll }: { filters: Filters; update: (patch: Partial<Filters>) => void; clearAll: () => void }) {
  const fixes = activeFilters(filters)
    .map((item) => ({ ...item, count: countMatches({ ...filters, ...item.reset }) }))
    .filter((item) => item.count > 0)
    .sort((a, b) => b.count - a.count)

  return (
    <div className="glass mt-6 rounded-[28px] p-7 sm:p-10">
      <p className="font-serif text-[30px] leading-tight text-ink">
        Nothing matches all of that, <em className="text-bronze-deep">yet.</em>
      </p>
      <p className="mt-3 max-w-[520px] text-[15px] leading-relaxed text-ink-soft">
        Loosen one filter to see what’s close, or bring us your ideas and we’ll tell you what’s possible for your block.
      </p>
      <ul className="mt-6 flex flex-wrap gap-2">
        {fixes.map((fix) => (
          <li key={fix.key}>
            <button type="button" onClick={() => update(fix.reset)} className="btn btn-outline cursor-pointer !min-h-11 !text-[13px]">
              Remove “{fix.label}” <span className="text-ink-soft">· {fix.count} homes</span>
            </button>
          </li>
        ))}
        <li>
          <button type="button" onClick={clearAll} className="btn btn-ink cursor-pointer !min-h-11 !text-[13px]">
            Show all {designs.length}
          </button>
        </li>
      </ul>
    </div>
  )
}
