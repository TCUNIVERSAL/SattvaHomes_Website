import { useEffect, useMemo, useRef, useState, type ReactNode, type RefObject } from 'react'
import { contact } from '../data/content'
import {
  designBySlug,
  designs,
  formatArea,
  formatMetres,
  series,
  seriesKeys,
  storeyLabel,
  suitsLabel,
  type Design,
  type SeriesKey,
} from '../data/designs'
import { FloorPlanCard, FloorPlanViewer } from '../components/FloorPlan'
import { ArrowRight, CheckIcon, CloseIcon, CompareIcon, DownloadIcon, LinkIcon, MailIcon, PlusIcon, SearchIcon } from '../components/Icons'
import { Breadcrumb, PageShell } from '../components/PageShell'
import { compare, MAX_COMPARE, useCompareList } from '../lib/compare'
import { lastList, replaceHash, to } from '../lib/router'

type CompareRow = {
  label: string
  value: (d: Design) => string | number | null
  format?: (v: number) => string
  /** Which end is better, and what to call it, when the homes differ */
  best?: { pick: 'max' | 'min'; note: string }
}

const rows: CompareRow[] = [
  { label: 'Collection', value: (d) => series[d.series].name },
  { label: 'Storeys', value: (d) => storeyLabel(d.storeys) },
  { label: 'Bedrooms', value: (d) => d.bedrooms, best: { pick: 'max', note: 'Most' } },
  { label: 'Bathrooms', value: (d) => d.bathrooms, best: { pick: 'max', note: 'Most' } },
  { label: 'Car spaces', value: (d) => d.cars, best: { pick: 'max', note: 'Most' } },
  { label: 'Living areas', value: (d) => d.living, best: { pick: 'max', note: 'Most' } },
  { label: 'Home size', value: (d) => d.area, format: formatArea, best: { pick: 'max', note: 'Largest' } },
  { label: 'Width', value: (d) => d.width, format: formatMetres },
  { label: 'Length', value: (d) => d.length, format: formatMetres },
  { label: 'Block frontage', value: (d) => d.frontage, format: (m) => `from ${formatMetres(m)}`, best: { pick: 'min', note: 'Fits narrower blocks' } },
  { label: 'Designed for', value: (d) => suitsLabel(d.suits) },
]

