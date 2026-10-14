import { Brand } from './Brand'

const footerLinks = [
  { href: '#collections', label: 'Our homes' },
  { href: '#difference', label: 'Why Sattva' },
  { href: '#contact', label: 'Let’s talk' },
]

export function Footer() {
  return (
    <footer className="border-t border-white/8 bg-night-2 px-5 pb-28 pt-14 sm:px-8 sm:pb-10 lg:px-12">
      <div className="mx-auto max-w-[1340px]">
        <div className="flex flex-col gap-8 pb-10 md:flex-row md:items-center md:justify-between">
          <Brand className="w-max" />
          <p className="font-serif text-[21px] leading-snug text-cream/85">
            Clarity before commitment.
            <br />
            A home <em className="text-champagne">delivered as agreed.</em>
          </p>
          <nav aria-label="Footer navigation" className="flex flex-wrap gap-7 text-[14px] text-cream/80">
            {footerLinks.map((link) => (
              <a key={link.href} href={link.href} className="nav-link hover:text-white">
                {link.label}
              </a>
            ))}
          </nav>
        </div>
        <div className="flex flex-col gap-6 border-t border-white/10 pt-7 text-[12px] leading-relaxed text-cream/60 md:flex-row md:items-end md:justify-between">
          <p className="max-w-[680px]">
            Sattva Homes acknowledges the Traditional Custodians of the land on which we live and work. We pay our respects to Elders past and
            present, and to all Aboriginal and Torres Strait Islander peoples.
          </p>
          <span className="whitespace-nowrap">© {new Date().getFullYear()} Sattva Homes</span>
        </div>
      </div>
    </footer>
  )
}

export function MobileBar() {
  return (
    <div className="glass-deep fixed inset-x-3 bottom-[max(12px,env(safe-area-inset-bottom))] z-40 grid grid-cols-2 gap-2 rounded-full p-1.5 sm:hidden">
      <a href="#collections" className="grid min-h-11 place-items-center rounded-full border border-white/20 text-[14px] font-medium text-cream">
        Our homes
      </a>
      <a href="#contact" className="grid min-h-11 place-items-center rounded-full bg-cream text-[14px] font-semibold text-night">
        Let’s talk
      </a>
    </div>
  )
}
