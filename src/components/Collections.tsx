import { useRef, useState, type KeyboardEvent } from 'react'
import { flushSync } from 'react-dom'
import { collections, type CollectionKey } from '../data/content'
import { designs } from '../data/designs'
import { to } from '../lib/router'
import { ArrowRight, MinusIcon, PlusIcon } from './Icons'

const countIn = (key: CollectionKey) => designs.filter((d) => d.series === key).length

export function Collections() {
  const [active, setActive] = useState<CollectionKey>('essence')
  const tabRefs = useRef<Partial<Record<CollectionKey, HTMLButtonElement | null>>>({})
  const current = collections.find((c) => c.key === active)!

  const show = (key: CollectionKey) => {
    if (key === active) return
    const update = () => flushSync(() => setActive(key))
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!('startViewTransition' in document) || reduce) update()
    else document.startViewTransition(update)
  }

  const onKeyDown = (event: KeyboardEvent, index: number) => {
    const last = collections.length - 1
    const next =
      event.key === 'ArrowRight' ? (index + 1) % collections.length
      : event.key === 'ArrowLeft' ? (index + last) % collections.length
      : event.key === 'Home' ? 0
      : event.key === 'End' ? last
      : undefined
    if (next === undefined) return
    event.preventDefault()
    const key = collections[next].key
    tabRefs.current[key]?.focus()
    show(key)
  }

  return (
    <section id="collections" aria-labelledby="collections-title" className="relative px-5 py-20 sm:px-8 md:py-28 lg:px-12">
      <div className="mx-auto max-w-[1340px]">
        <div className="reveal flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="eyebrow">Our homes</p>
            <h2 id="collections-title" className="display-2 mt-4">
              Three styles.
              <br />
              <em>Which one is yours?</em>
            </h2>
          </div>
          <p className="max-w-[300px] text-[16px] leading-relaxed text-ink-soft">Choose a collection to see an example home.</p>
        </div>

        <div role="tablist" aria-label="Home collections" className="mt-12 grid grid-cols-3 gap-2 sm:gap-3">
          {collections.map((c, index) => {
            const selected = c.key === active
            return (
              <button
                key={c.key}
                ref={(el) => {
                  tabRefs.current[c.key] = el
                }}
                id={`tab-${c.key}`}
                type="button"
                role="tab"
                aria-selected={selected}
                aria-controls="collection-panel"
                tabIndex={selected ? 0 : -1}
                onClick={() => show(c.key)}
                onKeyDown={(e) => onKeyDown(e, index)}
                className="collection-tab reveal group relative isolate flex aspect-[4/5] flex-col overflow-hidden rounded-[22px] border border-white p-2 text-center sm:aspect-[16/10] sm:p-3 lg:aspect-[16/8]"
              >
                {/* Photo card: the full photo, with a white veil on the cards not selected */}
                <img
                  src={c.image}
                  alt=""
                  loading="lazy"
                  className="absolute inset-0 -z-10 size-full object-cover transition-[scale] duration-700 ease-[var(--ease-expo)] group-hover:scale-105"
                />
                <span
                  aria-hidden="true"
                  className={`absolute inset-0 -z-10 bg-white transition-opacity duration-500 ${
                    selected ? 'opacity-0' : 'opacity-35 group-hover:opacity-15'
                  }`}
                />
                <span className="flex items-start justify-between gap-2">
                  <span className="glass rounded-full px-2 py-0.5 text-[10px] font-bold tracking-[.16em] text-bronze-deep sm:px-2.5 sm:text-[11px]">
                    {c.number}
                  </span>
                  <span
                    aria-hidden="true"
                    className={`grid size-7 place-items-center rounded-full transition-colors sm:size-8 ${
                      selected ? 'bg-ink text-white' : 'glass text-ink'
                    }`}
                  >
                    {selected ? <MinusIcon className="size-3.5" /> : <PlusIcon className="size-3.5" />}
                  </span>
                </span>
                <span className="glass-strong mt-auto block rounded-2xl px-2 py-2 sm:px-4 sm:py-3">
                  <span className="block font-serif text-[clamp(14px,4vw,19px)] leading-none text-ink sm:text-[28px]">{c.series}</span>
                  <small className="mt-1.5 hidden text-[13px] leading-snug text-ink-soft sm:block">{c.tagline}</small>
                </span>
                <span aria-hidden="true" className="tab-bar absolute inset-x-0 bottom-0 h-[3px] bg-bronze" />
              </button>
            )
          })}
        </div>

        <div
          id="collection-panel"
          role="tabpanel"
          aria-labelledby={`tab-${active}`}
          tabIndex={0}
          className="reveal relative mt-3 overflow-hidden rounded-[32px] border border-white"
        >
          {/* The photo, blurred and washed white, becomes the glass behind the panel */}
          <img src={current.image} alt="" aria-hidden="true" className="absolute inset-0 size-full scale-125 object-cover opacity-80 blur-3xl" />
          <div className="absolute inset-0 bg-paper/55" aria-hidden="true" />

          <div className="relative grid gap-3 p-2.5 sm:p-3 lg:grid-cols-[1.3fr_1fr]">
            <figure className="collection-photo relative aspect-[4/3] overflow-hidden rounded-[24px] lg:aspect-auto lg:min-h-[500px]">
              <img
                src={current.image}
                alt={`${current.name} facade from the Sattva ${current.series} collection`}
                loading="lazy"
                className="absolute inset-0 size-full object-cover"
              />
              <span className="glass absolute left-4 top-4 rounded-full px-4 py-2 text-[10px] font-bold uppercase tracking-[.2em] text-ink">
                {current.series} collection
              </span>
              <figcaption className="glass absolute bottom-4 left-4 rounded-full px-3 py-1 text-[11px] font-medium text-ink-soft">
                Photo: Sattva Homes
              </figcaption>
            </figure>

            <div className="glass-strong flex flex-col justify-center rounded-[24px] p-6 sm:p-8 lg:p-10">
              <p className="eyebrow">Example home</p>
              <h3 className="mt-3 text-[40px] leading-[1.05] tracking-[-.02em] sm:text-[46px]">
                Meet <em>{current.name}.</em>
              </h3>
              <p className="mt-4 text-[16px] leading-relaxed text-ink-soft">{current.description}</p>

              <dl className={`mt-7 grid gap-2 ${current.specs.length === 3 ? 'grid-cols-3' : 'grid-cols-2'}`}>
                {current.specs.map(([value, label]) => (
                  <div key={label} className="rounded-2xl border border-white bg-white/70 px-4 py-3.5">
                    <dt className="sr-only">{label}</dt>
                    <dd className="font-serif text-[26px] leading-none text-ink">{value}</dd>
                    <dd className="mt-1.5 text-[12px] font-medium text-ink-soft" aria-hidden="true">
                      {label}
                    </dd>
                  </div>
                ))}
              </dl>

              <div className="mt-5 flex items-baseline justify-between border-y border-ink/10 py-4 text-[14px] font-medium text-ink-soft">
                <span>Home size</span>
                <strong className="font-serif text-[22px] font-normal text-ink">{current.area}</strong>
              </div>

              <a className="btn btn-ink mt-6 w-full" href={to('/designs', { series: current.key })}>
                See all {countIn(current.key)} {current.series} homes <ArrowRight />
              </a>
              <div className="mt-4 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2">
                <a href={to(`/designs/${current.slug}`)} className="link-underline text-[14px] font-semibold text-ink">
                  View the {current.name}
                </a>
                <p className="text-[12px] leading-relaxed text-ink-soft">Facades and inclusions vary.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="reveal mt-10 flex flex-col items-center gap-6">
          <a href={to('/designs')} className="btn btn-outline">
            See all {designs.length} home designs <ArrowRight />
          </a>
          <div className="flex flex-col items-center justify-center gap-2 text-[14px] text-ink-soft sm:flex-row sm:gap-5">
            <p>Not sure which suits you?</p>
            <a href="#contact" className="link-underline font-semibold text-ink">
              Help me choose
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
