import mark from '../assets/brand/logo-mark-light.webp'
import word from '../assets/brand/logo-word-light.webp'

export function Brand({ className = '' }: { className?: string }) {
  return (
    <a href="#" aria-label="Sattva Homes home" className={`flex shrink-0 items-center gap-2.5 ${className}`}>
      <img src={mark} alt="" width={160} height={159} className="h-auto w-10 sm:w-11" />
      <img src={word} alt="" width={480} height={133} className="h-auto w-[104px] sm:w-[118px]" />
    </a>
  )
}
