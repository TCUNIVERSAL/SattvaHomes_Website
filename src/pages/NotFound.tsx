import { useEffect } from 'react'
import { PageShell } from '../components/PageShell'
import { ArrowRight } from '../components/Icons'

export function NotFound() {
  useEffect(() => {
    document.title = 'Page not found | Sattva Homes'
  }, [])

  return (
    <PageShell>
      <div className="glass-strong mx-auto max-w-[720px] rounded-[32px] p-8 text-center sm:p-14">
        <p className="eyebrow">Page not found</p>
        <h1 tabIndex={-1} className="display-2 mt-4">
          This page has <em>moved.</em>
        </h1>
        <p className="mx-auto mt-4 max-w-[420px] text-[16px] leading-relaxed text-ink-soft">
          The link may be old, or the design may have been renamed. Everything we build is in the catalogue.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <a href="#/designs" className="btn btn-ink">
            Browse home designs <ArrowRight />
          </a>
          <a href="#" className="btn btn-outline">
            Back to the home page
          </a>
        </div>
      </div>
    </PageShell>
  )
}
