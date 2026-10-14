import { useCallback, useEffect, useRef, useState } from 'react'
import { navLinks } from '../data/content'
import { useScrolledPast } from '../hooks/useSmoothScroll'
import { SearchIcon } from './Icons'
import { Brand } from './Brand'

export function Header() {
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
        className="fixed left-5 top-[-80px] z-[90] rounded-full bg-cream px-5 py-3 text-sm font-semibold text-night focus:top-5"
      >
        Skip to content
      </a>

      <header
        className="site-header fixed inset-x-0 top-0 z-50 pt-[env(safe-area-inset-top)]"
        data-scrolled={scrolled || open}
      >
        <div
          className={`mx-auto flex max-w-[1440px] items-center justify-between gap-6 px-5 transition-[height] duration-500 sm:px-8 lg:px-12 ${
            scrolled ? 'h-[72px]' : 'h-[88px]'
          }`}
        >
          <Brand />

          <nav aria-label="Main navigation" className="ml-auto hidden items-center gap-9 text-[14px] text-cream/90 md:flex">
            {navLinks.map((link) => (
              <a key={link.href} href={link.href} className="nav-link hover:text-white">
                {link.label}
              </a>
            ))}
            <a
              href="#finder"
              aria-label="Find your home"
              className="grid size-10 place-items-center rounded-full text-cream/90 transition-colors hover:bg-white/10 hover:text-white"
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
            className="grid size-11 place-items-center rounded-full border border-white/25 md:hidden"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
          >
            <span className="relative block h-3 w-5" aria-hidden="true">
              <span
                className={`absolute left-0 h-[1.5px] w-5 bg-cream transition-all duration-300 ${open ? 'top-1.5 rotate-45' : 'top-0'}`}
              />
              <span
                className={`absolute left-0 h-[1.5px] w-5 bg-cream transition-all duration-300 ${open ? 'top-1.5 -rotate-45' : 'top-3'}`}
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
        className="glass-deep fixed inset-x-4 top-[calc(84px+env(safe-area-inset-top))] z-40 flex flex-col gap-1 rounded-3xl p-3 md:hidden"
      >
        {[...navLinks, { href: '#contact', label: 'Let’s talk' }].map((link) => (
          <a
            key={link.href}
            href={link.href}
            onClick={() => setOpen(false)}
            className="rounded-2xl px-4 py-4 font-serif text-2xl text-cream hover:bg-white/8"
          >
            {link.label}
          </a>
        ))}
      </nav>
    </>
  )
}
