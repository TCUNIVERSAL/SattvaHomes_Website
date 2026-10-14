import logo from '../assets/brand/sattva-logo.svg'

/** The Sattva Homes logo, linking home. Size it with `logoClassName` (a width; height follows). */
export function Brand({ className = '', logoClassName = 'w-[140px]' }: { className?: string; logoClassName?: string }) {
  return (
    <a href="#" aria-label="Sattva Homes home" className={`flex shrink-0 items-center ${className}`}>
      <img src={logo} alt="" width={541} height={350} className={`h-auto ${logoClassName}`} />
    </a>
  )
}