export function ComparePage({ query }: { query: URLSearchParams }) {
  const stored = useCompareList()
  const homesParam = query.get('homes') ?? ''
  const fromUrl = useMemo(
    () => [...new Set(homesParam.split(','))].filter((s) => designBySlug.has(s)).slice(0, MAX_COMPARE),
    [homesParam],
  )
  // A shared link names its homes and wins; otherwise show the tray's homes and put them in the link.
  const slugs = fromUrl.length ? fromUrl : stored
  const homes = slugs.map((s) => designBySlug.get(s)!)

  useEffect(() => {
    if (fromUrl.length) compare.set(fromUrl)
    else if (stored.length) replaceHash(to('/compare', { homes: stored.join(',') }))
  }, [fromUrl, stored])

  useEffect(() => {
    document.title = 'Compare homes | Sattva Homes'
  }, [])

  const setHomes = (next: string[]) => {
    compare.set(next)
    replaceHash(to('/compare', { homes: next.join(',') }))
  }

  const [differencesOnly, setDifferencesOnly] = useState(false)
  const [copied, setCopied] = useState(false)
  const [planOpen, setPlanOpen] = useState<{ slug: string; floor: number } | null>(null)
  const dialogRef = useRef<HTMLDialogElement>(null)
  const openPicker = () => {
    dialogRef.current?.showModal()
    dialogRef.current?.querySelector('input')?.focus()
  }

  const table = rows.map((row) => {
    const values = homes.map(row.value)
    const known = values.filter((v): v is number => typeof v === 'number')
    const same = new Set(values.map(String)).size <= 1
    let best: number | null = null
    // Only name a winner when every home has the figure; a missing number isn't a smaller one.
    if (row.best && !same && known.length === values.length) best = row.best.pick === 'max' ? Math.max(...known) : Math.min(...known)
    return { row, values, same, best }
  })
  const sameCount = homes.length > 1 ? table.filter((t) => t.same).length : 0
  const visible = differencesOnly && homes.length > 1 ? table.filter((t) => !t.same) : table

  const share = async () => {
    try {
      await navigator.clipboard.writeText(location.href)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2500)
    } catch {
      window.prompt('Copy this link to share your comparison:', location.href)
    }
  }

  const enquiry = `mailto:${contact.email}?subject=${encodeURIComponent(
    `Comparing ${homes.map((h) => h.name).join(', ')}`,
  )}&body=${encodeURIComponent(
    `Hi Sattva team,\n\nI’m comparing the ${homes.map((h) => h.name).join(', ')} and would like to talk them through.\n\nMy comparison: ${location.href}\n\nWhere I’m looking to build:\nBest time to call:\n\nThanks,`,
  )}`

  // One narrow "Add home" column while there's room, so the homes' columns (and plans) stay wide.
  const addSlot = homes.length < MAX_COMPARE ? 1 : 0

  return (
    <PageShell>
      <div className="mx-auto max-w-[1340px]">
        <Breadcrumb items={[{ label: 'Home', href: '#' }, { label: 'Home designs', href: lastList.hash }, { label: 'Compare' }]} />

        <header className="mt-6 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="eyebrow">Compare homes</p>
            <h1 tabIndex={-1} className="display-2 mt-4">
              Side by side, <em>clearly.</em>
            </h1>
          </div>
          <p className="max-w-[380px] text-[16px] leading-relaxed text-ink-soft">
            Up to {MAX_COMPARE} homes at once, plans included. The stronger figure in each row is marked, so the differences stand out.
          </p>
        </header>

        {homes.length === 0 ? (
          <div className="glass-strong mt-10 flex flex-col items-center rounded-[32px] px-6 py-14 text-center sm:py-20">
            <span className="grid size-16 place-items-center rounded-2xl bg-white/80 text-bronze-deep">
              <CompareIcon className="size-8" />
            </span>
            <h2 className="mt-6 text-[32px] leading-tight">
              Nothing to compare <em>yet.</em>
            </h2>
            <p className="mt-3 max-w-[440px] text-[16px] leading-relaxed text-ink-soft">
              Tap <strong className="font-semibold text-ink">Compare</strong> on any home in the catalogue, or add one here.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <a href={lastList.hash} className="btn btn-ink">
                Browse home designs <ArrowRight />
              </a>
              <button type="button" onClick={openPicker} className="btn btn-outline cursor-pointer">
                <PlusIcon /> Add a home
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="mt-10 flex flex-wrap items-center justify-between gap-4">
              {homes.length > 1 ? (
                <label className="flex cursor-pointer flex-wrap items-center gap-x-3 gap-y-1 text-[14px] font-semibold text-ink">
                  <input
                    type="checkbox"
                    checked={differencesOnly}
                    onChange={(e) => setDifferencesOnly(e.target.checked)}
                    className="switch"
                  />
                  Only show differences
                  {sameCount > 0 && (
                    <span className="font-medium text-ink-soft">
                      ({sameCount} {sameCount === 1 ? 'row is' : 'rows are'} the same)
                    </span>
                  )}
                </label>
              ) : (
                <p className="text-[14px] font-semibold text-bronze-deep">Add one more home to start comparing.</p>
              )}
              <div className="flex flex-wrap gap-2">
                <button type="button" onClick={share} className="btn btn-outline cursor-pointer !min-h-11 !text-[13px]">
                  {copied ? <CheckIcon /> : <LinkIcon />}
                  <span aria-live="polite">{copied ? 'Link copied' : 'Copy link to share'}</span>
                </button>
                <a href={enquiry} className="btn btn-ink !min-h-11 !text-[13px]">
                  <MailIcon /> Ask about {homes.length > 1 ? 'these homes' : 'this home'}
                </a>
              </div>
            </div>

            {/* Scrolls sideways on small screens; the row labels stay put */}
            <div className="glass-strong mt-4 overflow-x-auto rounded-[28px] p-2" data-lenis-prevent-horizontal>
              <table className="w-full min-w-[720px] table-fixed border-separate border-spacing-0 text-left">
                <caption className="sr-only">Comparison of {homes.map((h) => h.name).join(', ')}</caption>
                <colgroup>
                  <col className="w-[108px] sm:w-[190px]" />
                  {homes.map((home) => (
                    <col key={home.slug} />
                  ))}
                  {addSlot > 0 && <col className="w-[140px] sm:w-[180px]" />}
                </colgroup>
                <thead>
                  <tr>
                    <td className="sticky left-0 z-10 rounded-l-[20px] bg-[#f7f9fc] align-bottom" />
                    {homes.map((home) => (
                      <th key={home.slug} scope="col" className="p-2 align-top font-normal">
                        <HomeHeader home={home} onRemove={() => setHomes(slugs.filter((s) => s !== home.slug))} />
                      </th>
                    ))}
                    {addSlot > 0 && (
                      <td className="p-2 align-top">
                        <button
                          type="button"
                          onClick={openPicker}
                          className="flex aspect-[4/3] w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-[20px] border border-dashed border-ink/25 bg-white/40 text-[14px] font-semibold text-ink transition-colors hover:border-bronze hover:bg-white/80"
                        >
                          <span className="grid size-11 place-items-center rounded-full border border-ink/20 bg-white">
                            <PlusIcon className="size-5" />
                          </span>
                          Add home
                        </button>
                      </td>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {/* Plans first: seeing the layouts side by side says more than any figure */}
                  <tr>
                    <th scope="row" className="sticky left-0 z-10 bg-[#f7f9fc] px-3 py-5 align-top text-[13px] font-semibold text-ink-soft sm:px-4">
                      Floor plans
                    </th>
                    {homes.map((home) => (
                      <td key={home.slug} className="px-2 py-4 align-top sm:px-3">
                        <div className="flex h-full flex-col">
                          <FloorPlanCard design={home} onOpen={(floor) => setPlanOpen({ slug: home.slug, floor })} />
                        </div>
                      </td>
                    ))}
                    {addSlot > 0 && <td />}
                  </tr>
                  {visible.map(({ row, values, best }) => (
                    <tr key={row.label} className="group">
                      <th
                        scope="row"
                        className="sticky left-0 z-10 border-t border-ink/10 bg-[#f7f9fc] px-3 py-4 text-[13px] font-semibold text-ink-soft sm:px-4"
                      >
                        {row.label}
                      </th>
                      {values.map((value, i) => {
                        const isBest = best !== null && value === best
                        return (
                          <td key={homes[i].slug} className="border-t border-ink/10 px-3 py-4 align-top sm:px-4">
                            <span className={`text-[15px] ${isBest ? 'font-semibold text-ink' : 'text-ink'}`}>
                              {value === null ? (
                                <span className="text-ink-soft">
                                  — <span className="sr-only">Not listed</span>
                                </span>
                              ) : typeof value === 'number' && row.format ? (
                                row.format(value)
                              ) : (
                                value
                              )}
                            </span>
                            {isBest && row.best && (
                              <span className="mt-1.5 flex w-fit items-center gap-1.5 rounded-full bg-sand/70 px-2.5 py-0.5 text-[11px] font-bold tracking-[.04em] text-bronze-deep">
                                <span aria-hidden="true" className="size-1.5 rounded-full bg-bronze" />
                                {row.best.note}
                              </span>
                            )}
                          </td>
                        )
                      })}
                      {addSlot > 0 && <td className="border-t border-ink/10" />}
                    </tr>
                  ))}
                  <tr>
                    <th scope="row" className="sticky left-0 z-10 rounded-bl-[20px] border-t border-ink/10 bg-[#f7f9fc] px-3 py-5 text-[13px] font-semibold text-ink-soft sm:px-4">
                      Explore this home
                    </th>
                    {homes.map((home) => (
                      <td key={home.slug} className="border-t border-ink/10 px-3 py-5 sm:px-4">
                        <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
                          <a href={to(`/designs/${home.slug}`)} className="btn btn-outline !min-h-11 !px-5 !text-[14px]">
                            View design
                          </a>
                          <a href={home.brochure} target="_blank" rel="noopener" className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-ink-soft hover:text-ink">
                            <DownloadIcon className="size-4 text-bronze-deep" />
                            <span className="link-underline">PDF</span>
                            <span className="sr-only"> brochure for {home.name}</span>
                          </a>
                        </div>
                      </td>
                    ))}
                    {addSlot > 0 && <td className="border-t border-ink/10" />}
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-[12px] leading-relaxed text-ink-soft">
              Figures are from each design’s plans. Facades and inclusions vary; we’ll confirm everything for your block.
            </p>
          </>
        )}
      </div>

      <FloorPlanViewer homes={homes} open={planOpen} onChange={setPlanOpen} />
      <AddHomeDialog dialogRef={dialogRef} chosen={slugs} onPick={(slug) => setHomes([...slugs, slug])} />
    </PageShell>
  )
}

function HomeHeader({ home, onRemove }: { home: Design; onRemove: () => void }) {
  return (
    <div className="flex flex-col gap-3">
      <div className="relative aspect-[4/3] overflow-hidden rounded-[20px] bg-mist">
        <img src={home.image} alt="" className="size-full object-cover" />
        <button
          type="button"
          onClick={onRemove}
          aria-label={`Remove ${home.name}`}
          className="glass absolute right-2.5 top-2.5 grid size-9 cursor-pointer place-items-center rounded-full text-ink hover:bg-white"
        >
          <CloseIcon className="size-4" />
        </button>
      </div>
      <div className="px-1">
        <p className="text-[10px] font-bold uppercase tracking-[.18em] text-bronze-deep">{series[home.series].name}</p>
        <p className="mt-1 font-serif text-[24px] leading-tight text-ink">{home.name}</p>
      </div>
    </div>
  )
}

/** "Add home": search the catalogue by name, narrowed by collection. */
function AddHomeDialog({
  dialogRef,
  chosen,
  onPick,
}: {
  dialogRef: RefObject<HTMLDialogElement | null>
  chosen: string[]
  onPick: (slug: string) => void
}) {
  const [term, setTerm] = useState('')
  const [collection, setCollection] = useState<SeriesKey | ''>('')
  const found = designs.filter(
    (d) => (!collection || d.series === collection) && d.name.toLowerCase().includes(term.trim().toLowerCase()),
  )

  const close = () => dialogRef.current?.close()

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="add-home-title"
      onClose={() => setTerm('')}
      // A click on the backdrop (outside the panel) closes it.
      onClick={(e) => e.target === e.currentTarget && close()}
      className="glass-strong m-auto max-h-none w-[min(560px,calc(100vw-24px))] overflow-hidden rounded-[28px] p-0 text-ink backdrop:bg-ink/30 backdrop:backdrop-blur-[3px]"
    >
      <div className="flex max-h-[min(680px,calc(100svh-48px))] flex-col p-5 sm:p-6">
        <div className="flex items-center justify-between gap-4">
          <h2 id="add-home-title" className="text-[28px] leading-none">
            Add a <em>home</em>
          </h2>
          <button type="button" onClick={close} aria-label="Close" className="grid size-10 cursor-pointer place-items-center rounded-full hover:bg-white/80">
            <CloseIcon className="size-5" />
          </button>
        </div>

        <label className="relative mt-5 block">
          <span className="sr-only">Search by name</span>
          <SearchIcon className="pointer-events-none absolute left-4 top-1/2 size-[18px] -translate-y-1/2 text-ink-soft" />
          <input
            type="search"
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            placeholder="Search by name"
            className="w-full rounded-full border border-ink/15 bg-white/80 py-3 pl-11 pr-4 text-[15px] text-ink placeholder:text-ink-soft focus:border-bronze focus:outline-none"
          />
        </label>
        <div role="group" aria-label="Collection" className="mt-3 flex flex-wrap gap-1.5">
          {(['', ...seriesKeys] as (SeriesKey | '')[]).map((key) => (
            <button
              key={key || 'all'}
              type="button"
              aria-pressed={collection === key}
              onClick={() => setCollection(key)}
              className="chip"
            >
              {key ? series[key].name : 'All'}
            </button>
          ))}
        </div>

        <ul data-lenis-prevent className="-mx-2 mt-4 min-h-0 flex-1 overflow-y-auto overscroll-contain px-2">
          {found.length === 0 && <li className="py-8 text-center text-[14px] text-ink-soft">No home by that name.</li>}
          {found.map((d) => {
            const picked = chosen.includes(d.slug)
            return (
              <li key={d.slug}>
                <button
                  type="button"
                  disabled={picked}
                  onClick={() => {
                    onPick(d.slug)
                    close()
                  }}
                  className="flex w-full cursor-pointer items-center gap-3 rounded-2xl p-2 text-left transition-colors hover:bg-white/80 disabled:cursor-default disabled:opacity-50 disabled:hover:bg-transparent"
                >
                  <img src={d.image} alt="" loading="lazy" className="size-14 shrink-0 rounded-xl object-cover" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-serif text-[19px] leading-tight text-ink">{d.name}</span>
                    <span className="block text-[12.5px] text-ink-soft">
                      {series[d.series].name} · {d.bedrooms} bed · {formatArea(d.area)}
                    </span>
                  </span>
                  <Pill>{picked ? 'Added' : 'Add'}</Pill>
                </button>
              </li>
            )
          })}
        </ul>
      </div>
    </dialog>
  )
}

const Pill = ({ children }: { children: ReactNode }) => (
  <span className="shrink-0 rounded-full border border-ink/15 bg-white px-3 py-1 text-[12px] font-semibold text-ink">{children}</span>
)
