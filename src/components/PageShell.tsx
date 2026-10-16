import type { ReactNode } from 'react'

/** Frame for every page after the landing page: room for the fixed header, and soft light for the glass to catch. */
export function PageShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative isolate overflow-clip px-4 pb-16 pt-[104px] sm:px-6 md:pt-[128px] lg:px-12">
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[900px]">
        <div className="absolute -left-[10%] -top-[10%] size-[620px] rounded-full bg-[radial-gradient(circle,rgb(207_224_245/.95),transparent_65%)]" />
        <div className="absolute -right-[8%] top-[18%] size-[560px] rounded-full bg-[radial-gradient(circle,rgb(236_220_194/.85),transparent_65%)]" />
      </div>
      {children}
    </div>
  )
}

export function Breadcrumb({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-2 text-[13px] font-medium text-ink-soft">
        {items.map((item, i) => (
          <li key={item.label} className="flex items-center gap-2">
            {i > 0 && (
              <span aria-hidden="true" className="text-ink/30">
                /
              </span>
            )}
            {item.href ? (
              <a href={item.href} className="hover:text-ink">
                {item.label}
              </a>
            ) : (
              <span aria-current="page" className="text-ink">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
