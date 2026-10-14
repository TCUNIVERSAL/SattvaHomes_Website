import { useEffect } from 'react'
import Lenis from 'lenis'
import { isRouteHash } from '../lib/router'

let lenis: Lenis | null = null

/**
 * Inertial smooth scrolling (Lenis) plus in-page link handling.
 * Skipped entirely when the visitor prefers reduced motion.
 * In-page links still move keyboard focus to their target, so skip links and nav stay accessible.
 * Route links ("#/designs") and links to landing-page sections from another page are left to the router.
 */
export function useSmoothScroll() {
  useEffect(() => {
    if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
      lenis = new Lenis({ autoRaf: true, lerp: 0.1, wheelMultiplier: 0.95 })
    }

    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey) return
      const link = (event.target as Element | null)?.closest<HTMLAnchorElement>('a[href^="#"]')
      if (!link) return
      const id = link.getAttribute('href')!.slice(1)
      const target = id ? document.getElementById(id) : null
      const onRoute = isRouteHash(location.hash)
      // No target on this page (a route, or a landing section seen from another page): let the hash change.
      if ((id && !target) || (onRoute && !target)) return
      event.preventDefault()
      // Lenis applies the CSS scroll-padding-top, so the fixed header is already accounted for.
      if (lenis) lenis.scrollTo(target ?? 0)
      else if (target) target.scrollIntoView({ behavior: 'smooth' })
      else window.scrollTo({ top: 0, behavior: 'smooth' })
      // On a route page (e.g. the skip link), keep the route in the address bar.
      if (!onRoute) {
        try {
          history.pushState(null, '', id ? `#${id}` : location.pathname + location.search)
        } catch {
          // Sandboxed frames may refuse history changes; scrolling still works.
        }
      }
      const focusTarget = target ?? document.getElementById('main')
      if (focusTarget) {
        if (!focusTarget.hasAttribute('tabindex')) focusTarget.setAttribute('tabindex', '-1')
        focusTarget.focus({ preventScroll: true })
      }
    }

    document.addEventListener('click', onClick)
    return () => {
      document.removeEventListener('click', onClick)
      lenis?.destroy()
      lenis = null
    }
  }, [])
}

/** Jumps (no animation) to a scroll position, after the new page has rendered. */
export function jumpTo(y: number) {
  if (lenis) {
    lenis.resize()
    lenis.scrollTo(y, { immediate: true, force: true })
  } else {
    window.scrollTo({ top: y, behavior: 'instant' })
  }
}

/** Jumps to an element, allowing for the fixed header. */
export function jumpToElement(el: HTMLElement) {
  if (lenis) {
    lenis.resize()
    lenis.scrollTo(el, { immediate: true, force: true })
  } else {
    el.scrollIntoView({ behavior: 'instant' })
  }
}

/** True once the page has scrolled past `threshold` pixels. */
export function useScrolledPast(threshold: number, onChange: (past: boolean) => void) {
  useEffect(() => {
    let last: boolean | null = null
    const check = () => {
      const past = window.scrollY > threshold
      if (past !== last) {
        last = past
        onChange(past)
      }
    }
    check()
    window.addEventListener('scroll', check, { passive: true })
    return () => window.removeEventListener('scroll', check)
  }, [threshold, onChange])
}
