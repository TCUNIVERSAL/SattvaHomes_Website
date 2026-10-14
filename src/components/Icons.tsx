import type { SVGProps } from 'react'

const base = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
  focusable: false,
} as const

export const PinIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base} {...p}>
    <path d="M19 10c0 6-7 11-7 11S5 16 5 10a7 7 0 1 1 14 0Z" />
    <circle cx="12" cy="10" r="2.5" />
  </svg>
)

export const ArrowRight = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base} {...p}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
)

export const ArrowUpRight = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base} {...p}>
    <path d="M7 17 17 7M8 7h9v9" />
  </svg>
)

export const SearchIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base} {...p}>
    <circle cx="11" cy="11" r="6.5" />
    <path d="m20 20-4.2-4.2" />
  </svg>
)

export const PhoneIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base} {...p}>
    <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" />
  </svg>
)

export const MailIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base} {...p}>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="m3 7 9 6 9-6" />
  </svg>
)

export const PlusIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base} {...p}>
    <path d="M12 5v14M5 12h14" />
  </svg>
)

export const MinusIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base} {...p}>
    <path d="M5 12h14" />
  </svg>
)

export const PlayIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base} {...p}>
    <path d="M8 5.5v13l10.5-6.5Z" />
  </svg>
)

export const PauseIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base} {...p}>
    <path d="M9 5.5v13M15 5.5v13" />
  </svg>
)

export const BedIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base} {...p}>
    <path d="M3 18v-5.5A2.5 2.5 0 0 1 5.5 10h13a2.5 2.5 0 0 1 2.5 2.5V18M3 15.5h18M5 10V6.5A1.5 1.5 0 0 1 6.5 5h11A1.5 1.5 0 0 1 19 6.5V10M8 10V8.5h3V10M13 10V8.5h3V10" />
  </svg>
)

export const BathIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base} {...p}>
    <path d="M3 12h18v2a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5v-2ZM6 12V6a2 2 0 0 1 3.7-1M7 19l-1 2M17 19l1 2" />
  </svg>
)

export const CarIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base} {...p}>
    <path d="M5 16H3.5v-3.5L5.5 8a2 2 0 0 1 1.8-1.2h9.4A2 2 0 0 1 18.5 8l2 4.5V16H19M9 16h6M3.5 12.5h17" />
    <circle cx="7" cy="16.5" r="1.8" />
    <circle cx="17" cy="16.5" r="1.8" />
  </svg>
)

export const SofaIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base} {...p}>
    <path d="M5 11V8a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v3M3 13a2 2 0 0 1 4 0v1h10v-1a2 2 0 0 1 4 0v4H3v-4ZM5 17v2M19 17v2" />
  </svg>
)

export const StoreyIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base} {...p}>
    <path d="M3.5 11 12 4l8.5 7M5.5 9.5V20h13V9.5M10 20v-5h4v5" />
  </svg>
)

export const RulerIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base} {...p}>
    <path d="M3 8h18v8H3zM7 8v3M11 8v4M15 8v3M19 8v4" />
  </svg>
)

export const CheckIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base} {...p}>
    <path d="m5 12.5 4.5 4.5L19 7.5" />
  </svg>
)

export const CloseIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base} {...p}>
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
)

export const CompareIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base} {...p}>
    <rect x="3" y="4" width="7.5" height="16" rx="1.5" />
    <rect x="13.5" y="4" width="7.5" height="16" rx="1.5" />
  </svg>
)

export const DownloadIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base} {...p}>
    <path d="M12 4v11M7 10.5l5 5 5-5M5 20h14" />
  </svg>
)

export const LinkIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base} {...p}>
    <path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1" />
  </svg>
)

export const SlidersIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base} {...p}>
    <path d="M4 7h9M17 7h3M4 17h3M11 17h9" />
    <circle cx="15" cy="7" r="2" />
    <circle cx="9" cy="17" r="2" />
  </svg>
)

export const ChevronRight = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base} {...p}>
    <path d="m9 6 6 6-6 6" />
  </svg>
)

export const ArrowLeft = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base} {...p}>
    <path d="M19 12H5M11 6l-6 6 6 6" />
  </svg>
)
