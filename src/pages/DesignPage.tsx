import { useEffect, useState } from 'react'
import { contact } from '../data/content'
import { designBySlug, designs, formatArea, formatMetres, series, storeyLabel, suitsLabel } from '../data/designs'
import { FloorPlanCard, FloorPlanViewer } from '../components/FloorPlan'
import { CompareToggle, HomeCard } from '../components/HomeCard'
import { ArrowRight, BathIcon, BedIcon, CarIcon, DownloadIcon, MailIcon, PhoneIcon, RulerIcon, SofaIcon } from '../components/Icons'
import { Breadcrumb, PageShell } from '../components/PageShell'
import { lastList, to } from '../lib/router'
import { NotFound } from './NotFound'

const mail = (subject: string, body: string) =>
  `mailto:${contact.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`

export function DesignPage({ slug }: { slug: string }) {
  const design = designBySlug.get(slug)
  const [planOpen, setPlanOpen] = useState<{ slug: string; floor: number } | null>(null)

  useEffect(() => {
    if (design) document.title = `${design.name} | ${series[design.series].name} collection | Sattva Homes`
  }, [design])

  if (!design) return <NotFound />

  const collection = series[design.series]
  // Nearest in size within the same collection: the natural next comparison.
  const similar = designs
    .filter((d) => d.slug !== design.slug && d.series === design.series)
    .sort((a, b) => Math.abs(a.area - design.area) - Math.abs(b.area - design.area))
    .slice(0, 3)

  const tiles = [
    { icon: BedIcon, value: design.bedrooms, label: 'Bedrooms' },
    { icon: BathIcon, value: design.bathrooms, label: 'Bathrooms' },
    { icon: CarIcon, value: design.cars, label: 'Car spaces' },
    { icon: SofaIcon, value: design.living, label: 'Living areas' },
  ].filter((tile) => tile.value !== null)

  // Pre-filled so the first message already carries what the team needs to answer properly.
  const enquiry = mail(
    `Enquiry: ${design.name} (${collection.name} collection)`,
    `Hi Sattva team,\n\nI’d like to know more about the ${design.name}.\n\nWhere I’m looking to build:\nMy block size (if I have one):\nBest time to call:\n\nThanks,`,
  )
  const blockCheck = mail(
    `Block check: ${design.name}`,
    `Hi Sattva team,\n\nCould you check whether the ${design.name} suits my block?\n\nBlock address or lot number:\nFrontage and depth:\n\nThanks,`,
  )

  return (
    <PageShell>
      <div className="mx-auto max-w-[1340px]">
        <Breadcrumb
          items={[
            { label: 'Home', href: '#' },
            { label: 'Home designs', href: lastList.hash },
            { label: collection.name, href: to('/designs', { series: design.series }) },
            { label: design.name },
          ]}
        />

        <section aria-labelledby="design-title" className="relative mt-6 overflow-hidden rounded-[32px] border border-white">
          {/* The photo, blurred and washed white, becomes the glass behind the panel */}
          <img src={design.image} alt="" aria-hidden="true" className="absolute inset-0 size-full scale-125 object-cover opacity-70 blur-3xl" />
          <div className="absolute inset-0 bg-paper/55" aria-hidden="true" />

          <div className="relative grid gap-3 p-2.5 sm:p-3 lg:grid-cols-[1.25fr_1fr]">
            <figure className="relative aspect-[4/3] overflow-hidden rounded-[24px] bg-mist lg:aspect-auto lg:min-h-[560px]">
              <img
                src={design.image}
                alt={`${design.name} facade, from the Sattva ${collection.name} collection`}
                className="absolute inset-0 size-full object-cover"
              />
              <span className="glass absolute left-4 top-4 rounded-full px-4 py-2 text-[10px] font-bold uppercase tracking-[.2em] text-ink">
                {collection.name} collection
              </span>
              <figcaption className="glass absolute bottom-4 left-4 rounded-full px-3 py-1 text-[11px] font-medium text-ink-soft">
                Facades vary
              </figcaption>
            </figure>

            <div className="glass-strong flex flex-col rounded-[24px] p-6 sm:p-8 lg:p-10">
              <p className="eyebrow">{storeyLabel(design.storeys)}</p>
              <h1 id="design-title" tabIndex={-1} className="mt-3 text-[clamp(2.6rem,1.9rem+2.2vw,3.6rem)] leading-[1.02] tracking-[-.02em]">
                {design.name}
              </h1>
              <p className="mt-2 font-serif text-[20px] italic text-bronze-deep">{collection.tagline}</p>

              <dl className={`mt-7 grid gap-2 ${tiles.length === 4 ? 'grid-cols-2 sm:grid-cols-4' : 'grid-cols-3'}`}>
                {tiles.map(({ icon: Icon, value, label }) => (
                  <div key={label} className="flex flex-col rounded-2xl border border-white bg-white/70 px-4 py-3.5">
                    <dt className="sr-only">{label}</dt>
                    <dd className="flex items-center gap-2 font-serif text-[28px] leading-none text-ink">
                      <Icon className="size-5 text-bronze-deep" />
                      {value}
                    </dd>
                    <dd aria-hidden="true" className="mt-1.5 text-[12px] font-medium text-ink-soft">
                      {label}
                    </dd>
                  </div>
                ))}
              </dl>

              <dl className="mt-5 divide-y divide-ink/10 border-y border-ink/10 text-[14px]">
                <Row label="Home size" value={formatArea(design.area)} large />
                <Row label="Width × length" value={`${formatMetres(design.width)} × ${formatMetres(design.length)}`} />
                <Row label="Designed for" value={suitsLabel(design.suits)} />
              </dl>

              <div className="mt-6 grid gap-2.5 sm:grid-cols-2">
                <a href={enquiry} className="btn btn-ink">
                  <MailIcon /> Enquire
                </a>
                <CompareToggle design={design} size="lg" />
              </div>
              <a
                href={design.brochure}
                target="_blank"
                rel="noopener"
                className="mt-5 inline-flex items-center gap-2 self-start text-[14px] font-semibold text-ink"
              >
                <DownloadIcon className="size-[18px] text-bronze-deep" />
                <span className="link-underline">Floor plan and brochure</span>
                <span className="text-[12px] font-medium text-ink-soft">(PDF)</span>
              </a>
              <p className="mt-auto pt-6 text-[12px] leading-relaxed text-ink-soft">
                Facades and inclusions vary. Dimensions are as drawn; we check every design against your block before you commit.
              </p>
            </div>
          </div>
        </section>

        {/* The plan itself: what people want to see next, without needing to download anything */}
        {(
          <section aria-labelledby="plan-title" className="glass mt-6 rounded-[28px] p-5 sm:p-8">
            <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
              <h2 id="plan-title" className="text-[26px] leading-tight">
                The <em>floor plan{design.storeys === 2 ? 's' : ''}.</em>
              </h2>
              <p className="text-[13px] text-ink-soft">{design.storeys === 2 ? 'Choose a floor, then tap' : 'Tap'} the plan to enlarge it and read the room sizes.</p>
            </div>
            <div className="mt-5 flex">
              <FloorPlanCard design={design} onOpen={(floor) => setPlanOpen({ slug: design.slug, floor })} />
            </div>
          </section>
        )}

        {/* Fit check: the first worry most people have, answered before they have to ask */}
        <section aria-labelledby="fit-title" className="glass mt-6 grid gap-6 rounded-[28px] p-6 sm:p-8 md:grid-cols-[auto_1fr_auto] md:items-center">
          <span className="grid size-14 place-items-center rounded-2xl bg-white/80 text-bronze-deep">
            <RulerIcon className="size-7" />
          </span>
          <div>
            <h2 id="fit-title" className="text-[26px] leading-tight">
              Will it fit <em>your block?</em>
            </h2>
            <p className="mt-2 max-w-[640px] text-[15px] leading-relaxed text-ink-soft">
              The {design.name} is {formatMetres(design.width)} wide and {formatMetres(design.length)} long, drawn for a{' '}
              {suitsLabel(design.suits)}. Setbacks and council rules change what fits, so send us your block and we’ll tell you
              what’s possible.
            </p>
          </div>
          <div className="flex flex-wrap gap-2.5">
            <a href={blockCheck} className="btn btn-outline">
              Ask us to check
            </a>
            <a href={contact.phoneHref} className="btn btn-outline">
              <PhoneIcon /> Call
            </a>
          </div>
        </section>

        {similar.length > 0 && (
          <section aria-labelledby="similar-title" className="mt-20">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <p className="eyebrow">Keep exploring</p>
                <h2 id="similar-title" className="display-2 mt-3 !text-[clamp(2rem,1.5rem+1.6vw,2.9rem)]">
                  Similar in <em>{collection.name}.</em>
                </h2>
              </div>
              <a href={to('/designs', { series: design.series })} className="link-underline self-start text-[14px] font-semibold text-ink sm:self-auto">
                See all {collection.name} homes
              </a>
            </div>
            <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {similar.map((d) => (
                <li key={d.slug} className="flex">
                  <HomeCard design={d} />
                </li>
              ))}
            </ul>
            <div className="mt-10 flex justify-center">
              <a href={lastList.hash} className="btn btn-outline">
                {lastList.hash === '#/designs' ? 'Back to all home designs' : 'Back to your results'} <ArrowRight />
              </a>
            </div>
          </section>
        )}
      </div>
      <FloorPlanViewer homes={[design]} open={planOpen} onChange={setPlanOpen} />
    </PageShell>
  )
}

function Row({ label, value, large = false }: { label: string; value: string; large?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-4 py-3.5">
      <dt className="font-medium text-ink-soft">{label}</dt>
      <dd className={`text-right ${large ? 'font-serif text-[24px] text-ink' : 'font-semibold text-ink'}`}>{value}</dd>
    </div>
  )
}
