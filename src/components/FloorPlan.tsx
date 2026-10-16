import { useEffect, useId, useRef, useState } from 'react'
import { contact } from '../data/content'
import { floorplanSizes } from '../data/floorplans'
import { formatArea, series, type Design } from '../data/designs'
import { to } from '../lib/router'
import { lockScroll } from '../hooks/useSmoothScroll'
import { ArrowRight, ChevronRight, CloseIcon, DownloadIcon, MinusIcon, PlusIcon } from './Icons'

type Plan = { label: string; src: string; width: number; height: number }

/** A design's floor plans, ground floor first. Empty when the brochure has none. */
function floorPlans(design: Design): Plan[] {
  const sizes = floorplanSizes[design.slug] ?? []
  const labels =
    design.storeys === 1 ? ['Floor plan'] : sizes.length === 2 ? ['Ground floor', 'First floor'] : ['Both floors']
  return sizes.map(([width, height], i) => ({
    label: labels[i],
    src: `${import.meta.env.BASE_URL}floorplans/${design.slug}-${i + 1}.webp`,
    width,
    height,
  }))
}

/** Picks a floor. Shown only for homes with more than one plan. */
function FloorSelect({
  plans,
  value,
  onChange,
  label = 'Choose floor',
}: {
  plans: Plan[]
  value: number
  onChange: (floor: number) => void
  label?: string
}) {
  const id = useId()
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-[13px] font-medium text-ink-soft">
        {label}
      </label>
      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full cursor-pointer appearance-none rounded-[12px] border border-ink/15 bg-white py-3 pl-4 pr-10 text-[15px] font-semibold text-ink hover:border-ink/40 focus:border-bronze"
        >
          {plans.map((plan, i) => (
            <option key={plan.label} value={i}>
              {plan.label}
            </option>
          ))}
        </select>
        <ChevronRight className="pointer-events-none absolute right-3.5 top-1/2 size-4 -translate-y-1/2 rotate-90 text-ink" />
      </div>
    </div>
  )
}

/**
 * One home's plan: a floor dropdown for double-storey homes, then the plan itself.
 * Tapping the plan opens the large viewer on the same floor.
 */
export function FloorPlanCard({ design, onOpen }: { design: Design; onOpen: (floor: number) => void }) {
  const plans = floorPlans(design)
  const [floor, setFloor] = useState(0)

  // A couple of published brochures have no plan in them: say so, and offer to send it.
  if (!plans.length)
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 rounded-[16px] border border-dashed border-ink/20 bg-white/60 px-5 py-10 text-center">
        <p className="text-[14px] font-medium text-ink-soft">The {design.name} floor plan isn’t online yet.</p>
        <a
          href={`mailto:${contact.email}?subject=${encodeURIComponent(`Floor plan: ${design.name}`)}`}
          className="link-underline text-[14px] font-semibold text-ink"
        >
          Ask us for it
        </a>
      </div>
    )

  const plan = plans[Math.min(floor, plans.length - 1)]
  return (
    <div className="flex flex-1 flex-col gap-3">
      {plans.length > 1 ? (
        <FloorSelect plans={plans} value={floor} onChange={setFloor} />
      ) : (
        <p className="text-[13px] font-medium text-ink-soft">{plan.label}</p>
      )}
      <button
        type="button"
        onClick={() => onOpen(floor)}
        className="group flex w-full flex-1 cursor-zoom-in flex-col items-center gap-3 rounded-[16px] border border-ink/10 bg-white p-4 transition-[border-color,box-shadow] duration-300 hover:border-bronze hover:shadow-[0_0_0_1px_var(--color-bronze)] focus-visible:border-bronze sm:p-5"
      >
        <span className="flex w-full flex-1 items-center justify-center">
          <img
            key={plan.src}
            src={plan.src}
            alt={`${design.name}, ${plan.label.toLowerCase()}`}
            width={plan.width}
            height={plan.height}
            loading="lazy"
            decoding="async"
            // As wide as the column allows; tall plans stop at most of the screen height.
            className="block h-auto max-h-[min(70svh,720px)] w-auto max-w-full"
          />
        </span>
        <span className="text-[14px] font-semibold text-ink-soft transition-colors group-hover:text-ink">Enlarge floor plan</span>
      </button>
    </div>
  )
}

/**
 * Large view of a floor plan. With several homes, tabs along the top switch between them;
 * double-storey homes get the same floor dropdown as the cards.
 */
