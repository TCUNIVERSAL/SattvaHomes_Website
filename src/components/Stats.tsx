import { useEffect, useRef, useState } from 'react'
import { stats } from '../data/content'

// Same behaviour as the live site's counters: 0 up to the value over 2s, easing in and out (jQuery's "swing").
const DURATION = 2000
const swing = (p: number) => 0.5 - Math.cos(p * Math.PI) / 2
const format = (n: number) => n.toLocaleString('en-AU')

function Counter({ to, run }: { to: number; run: boolean }) {
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (!run) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setValue(to)
      return
    }
    const start = performance.now()
    let frame = 0
    const tick = (now: number) => {
      const progress = Math.min((now - start) / DURATION, 1)
      setValue(Math.round(to * swing(progress)))
      if (progress < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [run, to])

  return <>{format(value)}</>
}

export function Stats() {
  const ref = useRef<HTMLElement>(null)
  const [run, setRun] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    // Starts once the band's top passes 90% of the viewport height, as the live site does, and only once.
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        setRun(true)
        observer.disconnect()
      },
      { rootMargin: '0px 0px -10% 0px' },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <section ref={ref} aria-label="Sattva Homes in numbers" className="stats-fade bg-[#e5ebf4] px-5 py-16 sm:px-8 md:py-20 lg:px-12">
      <dl className="mx-auto grid max-w-[1340px] grid-cols-2 gap-x-6 gap-y-12 text-center md:grid-cols-4">
        {stats.map(({ to, label, prefix = '', suffix = '' }) => (
          <div key={label} className="flex flex-col-reverse items-center">
            {/* Bronze-deep, not bronze: small text needs 4.5:1 on this blue-grey */}
            <dt className="mt-3 text-[14px] font-medium text-bronze-deep sm:text-[16px]">{label}</dt>
            <dd className="font-serif text-[clamp(2.4rem,1.6rem+2.6vw,3.75rem)] leading-none tracking-[-0.02em] text-ink lining-nums tabular-nums">
              <span className="sr-only">
                {prefix}
                {format(to)}
                {suffix}
              </span>
              <span aria-hidden="true">
                {prefix}
                <Counter to={to} run={run} />
                {suffix}
              </span>
            </dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
