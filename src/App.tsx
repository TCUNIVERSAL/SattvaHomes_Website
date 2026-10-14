import { useEffect, useLayoutEffect, useRef } from 'react'
import { Header } from './components/Header'
import { Footer, MobileBar } from './components/Footer'
import { CompareTray } from './components/CompareTray'
import { HomePage } from './pages/HomePage'
import { DesignsPage } from './pages/DesignsPage'
import { DesignPage } from './pages/DesignPage'
import { ComparePage } from './pages/ComparePage'
import { NotFound } from './pages/NotFound'
import { jumpTo, jumpToElement, useSmoothScroll } from './hooks/useSmoothScroll'
import { lastList, parseRoute, useHash } from './lib/router'

// Where each view was scrolled to, so Back returns to the same spot (e.g. halfway down the results).
// The browser's own restoration is switched off so the two don't fight.
const scrollMemory = new Map<string, number>()
try {
  history.scrollRestoration = 'manual'
} catch {
  // Not allowed in some sandboxed frames; restoring still mostly works.
}

export default function App() {
  useSmoothScroll()
  const hash = useHash()
  const route = parseRoute(hash)
  const pageKey = route.page === 'design' ? `design/${route.slug}` : route.page
  const section = route.page === 'home' ? route.section : ''
  const previous = useRef<string | null>(null)

  if (route.page === 'designs') lastList.hash = hash

  useEffect(() => {
    const remember = () => scrollMemory.set(location.hash, window.scrollY)
    window.addEventListener('scroll', remember, { passive: true })
    return () => window.removeEventListener('scroll', remember)
  }, [])

  // After each navigation: a landing-page section scrolls into view; a new page starts at the top,
  // or where you left it; filter changes on the same page leave the scroll alone.
  useLayoutEffect(() => {
    const before = previous.current
    previous.current = pageKey
    const target = section ? document.getElementById(section) : null
    if (target) {
      jumpToElement(target)
      return
    }
    if (before === null || before === pageKey) return
    jumpTo(scrollMemory.get(location.hash) ?? 0)
    // Move focus to the new page's heading, so keyboard and screen-reader users start at the top of it.
    document.querySelector<HTMLElement>('main h1[tabindex]')?.focus({ preventScroll: true })
  }, [pageKey, section])

  return (
    <>
      <Header page={route.page} />
      <main id="main" className={route.page === 'home' ? undefined : 'pb-24'}>
        {route.page === 'home' && <HomePage />}
        {route.page === 'designs' && <DesignsPage query={route.query} />}
        {route.page === 'design' && <DesignPage key={route.slug} slug={route.slug} />}
        {route.page === 'compare' && <ComparePage query={route.query} />}
        {route.page === 'not-found' && <NotFound />}
      </main>
      <Footer />
      {route.page === 'home' ? <MobileBar /> : route.page !== 'compare' && <CompareTray />}
    </>
  )
}
