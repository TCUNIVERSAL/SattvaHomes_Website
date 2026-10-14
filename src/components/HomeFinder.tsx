import { useMemo, useState, type CSSProperties } from 'react'
import { finder } from '../data/content'
import { AREA_RANGE, countMatches, emptyFilters, filterParams } from '../lib/filters'
import { to } from '../lib/router'
import { ArrowRight } from './Icons'

const { min: LOWEST, max: HIGHEST } = AREA_RANGE

/**
 * Home finder: storeys, bedrooms, bathrooms and home size.
 * The button counts matches as you choose, then opens them on the home designs page.
 */
export function HomeFinder() {
  const [storeys, setStoreys] = useState('')
  const [bedrooms, setBedrooms] = useState('')
  const [bathrooms, setBathrooms] = useState('')
  const [low, setLow] = useState(LOWEST)
  const [high, setHigh] = useState(HIGHEST)

  const { href, count } = useMemo(() => {
    const filters = { ...emptyFilters, storeys, bed: Number(bedrooms), bath: Number(bathrooms), areaMin: low, areaMax: high }
    return { href: to('/designs', filterParams(filters)), count: countMatches(filters) }
  }, [bedrooms, bathrooms, storeys, low, high])

  // Keep the two handles in order: whichever one moved pushes the other.
  const moveLow = (value: number) => {
    setLow(value)
    if (value > high) setHigh(value)
  }
  const moveHigh = (value: number) => {
    setHigh(value)
    if (value < low) setLow(value)
  }
  const span = HIGHEST - LOWEST
  const rangeStyle = { '--low': (low - LOWEST) / span, '--high': (high - LOWEST) / span } as CSSProperties

  return (
    <section id="finder" aria-labelledby="finder-title" className="w-full">
      <form className="glass rise rise-soft w-full rounded-[28px] p-2 text-left [--d:.55s]" onSubmit={(e) => e.preventDefault()}>
        {/* Header row: title + storeys tabs */}
        <div className="flex flex-col gap-3 px-4 pb-2 pt-3 sm:px-5 md:flex-row md:items-center md:justify-between">
          <h2 id="finder-title" className="text-[26px] leading-tight">
            Find your <em>home.</em>
          </h2>
          <fieldset className="flex flex-wrap items-center gap-x-5 gap-y-1 sm:gap-x-6">
            <legend className="sr-only">Storeys</legend>
            <span className="eyebrow w-full !text-[10px] !text-ink-soft sm:w-auto" aria-hidden="true">
              Storeys
            </span>
            {finder.storeys.map((option) => (
              <label key={option.value || 'any'} className="storey-tab text-[14px] sm:text-[15px]">
                <input
                  type="radio"
                  name="_type_of_home"
                  value={option.value}
                  checked={storeys === option.value}
                  onChange={() => setStoreys(option.value)}
                  className="sr-only"
                />
                {option.label}
              </label>
            ))}
          </fieldset>
        </div>

        {/* Fields row */}
        <div className="grid gap-2 rounded-[22px] bg-white/45 p-2 ring-1 ring-white/90 lg:grid-cols-[auto_auto_minmax(220px,1fr)_auto]">
          <ChipGroup label="Bedrooms" name="_bedrooms" options={finder.bedrooms} value={bedrooms} onChange={setBedrooms} />
          <ChipGroup label="Bathrooms" name="_bathrooms" options={finder.bathrooms} value={bathrooms} onChange={setBathrooms} />

          <div role="group" aria-labelledby="area-label" className="flex flex-col justify-center gap-2 rounded-2xl px-4 py-3 lg:border-l lg:border-ink/10">
            <div className="flex items-baseline justify-between gap-4">
              <span id="area-label" className="text-[13px] font-semibold text-ink-soft">
                Home size
              </span>
              <span className="text-[13px] font-semibold tabular-nums text-ink" aria-hidden="true">
                {low} m² – {high} m²
              </span>
            </div>
            <div className="range-pair" style={rangeStyle}>
              <label className="sr-only" htmlFor="f-area-min">
                Smallest home size
              </label>
              <input
                id="f-area-min"
                type="range"
                min={LOWEST}
                max={HIGHEST}
                step={1}
                value={low}
                aria-valuetext={`${low} square metres`}
                onChange={(e) => moveLow(Number(e.target.value))}
                style={{ zIndex: low > HIGHEST - 50 ? 2 : undefined }}
              />
              <label className="sr-only" htmlFor="f-area-max">
                Largest home size
              </label>
              <input
                id="f-area-max"
                type="range"
                min={LOWEST}
                max={HIGHEST}
                step={1}
                value={high}
                aria-valuetext={`${high} square metres`}
                onChange={(e) => moveHigh(Number(e.target.value))}
              />
            </div>
          </div>

          <a className="btn btn-bronze m-1 !min-h-[58px] !rounded-[16px] !px-7 !text-[15px] lg:self-center" href={href}>
            {/* A live count: you know what you'll get before you click */}
            <span aria-live="polite">{count ? `Show ${count} home${count === 1 ? '' : 's'}` : 'See the closest matches'}</span>
            <ArrowRight />
          </a>
        </div>
      </form>
      <p className="mt-3 text-center">
        <span className="glass rise rise-soft inline-block rounded-full px-3.5 py-1 text-[12px] font-medium text-ink-soft [--d:.7s]">
          No sign-up needed. Compare up to three homes side by side.
        </span>
      </p>
    </section>
  )
}

function ChipGroup({
  label,
  name,
  options,
  value,
  onChange,
}: {
  label: string
  name: string
  options: string[]
  value: string
  onChange: (v: string) => void
}) {
  return (
    <fieldset className="flex flex-col justify-center gap-2 rounded-2xl px-4 py-3 lg:[&+&]:border-l lg:[&+&]:border-ink/10">
      <legend className="float-left mb-0 text-[13px] font-semibold text-ink-soft">{label}</legend>
      <div className="flex flex-wrap gap-1.5 lg:flex-nowrap">
        {options.map((option) => (
          <label key={option || 'any'} className="chip">
            <input
              type="radio"
              name={name}
              value={option}
              checked={value === option}
              onChange={() => onChange(option)}
              className="sr-only"
            />
            {option ? `${option}+` : 'Any'}
          </label>
        ))}
      </div>
    </fieldset>
  )
}
