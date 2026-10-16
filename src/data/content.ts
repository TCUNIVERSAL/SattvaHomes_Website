// All wording, links and home data come from the current Sattva Homes site.
import meadowlark from '../assets/images/meadowlark.webp'
import sunnydale from '../assets/images/sunnydale.jpg'
import birchfield from '../assets/images/birchfield.jpg'

export const contact = {
  phone: '07 3708 1091',
  phoneHref: 'tel:+61737081091',
  email: 'info@sattva.com.au',
  emailHref: 'mailto:info@sattva.com.au?subject=Let%E2%80%99s%20talk%20about%20my%20home',
  mapsHref: 'https://www.google.com/maps/search/?api=1&query=71+Waters+Street+Willawong+QLD+4110',
}

export const navLinks = [
  { href: '#/designs', label: 'Home designs' },
  { href: '#difference', label: 'Why Sattva' },
  { href: '#house-model', label: '3D House model' },
]

// Track-record counters, as shown on the sattva.com.au home page.
export const stats = [
  { to: 120, suffix: '+', label: 'Home Project Completed' },
  { to: 20, suffix: '+', label: 'Projects In Progress' },
  { to: 30000, label: 'Sq Meter Built & Counting' },
  { to: 40, prefix: '$', suffix: ' mn+', label: 'Worth Houses Built' },
]

export const promises = ['Clarity before commitment', 'Personal, from day one', 'A home delivered as agreed']

// Hero home finder. Bedrooms and bathrooms are minimums ("4+"); results open on the home designs page.
export const finder = {
  storeys: [
    { value: '', label: 'Any' },
    { value: '1', label: 'Single storey' },
    { value: '2', label: 'Double storey' },
  ],
  bedrooms: ['', '3', '4', '5'],
  bathrooms: ['', '2', '3', '4', '5'],
}

export type CollectionKey = 'essence' | 'horizon' | 'meadowline'

type Collection = {
  key: CollectionKey
  /** The example home's page in the catalogue */
  slug: string
  number: string
  series: string
  tagline: string
  name: string
  description: string
  image: string
  specs: [string, string][]
  area: string
}

export const collections: Collection[] = [
  {
    key: 'essence',
    slug: 'meadowlark',
    number: '01',
    series: 'Essence',
    tagline: 'Everyday, beautifully considered.',
    name: 'Meadowlark',
    description: 'A four-bedroom home, planned around everyday life.',
    image: meadowlark,
    specs: [['4', 'Bedrooms'], ['2', 'Bathrooms'], ['2', 'Car spaces']],
    area: '209.07 m²',
  },
  {
    key: 'horizon',
    slug: 'sunnydale-house',
    number: '02',
    series: 'Horizon',
    tagline: 'Room to see life differently.',
    name: 'Sunnydale House',
    description: 'Room for family time, and time to yourself.',
    image: sunnydale,
    specs: [['4', 'Bedrooms'], ['3', 'Bathrooms'], ['2', 'Car spaces']],
    area: '515.60 m²',
  },
  {
    key: 'meadowline',
    slug: 'birchfield',
    number: '03',
    series: 'Meadowline',
    tagline: 'A fresh perspective on home.',
    name: 'Birchfield',
    description: 'Space that grows with your next chapter.',
    image: birchfield,
    specs: [['12.35 m', 'Width'], ['15.11 m', 'Length']],
    area: '307.97 m²',
  },
]

export const faqs = [
  { q: 'Do I need land first?', a: 'No. Talk to us while you’re still looking, and we’ll help with your next step.' },
  { q: 'Can I change a design?', a: 'Bring your ideas. We’ll tell you what’s possible for your block and budget.' },
  { q: 'What should I check before signing?', a: 'Design, inclusions, site costs, price and timing. If anything is unclear, ask us.' },
  // The last answer carries a phone link, rendered in Questions.tsx.
  { q: 'Can I see a home in person?', a: 'Yes. There’s a display home in Willawong.' },
]
