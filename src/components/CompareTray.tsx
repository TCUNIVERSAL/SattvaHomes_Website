import { designBySlug } from '../data/designs'
import { compare, MAX_COMPARE, useCompareList, useCompareNotice } from '../lib/compare'
import { to } from '../lib/router'
import { ArrowRight, CloseIcon, PlusIcon } from './Icons'

/**
 * Floats at the bottom once a home is picked, so the shortlist is always in view.
 * Empty slots show how many more can be added; the button wakes up at two homes.
 */
export function CompareTray() {
  const list = useCompareList()
  const notice = useCompareNotice()
  if (!list.length) return null
  const homes = list.map((slug) => designBySlug.get(slug)!)

  return (
    <aside
      aria-label="Homes to compare"
      className="tray-in glass-strong fixed inset-x-3 bottom-[max(12px,env(safe-area-inset-bottom))] z-40 mx-auto max-w-[780px] rounded-[26px] p-2"
    >
      <div className="flex items-center gap-2 sm:gap-3">
        <ol className="flex min-w-0 flex-1 items-center gap-2.5 pt-1.5 sm:gap-3">
          {Array.from({ length: MAX_COMPARE }, (_, i) => {
            const home = homes[i]
            if (!home)
              return (
                <li
                  key={`empty-${i}`}
                  aria-hidden="true"
                  className="grid size-12 shrink-0 place-items-center rounded-[16px] border border-dashed border-ink/25 text-ink/35"
                >
                  <PlusIcon className="size-4" />
                </li>
              )
            return (
              <li key={home.slug} className="relative flex shrink-0 items-center rounded-[16px] bg-white/75 p-1 ring-1 ring-white md:min-w-0 md:shrink md:pr-3">
                <a href={to(`/designs/${home.slug}`)} className="flex min-w-0 items-center gap-2.5">
                  <img src={home.image} alt="" className="size-10 shrink-0 rounded-[12px] object-cover" />
                  <span className="hidden min-w-0 truncate text-[13px] font-semibold text-ink md:block">{home.name}</span>
                  <span className="sr-only md:hidden">{home.name}</span>
                </a>
                {/* Sits on the thumbnail's corner, so three homes and the button fit on a phone */}
                <button
                  type="button"
                  onClick={() => compare.remove(home.slug)}
                  aria-label={`Remove ${home.name} from compare`}
                  className="absolute -right-1.5 -top-1.5 grid size-6 cursor-pointer place-items-center rounded-full bg-white text-ink shadow-[0_2px_6px_rgb(31_43_66/.2)] ring-1 ring-ink/10 hover:bg-ink hover:text-white"
                >
                  <CloseIcon className="size-3" />
                </button>
              </li>
            )
          })}
        </ol>

        {list.length >= 2 ? (
          <a href={to('/compare', { homes: list.join(',') })} className="btn btn-ink !min-h-[48px] shrink-0 !px-5">
            Compare {list.length} <ArrowRight />
          </a>
        ) : (
          <p className="shrink-0 px-2 text-right text-[12px] font-semibold leading-tight text-ink-soft sm:px-3 sm:text-[13px]">
            Add 1 more
            <br className="sm:hidden" /> to compare
          </p>
        )}
      </div>
      <p aria-live="polite" className="px-3 text-[12.5px] font-medium text-bronze-deep empty:hidden [&:not(:empty)]:pb-1 [&:not(:empty)]:pt-2">
        {notice}
      </p>
    </aside>
  )
}
