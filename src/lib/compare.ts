import { useSyncExternalStore } from 'react'
import { designBySlug } from '../data/designs'

/** Three at a time: enough to weigh real options, few enough to hold in your head and fit side by side. */
export const MAX_COMPARE = 3
const KEY = 'sattva-compare'

const clean = (slugs: unknown): string[] =>
  Array.isArray(slugs) ? [...new Set(slugs.filter((s): s is string => typeof s === 'string' && designBySlug.has(s)))].slice(0, MAX_COMPARE) : []

function read() {
  try {
    return clean(JSON.parse(localStorage.getItem(KEY) ?? '[]'))
  } catch {
    return []
  }
}

let list = read()
// A short message for the compare tray, e.g. when someone tries to add a fourth home.
let notice = ''
let noticeTimer = 0
const listeners = new Set<() => void>()
const emit = () => listeners.forEach((listener) => listener())

function write(next: string[]) {
  list = clean(next)
  notice = ''
  try {
    localStorage.setItem(KEY, JSON.stringify(list))
  } catch {
    // Private mode or blocked storage: the list still lasts for this visit.
  }
  emit()
}

function say(message: string) {
  notice = message
  emit()
  window.clearTimeout(noticeTimer)
  noticeTimer = window.setTimeout(() => {
    notice = ''
    emit()
  }, 6000)
}

const subscribe = (listener: () => void) => {
  listeners.add(listener)
  // Keep several open tabs in step.
  const onStorage = (event: StorageEvent) => {
    if (event.key !== KEY) return
    list = read()
    listener()
  }
  window.addEventListener('storage', onStorage)
  return () => {
    listeners.delete(listener)
    window.removeEventListener('storage', onStorage)
  }
}

export const compare = {
  /** Adds a home; when the list is already full, explains why instead. */
  add(slug: string) {
    if (list.includes(slug)) return true
    if (list.length >= MAX_COMPARE) {
      say(`You can compare ${MAX_COMPARE} homes at a time. Remove one to add ${designBySlug.get(slug)?.name ?? 'this home'}.`)
      return false
    }
    write([...list, slug])
    return true
  },
  toggle(slug: string) {
    if (list.includes(slug)) this.remove(slug)
    else this.add(slug)
  },
  remove(slug: string) {
    write(list.filter((s) => s !== slug))
  },
  set(slugs: string[]) {
    const next = clean(slugs)
    if (next.join() !== list.join()) write(next)
  },
}

export const useCompareList = () => useSyncExternalStore(subscribe, () => list)
export const useCompareNotice = () => useSyncExternalStore(subscribe, () => notice)
