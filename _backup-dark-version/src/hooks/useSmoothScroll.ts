import { useEffect } from 'react'
import Lenis from 'lenis'

/**
 * Inertial smooth scrolling (Lenis) plus in-page link handling.
 * Skipped entirely when the visitor prefers reduced motion.
 * In-page links still move keyboard focus to their target, so skip links and nav stay accessible.
 */
export function useSmoothScroll() {
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const lenis = new Lenis({ autoRaf: true, lerp: 0.1, wheelMultiplier: 0.95 })

    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey) return
      const link = (event.target as Element | null)?.closest<HTMLAnchorElement>('a[href^="#"]')
      if (!link) return
      const id = link.getAttribute('href')!.slice(1)
      const target = id ? document.getElementById(id) : null
      if (id && !target) return
      event.preventDefault()
      // Lenis applies the CSS scroll-padding-top, so the fixed header is already accounted for.
      lenis.scrollTo(target ?? 0)
      history.pushState(null, '', id ? `#${id}` : location.pathname + location.search)
      const focusTarget = target ?? document.getElementById('main')
      if (focusTarget) {
        if (!focusTarget.hasAttribute('tabindex')) focusTarget.setAttribute('tabindex', '-1')
        focusTarget.focus({ preventScroll: true })
      }
    }

    document.addEventListener('click', onClick)
    return () => {
      document.removeEventListener('click', onClick)
      lenis.destroy()
    }
  }, [])
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
