import { useCallback, useEffect, useRef, useState } from 'react'
import { navLinks } from '../data/content'
import { useScrolledPast } from '../hooks/useSmoothScroll'
import type { Route } from '../lib/router'
import { SearchIcon } from './Icons'
import { Brand } from './Brand'

export function Header({ page }: { page: Route['page'] }) {
  // "Home designs" is the current section on the catalogue, a home's page and compare.
  const inDesigns = page === 'designs' || page === 'design' || page === 'compare'
  const current = (href: string) => (href === '#/designs' && inDesigns ? ('page' as const) : undefined)

  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const toggleRef = useRef<HTMLButtonElement>(null)

  useScrolledPast(40, useCallback((past: boolean) => setScrolled(past), []))

  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false)
        toggleRef.current?.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <>
      <a
        href="#main"
        className="fixed left-5 top-[-80px] z-[90] rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white focus:top-5"
      >
        Skip to content
      </a>

      <header
        className="site-header fixed inset-x-0 top-0 z-50 pt-[env(safe-area-inset-top)]"
        data-scrolled={scrolled || open}
      >
        <div
          className={`mx-auto flex max-w-[1440px] items-center justify-between gap-6 px-5 transition-[height] duration-500 sm:px-8 lg:px-12 ${
            scrolled ? 'h-[72px]' : 'h-[92px] min-[961px]:h-[108px]'
          }`}
        >
          <Brand
            logoClassName={`transition-[width] duration-500 ${scrolled ? 'w-[96px]' : 'w-[112px] min-[961px]:w-[140px]'}`}
          />

          <nav aria-label="Main navigation" className="ml-auto hidden items-center gap-5 min-[1100px]:gap-9 text-[14px] font-medium text-ink md:flex">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                aria-current={current(link.href)}
                className="nav-link hover:text-bronze-deep aria-[current=page]:bg-[length:100%_1px] aria-[current=page]:text-bronze-deep"
              >
                {link.label}
              </a>
            ))}
            <a
              href={page === 'home' ? '#finder' : '#/designs'}
              aria-label="Find your home"
              className="grid size-10 place-items-center rounded-full text-ink transition-colors hover:bg-white/70"
            >
              <SearchIcon className="size-[19px]" />
            </a>
          </nav>

          <a href="#contact" className="btn btn-outline hidden !min-h-[46px] md:inline-flex">
            Let’s talk
          </a>

          <button
            ref={toggleRef}
            type="button"
            className="grid size-11 place-items-center rounded-full border border-ink/20 bg-white/50 md:hidden"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
          >
            <span className="relative block h-3 w-5" aria-hidden="true">
              <span
                className={`absolute left-0 h-[1.5px] w-5 bg-ink transition-all duration-300 ${open ? 'top-1.5 rotate-45' : 'top-0'}`}
              />
              <span
                className={`absolute left-0 h-[1.5px] w-5 bg-ink transition-all duration-300 ${open ? 'top-1.5 -rotate-45' : 'top-3'}`}
              />
            </span>
          </button>
        </div>
      </header>

      {/* Kept outside the header so its own glass can blur the page behind it. */}
      <nav
        id="mobile-menu"
        aria-label="Mobile navigation"
        hidden={!open}
        className={`glass-strong fixed inset-x-4 z-40 flex flex-col gap-1 rounded-3xl p-3 md:hidden ${
          scrolled ? 'top-[calc(84px+env(safe-area-inset-top))]' : 'top-[calc(100px+env(safe-area-inset-top))]'
        }`}
      >
        {[...navLinks, { href: '#contact', label: 'Let’s talk' }].map((link) => (
          <a
            key={link.href}
            href={link.href}
            aria-current={current(link.href)}
            onClick={() => setOpen(false)}
            className="rounded-2xl px-4 py-4 font-serif text-2xl text-ink hover:bg-white/80"
          >
            {link.label}
          </a>
        ))}
      </nav>
    </>
  )
}