export function FloorPlanViewer({
  homes,
  open,
  onChange,
}: {
  homes: Design[]
  /** The home and floor being shown, or null when closed */
  open: { slug: string; floor: number } | null
  onChange: (open: { slug: string; floor: number } | null) => void
}) {
  const ref = useRef<HTMLDialogElement>(null)
  const [zoomed, setZoomed] = useState(false)
  const current = homes.find((h) => h.slug === open?.slug)
  const plans = current ? floorPlans(current) : []
  const floor = Math.min(open?.floor ?? 0, Math.max(plans.length - 1, 0))
  const plan = plans[floor]

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  // The page behind stays put while the viewer is open.
  const isOpen = open !== null
  useEffect(() => {
    if (!isOpen) return
    lockScroll(true)
    return () => lockScroll(false)
  }, [isOpen])

  // Another home or floor starts fitted to the screen again.
  useEffect(() => setZoomed(false), [open?.slug, floor])

  return (
    <dialog
      ref={ref}
      aria-label={current ? `${current.name}, ${plan ? plan.label.toLowerCase() : 'floor plan'}` : 'Floor plan'}
      onClose={() => onChange(null)}
      // A click on the backdrop (outside the panel) closes it.
      onClick={(e) => e.target === e.currentTarget && ref.current?.close()}
      className="glass-strong m-auto h-[min(920px,calc(100svh-24px))] w-[min(1240px,calc(100vw-24px))] max-h-none max-w-none overflow-hidden rounded-[28px] p-0 text-ink backdrop:bg-ink/35 backdrop:backdrop-blur-[3px]"
    >
      {current && (
        <div className="flex h-full flex-col p-3 sm:p-4">
          <div className="flex flex-wrap items-end gap-2 pb-3">
            {homes.length > 1 ? (
              <div role="group" aria-label="Choose a home" className="flex min-w-0 flex-1 gap-1.5 overflow-x-auto pb-0.5 max-sm:basis-full">
                {homes.map((home) => (
                  <button
                    key={home.slug}
                    type="button"
                    aria-pressed={home.slug === current.slug}
                    onClick={() => onChange({ slug: home.slug, floor: 0 })}
                    className="chip !h-10 shrink-0 cursor-pointer !px-4"
                  >
                    {home.name}
                  </button>
                ))}
              </div>
            ) : (
              <p className="min-w-0 flex-1 truncate pb-2 font-serif text-[24px] leading-none">{current.name}</p>
            )}
            {plans.length > 1 && (
              <div className="w-[170px]">
                <FloorSelect plans={plans} value={floor} onChange={(f) => onChange({ slug: current.slug, floor: f })} label="Floor" />
              </div>
            )}
            {plan && (
              <button
                type="button"
                onClick={() => setZoomed((z) => !z)}
                aria-pressed={zoomed}
                className="btn btn-outline shrink-0 cursor-pointer !min-h-[46px] !px-3 !text-[13px] sm:!px-4"
              >
                {zoomed ? <MinusIcon className="!size-4" /> : <PlusIcon className="!size-4" />}
                <span className="max-sm:sr-only">{zoomed ? 'Fit to screen' : 'Zoom in'}</span>
              </button>
            )}
            <button
              type="button"
              onClick={() => ref.current?.close()}
              aria-label="Close"
              className="grid size-[46px] shrink-0 cursor-pointer place-items-center rounded-full border border-ink/15 bg-white/70 hover:bg-white"
            >
              <CloseIcon className="size-5" />
            </button>
          </div>

          <div
            data-lenis-prevent
            className={`relative min-h-0 flex-1 rounded-[18px] border border-ink/10 bg-white ${zoomed ? 'overflow-auto' : 'overflow-hidden'}`}
          >
            {plan ? (
              <img
                key={plan.src}
                src={plan.src}
                alt={`${current.name}, ${plan.label.toLowerCase()}`}
                width={plan.width}
                height={plan.height}
                // Zoomed: at most twice the image's own width, so narrow plans stay sharp enough to read.
                style={zoomed ? { width: Math.min(plan.width * 2, 1800) } : undefined}
                className={zoomed ? 'block h-auto max-w-none' : 'absolute inset-0 size-full object-contain p-3 sm:p-6'}
              />
            ) : (
              <div className="flex h-full flex-col items-center justify-center gap-3 px-5 text-center">
                <p className="text-[14px] font-medium text-ink-soft">The {current.name} floor plan isn’t online yet.</p>
                <a
                  href={`mailto:${contact.email}?subject=${encodeURIComponent(`Floor plan: ${current.name}`)}`}
                  className="link-underline text-[14px] font-semibold text-ink"
                >
                  Ask us for it
                </a>
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-x-5 gap-y-2 pt-3 text-[13px]">
            <p className="font-medium text-ink-soft">
              {series[current.series].name} · {current.bedrooms} bed · {current.bathrooms} bath · {formatArea(current.area)}
            </p>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-1 font-semibold">
              <a href={current.brochure} target="_blank" rel="noopener" className="inline-flex items-center gap-1.5">
                <DownloadIcon className="size-4 text-bronze-deep" />
                <span className="link-underline">Download PDF</span>
              </a>
              {/* On a home's own page this would only lead back to it. */}
              {homes.length > 1 && (
                <a href={to(`/designs/${current.slug}`)} onClick={() => ref.current?.close()} className="inline-flex items-center gap-1.5">
                  <span className="link-underline">View home</span>
                  <ArrowRight className="size-4" />
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </dialog>
  )
}
