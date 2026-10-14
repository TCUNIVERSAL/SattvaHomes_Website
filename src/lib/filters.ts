import { designs, series, type Design, type SeriesKey } from '../data/designs'

// Shared by the hero home finder and the designs page, so both always agree on what "matching" means.

export const AREA_RANGE = {
  min: Math.floor(Math.min(...designs.map((d) => d.area))),
  max: Math.ceil(Math.max(...designs.map((d) => d.area))),
}

/** Bedrooms, bathrooms and car spaces are minimums ("4+"): that's how people think about them. */
export const options = {
  storeys: [
    { value: '', label: 'Any' },
    { value: '1', label: 'Single' },
    { value: '2', label: 'Double' },
  ],
  bed: [0, 3, 4, 5],
  bath: [0, 2, 3, 4, 5],
  car: [0, 1, 2],
  /** Common Queensland lot frontages, in metres */
  block: [0, 10, 12.5, 14, 16, 18],
}

export const sorts = [
  { value: '', label: 'Recommended' },
  { value: 'size-asc', label: 'Size: smallest first' },
  { value: 'size-desc', label: 'Size: largest first' },
  { value: 'narrow', label: 'Narrowest block first' },
  { value: 'name', label: 'Name: A to Z' },
] as const

export type Filters = {
  series: SeriesKey | ''
  storeys: string
  bed: number
  bath: number
  car: number
  block: number
  areaMin: number
  areaMax: number
  sort: string
}

export const emptyFilters: Filters = {
  series: '',
  storeys: '',
  bed: 0,
  bath: 0,
  car: 0,
  block: 0,
  areaMin: AREA_RANGE.min,
  areaMax: AREA_RANGE.max,
  sort: '',
}

const num = (value: string | null) => {
  const n = Number(value)
  return Number.isFinite(n) && n > 0 ? n : 0
}

export function readFilters(query: URLSearchParams): Filters {
  const seriesValue = query.get('series') ?? ''
  const [low, high] = (query.get('area') ?? '').split('-').map(Number)
  const areaMin = Number.isFinite(low) && low > AREA_RANGE.min ? Math.min(low, AREA_RANGE.max) : AREA_RANGE.min
  const areaMax = Number.isFinite(high) && high > 0 && high < AREA_RANGE.max ? Math.max(high, areaMin) : AREA_RANGE.max
  const storeys = query.get('storeys') ?? ''
  const sort = query.get('sort') ?? ''
  return {
    series: seriesValue in series ? (seriesValue as SeriesKey) : '',
    storeys: storeys === '1' || storeys === '2' ? storeys : '',
    bed: num(query.get('bed')),
    bath: num(query.get('bath')),
    car: num(query.get('car')),
    block: num(query.get('block')),
    areaMin,
    areaMax,
    sort: sorts.some((s) => s.value === sort) ? sort : '',
  }
}

/** The query-string form of a set of filters, for `to('/designs', …)`. Defaults are left out. */
export function filterParams(f: Filters) {
  const areaSet = f.areaMin !== AREA_RANGE.min || f.areaMax !== AREA_RANGE.max
  return {
    series: f.series,
    storeys: f.storeys,
    bed: f.bed || undefined,
    bath: f.bath || undefined,
    car: f.car || undefined,
    block: f.block || undefined,
    area: areaSet ? `${f.areaMin}-${f.areaMax}` : undefined,
    sort: f.sort,
  }
}

export function matches(d: Design, f: Filters) {
  return (
    (!f.series || d.series === f.series) &&
    (!f.storeys || String(d.storeys) === f.storeys) &&
    d.bedrooms >= f.bed &&
    d.bathrooms >= f.bath &&
    (d.cars ?? 0) >= f.car &&
    (!f.block || d.frontage <= f.block) &&
    d.area >= f.areaMin &&
    d.area <= f.areaMax
  )
}

const sorters: Record<string, (a: Design, b: Design) => number> = {
  'size-asc': (a, b) => a.area - b.area,
  'size-desc': (a, b) => b.area - a.area,
  narrow: (a, b) => a.frontage - b.frontage || a.area - b.area,
  name: (a, b) => a.name.localeCompare(b.name),
}

export function applyFilters(f: Filters) {
  const found = designs.filter((d) => matches(d, f))
  const sorter = sorters[f.sort]
  return sorter ? found.sort(sorter) : found
}

export const countMatches = (f: Filters) => designs.reduce((n, d) => n + (matches(d, f) ? 1 : 0), 0)

/** The filters currently narrowing the list, each with its own reset, for removable chips and the "no results" helper. */
export function activeFilters(f: Filters): { key: string; label: string; reset: Partial<Filters> }[] {
  const active: { key: string; label: string; reset: Partial<Filters> }[] = []
  if (f.series) active.push({ key: 'series', label: `${series[f.series].name} collection`, reset: { series: '' } })
  if (f.storeys) active.push({ key: 'storeys', label: f.storeys === '1' ? 'Single storey' : 'Double storey', reset: { storeys: '' } })
  if (f.bed) active.push({ key: 'bed', label: `${f.bed}+ bedrooms`, reset: { bed: 0 } })
  if (f.bath) active.push({ key: 'bath', label: `${f.bath}+ bathrooms`, reset: { bath: 0 } })
  if (f.car) active.push({ key: 'car', label: `${f.car}+ car spaces`, reset: { car: 0 } })
  if (f.block) active.push({ key: 'block', label: `Fits a ${f.block} m block`, reset: { block: 0 } })
  if (f.areaMin !== AREA_RANGE.min || f.areaMax !== AREA_RANGE.max)
    active.push({ key: 'area', label: `${f.areaMin}–${f.areaMax} m²`, reset: { areaMin: AREA_RANGE.min, areaMax: AREA_RANGE.max } })
  return active
}
