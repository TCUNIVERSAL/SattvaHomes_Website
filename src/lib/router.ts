import { useSyncExternalStore } from 'react'

/**
 * Hash routes, so the built site keeps working from any folder and as a single packed HTML file.
 *   #/designs?series=essence   catalogue (filters live in the query string, so results can be shared)
 *   #/designs/meadowlark       one home
 *   #/compare?homes=a,b,c      side-by-side comparison
 * Anything else ("", "#contact") is the landing page, scrolled to that section.
 */
export type Route =
  | { page: 'home'; section: string }
  | { page: 'designs'; query: URLSearchParams }
  | { page: 'design'; slug: string }
  | { page: 'compare'; query: URLSearchParams }
  | { page: 'not-found' }

const subscribe = (onChange: () => void) => {
  window.addEventListener('hashchange', onChange)
  window.addEventListener('popstate', onChange)
  return () => {
    window.removeEventListener('hashchange', onChange)
    window.removeEventListener('popstate', onChange)
  }
}

export const useHash = () => useSyncExternalStore(subscribe, () => location.hash)

export const isRouteHash = (hash: string) => hash.startsWith('#/')

export function parseRoute(hash: string): Route {
  if (!isRouteHash(hash)) return { page: 'home', section: hash.slice(1) }
  const [path, search = ''] = hash.slice(1).split('?')
  const parts = path.split('/').filter(Boolean)
  const query = new URLSearchParams(search)
  if (parts.length === 0) return { page: 'home', section: '' }
  if (parts[0] === 'designs' && parts.length === 1) return { page: 'designs', query }
  if (parts[0] === 'designs' && parts.length === 2) return { page: 'design', slug: decodeURIComponent(parts[1]) }
  if (parts[0] === 'compare' && parts.length === 1) return { page: 'compare', query }
  return { page: 'not-found' }
}

/** Builds a route link: to('/designs', { series: 'essence' }) → "#/designs?series=essence". Empty values are left out. */
export function to(path: string, params: Record<string, string | number | undefined | null> = {}) {
  const query = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== '') query.set(key, String(value))
  }
  const search = query.toString()
  return `#${path}${search ? `?${search}` : ''}`
}

/** Swaps the current URL without adding a history entry (filter changes), then tells the router. */
export function replaceHash(hash: string) {
  if (hash === location.hash) return
  try {
    history.replaceState(history.state, '', hash)
  } catch {
    // Sandboxed frames may refuse history changes; location.replace never reloads for a hash.
    location.replace(hash)
    return
  }
  window.dispatchEvent(new HashChangeEvent('hashchange'))
}

/** The last catalogue view (with its filters), so "back to home designs" returns to the same results. */
export const lastList = { hash: '#/designs' }
