import { useEffect } from 'react'
import { ArrowRight } from '../components/Icons'
import { Breadcrumb, PageShell } from '../components/PageShell'

const models = [
  { name: 'Whitewood Avenue', href: 'https://sattvahomes-ten.vercel.app/' },
  { name: '68 Boundary road - CAMPHILL', href: 'https://house-68.vercel.app/' },
  { name: '70 Boundary road -CAMP HILL', href: 'https://house-70.vercel.app/' },
]

export function ModelsPage() {
  useEffect(() => {
    document.title = 'Explore 3D home models | Sattva Homes'
  }, [])

  return (
    <PageShell>
      <div className="mx-auto max-w-[1340px]">
        <Breadcrumb items={[{ label: 'Home', href: '#' }, { label: '3D home models' }]} />

        <header className="mt-8 max-w-[700px]">
          <p className="eyebrow">Choose a home to explore</p>
          <h1 tabIndex={-1} className="display-2 mt-4">
            Step inside a <em>3D model.</em>
          </h1>
          <p className="mt-4 max-w-[570px] text-[16px] leading-relaxed text-ink-soft">
            Select a home to open its interactive model and explore the design in detail.
          </p>
        </header>

        <ul className="mt-9 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {models.map((model, index) => (
            <li key={model.href}>
              <a
                href={model.href}
                aria-label={`Open the ${model.name} 3D model`}
                className="home-card group flex h-full flex-col overflow-hidden rounded-[28px] border border-white bg-white/65 p-2 shadow-[0_20px_50px_-36px_rgb(31_43_66/.4)] focus-visible:outline-offset-4"
              >
                {/* Photo slots are ready for the model images when they are supplied. */}
                <div className="relative grid aspect-[4/3] place-items-center overflow-hidden rounded-[21px] bg-[radial-gradient(ellipse_at_52%_72%,rgb(255_255_255/.95),transparent_40%),linear-gradient(145deg,#e8eef3,#dce6ee_55%,#f3eee6)]">
                  <div aria-hidden="true" className="absolute inset-0 opacity-40 [background-image:linear-gradient(rgb(255_255_255/.45)_1px,transparent_1px),linear-gradient(90deg,rgb(255_255_255/.45)_1px,transparent_1px)] [background-size:34px_34px]" />
                  <svg aria-hidden="true" viewBox="0 0 240 150" className="relative w-[54%] text-bronze-deep/60 transition-transform duration-700 ease-[var(--ease-expo)] group-hover:scale-[1.04]">
                    <path d="m36 75 82-47 85 47v54H36V75Z" fill="rgb(255 255 255 / .55)" stroke="currentColor" strokeWidth="2" />
                    <path d="m27 74 91-53 94 53M68 129V84h39v45m22-43h37v27h-37zM49 94h10m0 10H49m131-10h10m0 10h-10" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                    <path d="m28 132 90-22 92 22" fill="none" stroke="rgb(255 255 255 / .9)" strokeWidth="2" />
                  </svg>
                  <span className="glass absolute left-4 top-4 rounded-full px-3 py-1.5 text-[10px] font-bold uppercase tracking-[.18em] text-ink">
                    Model {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="absolute bottom-4 right-4 rounded-full border border-white/80 bg-white/65 px-3 py-1.5 text-[11px] font-medium text-ink-soft backdrop-blur-md">
                    Photo coming soon
                  </span>
                </div>

                <div className="flex flex-1 items-end justify-between gap-4 px-4 pb-4 pt-5 sm:px-5">
                  <h2 className="max-w-[75%] text-[24px] leading-[1.15]">{model.name}</h2>
                  <span aria-hidden="true" className="grid size-11 shrink-0 place-items-center rounded-full bg-ink text-white transition-transform duration-300 group-hover:translate-x-1">
                    <ArrowRight className="size-5" />
                  </span>
                </div>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </PageShell>
  )
}
