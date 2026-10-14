// The full home-design catalogue, as listed on sattva.com.au/home-designs (128 designs).
// Facade photos and brochure PDFs are still served from the current site's uploads folder;
// the three example homes use the local copies in src/assets.
import meadowlark from '../assets/images/meadowlark.webp'
import sunnydale from '../assets/images/sunnydale.jpg'
import birchfield from '../assets/images/birchfield.jpg'

export type SeriesKey = 'essence' | 'horizon' | 'meadowline'

export const series: Record<SeriesKey, { name: string; tagline: string; summary: string }> = {
  essence: {
    name: 'Essence',
    tagline: 'Everyday, beautifully considered.',
    summary: 'Single and double storey homes planned around everyday life, from narrow blocks up.',
  },
  horizon: {
    name: 'Horizon',
    tagline: 'Room to see life differently.',
    summary: 'Large double storey family homes with room for family time, and time to yourself.',
  },
  meadowline: {
    name: 'Meadowline',
    tagline: 'A fresh perspective on home.',
    summary: 'Single storey homes for 8.5 m to 16 m blocks, plus a handful of double storey designs.',
  },
}

export const seriesKeys = Object.keys(series) as SeriesKey[]

export type Design = {
  slug: string
  name: string
  series: SeriesKey
  storeys: 1 | 2
  bedrooms: number
  bathrooms: number
  cars: number | null
  living: number | null
  /** Floor area, m² */
  area: number
  /** Home length and width, m */
  length: number
  width: number
  /** The block the design is drawn for, e.g. "14m x 32m block" or "13.91m wide" */
  suits: string
  /** Narrowest block frontage it is drawn for, m (first figure in `suits`) */
  frontage: number
  image: string
  brochure: string
}

const UPLOADS = 'https://sattva.com.au/wp-content/uploads/'
const localImages: Record<string, string> = { meadowlark, 'sunnydale-house': sunnydale, birchfield }

type Row = [string, string, SeriesKey, 1 | 2, number, number, number | null, number | null, number, number, number, string, string, string]

// slug, name, series, storeys, bedrooms, bathrooms, car spaces, living areas, area, length, width, suits, image, brochure
const rows: Row[] = [
  ['birchfield', 'Birchfield', 'meadowline', 2, 4, 3, 2, 2, 307.97, 15.11, 12.35, '15.24m x 25m block', '2024/11/Birchfield.jpg', '2024/11/Birchfield.pdf'],
  ['springleaf', 'Springleaf', 'meadowline', 2, 4, 3, 2, 2, 307.97, 15.11, 12.35, '15.24m x 25m block', '2024/11/Springleaf.jpg', '2024/11/Springleaf.pdf'],
  ['morningwood', 'Morningwood', 'meadowline', 2, 3, 2, 2, 2, 281.99, 15.11, 11.99, '14m x 25m block', '2024/11/Morningwood.jpg', '2024/11/Morningwood.pdf'],
  ['woodfield', 'Woodfield', 'meadowline', 2, 4, 2, 1, 2, 245.96, 14.99, 11.27, '11.27m x 14.99m block', '2024/11/Woodfield.jpg', '2024/11/Woodfield.pdf'],
  ['whitelake', 'Whitelake', 'meadowline', 1, 3, 2, 1, 1, 174.54, 11.15, 18.59, '+16m x +25m block', '2024/11/Whitelake.jpg', '2024/11/Whitelake.pdf'],
  ['evergreen', 'Evergreen', 'meadowline', 1, 3, 2, 2, 2, 203.1, 10.07, 23.87, '+16m x +25m block', '2024/11/Evergreen.jpg', '2024/11/Evergreen.pdf'],
  ['woodmere', 'Woodmere', 'meadowline', 1, 3, 2, 2, 2, 226.52, 10.43, 26.39, '+16m x +25m block', '2024/11/Woodmere.jpg', '2024/11/Woodmere.pdf'],
  ['stonegate', 'Stonegate', 'meadowline', 1, 4, 2, 2, 3, 267.27, 11.27, 28.55, '+16m x +25m block', '2024/11/Stonegate.jpg', '2024/11/Stonegate.pdf'],
  ['hillcrest', 'Hillcrest', 'meadowline', 1, 4, 2, 2, 3, 279.95, 10.31, 31.07, '+16m x +25m block', '2024/11/Hillcrest.jpg', '2024/11/Hillcrest.pdf'],
  ['foxridge-22', 'Foxridge 22', 'meadowline', 1, 4, 3, 2, 3, 318.49, 10.43, 35.15, '+16m x +25m block', '2024/11/Foxridge.jpg', '2024/11/Foxridge.pdf'],
  ['brookhaven', 'Brookhaven', 'meadowline', 1, 4, 2, 2, 3, 296.72, 13.67, 29.39, '+16m x +25m block', '2024/11/Brookhaven.jpg', '2024/11/Brookhaven.pdf'],
  ['hazelwood', 'Hazelwood', 'meadowline', 1, 4, 2, 2, 3, 319.89, 13.67, 31.91, '+16m x +25m block', '2024/11/Hazelwood.jpg', '2024/11/Hazelwood.pdf'],
  ['primrose', 'Primrose', 'meadowline', 1, 4, 2, 2, 4, 413.96, 14.72, 38.75, '16m x 25m block', '2024/11/Primrose.jpg', '2024/11/Primrose.pdf'],
  ['crestwood', 'Crestwood', 'meadowline', 1, 4, 2, 2, 2, 228.19, 20.39, 12.71, '14m x 28m block', '2024/11/Crestwood.jpg', '2024/11/Crestwood.pdf'],
  ['glenhaven', 'Glenhaven', 'meadowline', 1, 4, 2, 2, 3, 265.84, 23.75, 12.71, '14m x 32m block', '2024/11/Glenhaven.jpg', '2024/11/Glenhaven.pdf'],
  ['ashwood', 'Ashwood', 'meadowline', 1, 4, 2, 2, 2, 232.83, 21.35, 12.47, '14m x 28m block', '2024/11/Ashwood.jpg', '2024/11/Ashwood.pdf'],
  ['hearthwood', 'Hearthwood', 'meadowline', 1, 4, 2, 2, 2, 255.56, 22.91, 12.59, '14m x 32m block', '2024/11/Hearthwood.jpg', '2024/11/Hearthwood.pdf'],
  ['cedarfield', 'Cedarfield', 'meadowline', 1, 3, 2, 2, 2, 187.35, 18.11, 11.27, '12.5m x 25m block', '2024/11/Cedarfield.jpg', '2024/11/Cedarfield.pdf'],
  ['brightwood-22', 'Brightwood 22', 'meadowline', 1, 4, 2, 2, 2, 208.66, 18.47, 12.59, '14m x 25m block', '2024/11/Brightwood-22.jpg', '2024/11/Brightwood-22.pdf'],
  ['copperwood', 'Copperwood', 'meadowline', 1, 3, 2, 2, 1, 155.09, 16.43, 11.27, '12.5m x 21m block', '2024/11/Copperwood.jpg', '2024/11/Copperwood.pdf'],
  ['edgewood', 'Edgewood', 'meadowline', 1, 3, 2, 2, 1, 160.12, 17.27, 11.27, '12.5m x 21m block', '2024/11/Edgewood-1.jpg', '2024/11/Edgewood.pdf'],
  ['northfield', 'Northfield', 'meadowline', 1, 4, 2, 2, 2, 268.32, 23.87, 12.59, '14m x 32m block', '2024/11/Northfield.jpg', '2024/11/Northfield.pdf'],
  ['holloway', 'Holloway', 'meadowline', 1, 3, 2, 2, 2, 196.06, 15.83, 14.39, '16m x 25m block', '2024/11/Holloway.jpg', '2024/11/Holloway.pdf'],
  ['sundance', 'Sundance', 'meadowline', 1, 4, 2, 2, 2, 231.98, 19.79, 14.75, '16m x 28m block', '2024/11/Sundance.jpg', '2024/11/Sundance.pdf'],
  ['rosemead', 'Rosemead', 'meadowline', 1, 4, 2, 2, 2, 263.62, 20.27, 14.75, '16m x 28m block', '2024/11/Rosemead.jpg', '2024/11/Rosemead.pdf'],
  ['lakeside', 'Lakeside', 'meadowline', 1, 4, 2, 2, 2, 286.09, 23.27, 14.75, '16m x 32m block', '2024/11/Lakeside.jpg', '2024/11/Lakeside.pdf'],
  ['silvercrest', 'Silvercrest', 'meadowline', 1, 4, 2, 2, 3, 271.53, 23.15, 14.75, '16m x 32m block', '2024/11/Silvercrest.jpg', '2024/11/Silvercrest.pdf'],
  ['brentwood-2', 'Brentwood', 'meadowline', 1, 4, 2, 2, 3, 299.19, 24.83, 13.91, '15.24m x 32m block', '2024/11/Brentwood.jpg', '2024/11/Brentwood.pdf'],
  ['pinemont', 'Pinemont', 'meadowline', 1, 4, 2, 2, 3, 305.5, 24.23, 14.75, '16m x 32m block', '2024/11/Pinemont.jpg', '2024/11/Pinemont.pdf'],
  ['oakgrove', 'Oakgrove', 'meadowline', 1, 4, 2, 2, 2, 209.33, 18.59, 12.71, '14m x 25m block', '2024/11/Oakgrove.jpg', '2024/11/Oakgrove.pdf'],
  ['mosswood', 'Mosswood', 'meadowline', 1, 4, 2, 2, 2, 229.61, 20.75, 12.59, '14m x 28m block', '2024/11/Mosswood.jpg', '2024/11/Mosswood.pdf'],
  ['harvest', 'Harvest', 'meadowline', 1, 3, 2, 1, 1, 136.65, 18.59, 8.5, '8.5m x 25m block', '2024/11/Harvest.jpg', '2024/11/Harvest.pdf'],
  ['rustic', 'Rustic', 'meadowline', 1, 3, 2, 1, 1, 137.4, 18.59, 8.5, '10m x 25m block', '2024/11/Rustic.jpg', '2024/11/Rustic.pdf'],
  ['summerdale', 'Summerdale', 'meadowline', 1, 4, 2, 2, 2, 205.31, 18.47, 12.95, '14m x 25m block', '2024/11/Summerdale.jpg', '2024/11/Summerdale.pdf'],
  ['ridgefield', 'Ridgefield', 'meadowline', 1, 4, 2, 2, 3, 245.08, 21.95, 13.19, '15.24m x 30m block', '2024/11/Ridgefield.jpg', '2024/11/Ridgefield.pdf'],
  ['shadybrook', 'Shadybrook', 'meadowline', 1, 4, 2, 2, 2, 266.28, 20.03, 14.75, '16m x 28m block', '2024/11/Shadybrook.jpg', '2024/11/Shadybrook.pdf'],
  ['lakeview', 'Lakeview', 'meadowline', 1, 4, 2, 2, 2, 233.57, 21.83, 12.59, '14m x 28m block', '2024/11/Lakeview.jpg', '2024/11/Lakeview.pdf'],
  ['riverstone', 'Riverstone', 'meadowline', 1, 4, 2, 2, 2, 242.16, 22.67, 12.59, '14m x 30m block', '2024/11/Riverstone.jpg', '2024/11/Riverstone.pdf'],
  ['springwood', 'Springwood', 'meadowline', 1, 4, 2, 2, 2, 262.21, 24.59, 12.59, '14m x 32m block', '2024/11/Springwood.jpg', '2024/11/Springwood.pdf'],
  ['eastwood', 'Eastwood', 'meadowline', 1, 4, 3, 2, 2, 293.03, 23.75, 14.75, '16m x 32m block', '2024/11/Eastwood.jpg', '2024/11/Eastwood.pdf'],
  ['westfield', 'Westfield', 'meadowline', 1, 4, 2, 2, 2, 235.31, 21.59, 12.23, '14m x 30m block', '2024/11/Westfield.jpg', '2024/11/Westfield.pdf'],
  ['brookview', 'Brookview', 'meadowline', 1, 4, 2, 2, 2, 270.47, 24.11, 12.47, '14m x 32m block', '2024/11/Brookview.jpg', '2024/11/Brookview.pdf'],
  ['highwood', 'Highwood', 'meadowline', 1, 4, 2, 2, 2, 267.02, 24.16, 12.35, '14m x 32m block', '2024/11/Highwood.jpg', '2024/11/Highwood.pdf'],
  ['waterbrook', 'Waterbrook', 'meadowline', 1, 3, 2, 2, 1, 155, 15.59, 11.27, '12.5m x 21m block', '2024/11/Waterbrook.jpg', '2024/11/Waterbrook.pdf'],
  ['greenhill', 'Greenhill', 'meadowline', 1, 4, 2, 2, 1, 192.08, 19.91, 11.27, '12.5m x 32m block', '2024/11/Greenhill.jpg', '2024/11/Greenhill.pdf'],
  ['cloverfield', 'Cloverfield', 'meadowline', 1, 4, 2, 2, 2, 208.27, 21.59, 11.03, '12.5m x 30m block', '2024/11/Cloverfield.jpg', '2024/11/Cloverfield.pdf'],
  ['parkwood', 'Parkwood', 'meadowline', 1, 4, 2, 2, 2, 219.98, 22.19, 11.27, '12.5m x 30m block', '2024/11/Parkwood.jpg', '2024/11/Parkwood.pdf'],
  ['goldenwood', 'Goldenwood', 'meadowline', 1, 4, 2, 2, 2, 224.4, 23.15, 11.15, '12.5m x 30m block', '2024/11/Goldenwood.jpg', '2024/11/Goldenwood.pdf'],
  ['briarfield', 'Briarfield', 'meadowline', 1, 4, 2, 2, 2, 235.46, 23.87, 11.27, '12.5m x 32m block', '2024/11/Briarfield.jpg', '2024/11/Briarfield.pdf'],
  ['ferncrest', 'Ferncrest', 'meadowline', 1, 4, 2, 2, 2, 233.3, 21.47, 12.35, '14m x 28m block', '2024/11/Ferncrest.jpg', '2024/11/Ferncrest.pdf'],
  ['edenwood', 'Edenwood', 'meadowline', 1, 4, 2, 2, 2, 238.82, 24.35, 11.27, '12.5m x 32m block', '2024/11/Edenwood.jpg', '2024/11/Edenwood.pdf'],
  ['cedarwood', 'Cedarwood', 'meadowline', 1, 4, 2, 2, 2, 263.99, 24.11, 12.35, '14m x 32m block', '2024/11/Cedarwood.jpg', '2024/11/Cedarwood.pdf'],
  ['rosehill', 'Rosehill', 'meadowline', 1, 4, 2, 2, 2, 267.29, 24.59, 12.23, '14m x 32m block', '2024/11/Rosehill.jpg', '2024/11/Rosehill.pdf'],
  ['cherryvale', 'Cherryvale', 'meadowline', 1, 4, 2, 2, 1, 176.09, 15.59, 12.71, '14m x 21m block', '2024/11/Cherryvale.jpg', '2024/11/Cherryvale.pdf'],
  ['stonehaven', 'Stonehaven', 'meadowline', 1, 3, 2, 2, 1, 156.61, 18.35, 10.43, '10.5m x 25m block', '2024/11/Stonehaven.jpg', '2024/11/Stonehaven.pdf'],
  ['seabrook', 'Seabrook', 'meadowline', 1, 3, 2, 2, 1, 180.06, 21.47, 9.47, '10.5m x 28m block', '2024/11/Seabrook.jpg', '2024/11/Seabrook.pdf'],
  ['ashford', 'Ashford', 'meadowline', 1, 3, 2, 1, 1, 158.56, 18.95, 9.11, '10.5m x 25m block', '2024/11/Ashford.jpg', '2024/11/Ashford.pdf'],
  ['wildwood', 'Wildwood', 'meadowline', 1, 4, 2, 2, 1, 183.94, 18.59, 11.15, '12.5m x 25m block', '2024/11/Wildwood.jpg', '2024/11/Wildwood.pdf'],
  ['greystone', 'Greystone', 'meadowline', 1, 4, 2, 2, null, 186.49, 18.71, 11.27, '12.5m x 25m block', '2024/11/Greystone.jpg', '2024/11/Greystone.pdf'],
  ['clearview', 'Clearview', 'meadowline', 1, 4, 2, 2, 2, 208.25, 21.35, 11.03, '12.5m x 28m block', '2024/11/Clearview.jpg', '2024/11/Clearview.pdf'],
  ['brightwood', 'Brightwood', 'meadowline', 1, 4, 2, 2, 2, 235.46, 23.87, 11.27, '12.5m x 32m block', '2024/11/Brightwood.jpg', '2024/11/Brightwood.pdf'],
  ['suncrest', 'Suncrest', 'meadowline', 1, 4, 2, 2, 2, 231.16, 21.71, 12.23, '14m x 28m block', '2024/11/Suncrest.jpg', '2024/11/Suncrest.pdf'],
  ['mapleton', 'Mapleton', 'meadowline', 1, 4, 2, 2, 2, 263.99, 24.11, 12.35, '14m x 32m block', '2024/11/Mapleton.jpg', '2024/11/Mapleton.pdf'],
  ['blossom', 'Blossom', 'meadowline', 1, 4, 2, 2, 2, 267.41, 24.59, 12.23, '12.23m x 32m block', '2024/11/Blossom.jpg', '2024/11/Blossom.pdf'],
  ['oakfield', 'Oakfield', 'meadowline', 1, 4, 2, 2, 2, 238.62, 23.75, 11.27, '12.5m x 32m block', '2024/11/Oakfield.jpg', '2024/11/Oakfield.pdf'],
  ['amberwood', 'Amberwood', 'meadowline', 1, 4, 2, 2, 2, 264.4, 24.59, 12.23, '14m x 32m block', '2024/11/Amberwood.jpg', '2024/11/Amberwood.pdf'],
  ['sunnydale-house', 'Sunnydale House', 'horizon', 2, 4, 3, 2, null, 515.6, 21.19, 15, '16m x 30m block', '2024/10/Sunnydale-House.jpg', '2024/10/Sunnydale-House.pdf'],
  ['brookstone-retreat', 'Brookstone Retreat', 'horizon', 2, 4, 3, 2, null, 497.02, 21.2, 15, '16m x 30m block', '2024/10/Brookstone-Retreat.jpg', '2024/10/Brookstone-Retreat.pdf'],
  ['whispering-pines', 'Whispering Pines', 'horizon', 2, 4, 4, 2, null, 515.6, 21.2, 15, '16m x 30m block', '2024/10/Whispering-Pines.jpg', '2024/10/Whispering-Pines.pdf'],
  ['parkside-meadows', 'Parkside Meadows', 'horizon', 2, 4, 3, 2, null, 497.02, 21.2, 15, '16m x 30m block', '2024/10/Parkside-Meadows.jpg', '2024/10/Parkside-Meadows.pdf'],
  ['hillside-haven', 'Hillside Haven', 'horizon', 2, 5, 4, 2, null, 473.79, 20.37, 14.05, '16.5m x 28m block', '2024/10/Hillside-Haven.jpg', '2024/10/Hillside-Haven.pdf'],
  ['lakeside-residence', 'Lakeside Residence', 'horizon', 2, 4, 4, 2, null, 515.6, 21.2, 15, '16m x 30m block', '2024/10/Lakeside-Residence.jpg', '2024/10/Lakeside-Residence.pdf'],
  ['cherrywood-cottage', 'Cherrywood Cottage', 'horizon', 2, 5, 3, 2, null, 520.26, 25.36, 14.3, '18m x 32.5m block', '2024/10/Cherrywood-Cottage.jpg', '2024/10/Cherrywood-Cottage.pdf'],
  ['oakridge-manor', 'Oakridge Manor', 'horizon', 2, 5, 5, 2, null, 575.98, 23.63, 13.75, '16m x 32m block', '2024/10/Oakridge-Manor.jpg', '2024/10/Oakridge-Manor.pdf'],
  ['maple-leaf-haven', 'Maple Leaf Haven', 'horizon', 2, 5, 5, 2, null, 464.5, 20.77, 12.4, '16m x 30m block', '2024/10/Maple-Leaf-Haven.jpg', '2024/10/Maple-Leaf-Haven.pdf'],
  ['cedarwood-estate', 'Cedarwood Estate', 'horizon', 2, 5, 5, 2, null, 399.47, 19.07, 11.9, '14m x 28m block', '2024/10/Cedarwood-Estate.jpg', '2024/10/Cedarwood-Estate.pdf'],
  ['suburban-sanctuary', 'Suburban Sanctuary', 'horizon', 2, 5, 5, 2, null, 557.4, 23.56, 13.6, '16m x 32m block', '2024/10/Suburban-Sanctuary.jpg', '2024/10/Suburban-Sanctuary.pdf'],
  ['willow-grove', 'Willow Grove', 'horizon', 2, 5, 3, 2, null, 520.26, 25, 15.6, '18m x 32m block', '2024/10/Willow-Grove.jpg', '2024/10/Willow-Grove.pdf'],
  ['meadowbrook-retreat', 'Meadowbrook Retreat', 'horizon', 2, 5, 5, 2, null, 613.14, 24.3, 15.8, '18m x 32m block', '2024/10/Meadowbrook-Retreat.jpg', '2024/10/Meadowbrook-Retreat.pdf'],
  ['sunnybrook', 'Sunnybrook', 'horizon', 2, 5, 4, 2, null, 464.5, 24.21, 12.08, '16m x 32m block', '2024/10/Sunnybrook.jpg', '2024/10/Sunnybrook.pdf'],
  ['woodcrest', 'Woodcrest', 'horizon', 2, 5, 5, 2, null, 557.4, 23, 14.12, '16.5m x 32m block', '2024/10/Woodcrest.jpg', '2024/10/Woodcrest.pdf'],
  ['brentwood', 'Brentwood', 'horizon', 2, 5, 5, 2, null, 631.72, 28.08, 16.3, '18m x 36m block', '2024/10/Brentwood.jpg', '2024/10/Brentwood.pdf'],
  ['highland', 'Highland', 'horizon', 2, 5, 5, 2, null, 631.72, 25.12, 15.37, '18m x 32m block', '2024/10/Highland.jpg', '2024/10/Highland.pdf'],
  ['clearwater', 'Clearwater', 'horizon', 2, 5, 6, 2, null, 557.4, 22, 14.45, '17m x 30m block', '2024/10/Clearwater.jpg', '2024/10/Clearwater.pdf'],
  ['woodhaven', 'Woodhaven', 'horizon', 2, 5, 5, 2, null, 650.3, 28.12, 15.37, '16.5m x 36m block', '2024/10/Woodhaven.jpg', '2024/10/Woodhaven.pdf'],
  ['stonebridge', 'Stonebridge', 'horizon', 2, 4, 2, 2, null, 436.63, 18.75, 16.5, '18.5m x 26m block', '2024/10/Stonebridge.jpg', '2024/10/Stonebridge.pdf'],
  ['sunridge', 'Sunridge', 'horizon', 2, 5, 5, 2, null, 715.33, 28.36, 15.7, '16m x 38m block', '2024/10/Sunridge.jpg', '2024/10/Sunridge.pdf'],
  ['foxridge', 'Foxridge', 'horizon', 2, 5, 6, 2, null, 650.32, 25.3, 13.59, '16m x 33m block', '2024/10/Foxridge.jpg', '2024/10/Foxridge.pdf'],
  ['meadowlark', 'Meadowlark', 'essence', 1, 4, 2, 2, null, 209.07, 18.83, 13.91, '13.91m wide', '2024/10/Meadowlark.webp', '2024/10/Meadowlark.pdf'],
  ['horizon', 'Horizon', 'essence', 2, 3, 2, 1, null, 164.06, 15.55, 4.5, '4.5m wide', '2024/10/Horizon.jpg', '2024/10/Horizon.pdf'],
  ['gardenwood', 'Gardenwood', 'essence', 2, 4, 2, null, null, 195.12, 16.23, 7, '7m wide', '2024/10/Gardenwood.jpg', '2024/10/Gardenwood.pdf'],
  ['pinehurst', 'Pinehurst', 'essence', 2, 4, 2, 2, null, 248.63, 19.6, 9.2, '9.2m wide', '2024/10/Pinehurst.jpg', '2024/10/Pinehurst.pdf'],
  ['greenacre', 'Greenacre', 'essence', 1, 3, 2, 2, null, 198.04, 20.58, 18.06, '18.06m wide', '2024/10/Greenacre.webp', '2024/10/Greenacre.pdf'],
  ['riverside', 'Riverside', 'essence', 2, 4, 2, 2, null, 279.7, 15.95, 15, '15m wide', '2024/10/Riverside.jpg', '2024/10/Riverside.pdf'],
  ['goldenrod', 'Goldenrod', 'essence', 1, 4, 2, 2, null, 220.16, 21.54, 11.33, '11.33m wide', '2024/10/Goldenrod.jpg', '2024/10/Goldenrod.pdf'],
  ['foxglove', 'Foxglove', 'essence', 1, 3, 2, 2, null, 254.67, 20.67, 15.67, '15.67m wide', '2024/10/Foxglove.jpg', '2024/10/Foxglove.pdf'],
  ['windermere', 'Windermere', 'essence', 2, 4, 2, 1, null, 197.34, 14.85, 6, '6m wide', '2024/10/Windermere.jpg', '2024/10/Windermere.pdf'],
  ['hearthstone', 'Hearthstone', 'essence', 1, 4, 2, 2, null, 251.13, 21.43, 13.74, '13.74m wide', '2024/10/Hearthstone.jpg', '2024/10/Hearthstone.pdf'],
  ['cottonwood', 'Cottonwood', 'essence', 1, 4, 2, 1, null, 181.48, 23.57, 8.99, '8.99m wide', '2024/10/Cottonwood.jpg', '2024/10/Cottonwood.pdf'],
  ['birchwood', 'Birchwood', 'essence', 1, 4, 2, 2, null, 213.37, 21.94, 11.51, '11.51m wide', '2024/10/Birchwood.jpg', '2024/10/Birchwood.pdf'],
  ['fieldstone', 'Fieldstone', 'essence', 1, 3, 2, 1, null, 149.37, 19.06, 8.99, '8.99m wide', '2024/10/Fieldstone.jpg', '2024/10/Fieldstone.pdf'],
  ['springdale', 'Springdale', 'essence', 2, 4, 2, 2, null, 235, 13.01, 13.01, '13.01m wide', '2024/10/Springdale.jpg', '2024/10/Springdale.pdf'],
  ['autumnwood', 'Autumnwood', 'essence', 1, 3, 2, 2, null, 185.8, 18.37, 11.3, '12.5m x 28m block', '2024/10/Autumnwood.jpg', '2024/10/Autumnwood.pdf'],
  ['sycamore', 'Sycamore', 'essence', 1, 3, 2, 2, null, 195.09, 23.65, 9.6, '11m x 32m block', '2024/10/Sycamore.jpg', '2024/10/Sycamore.pdf'],
  ['aspenwood', 'Aspenwood', 'essence', 1, 3, 2, 2, null, 222.97, 22.18, 11.1, '12.5m x 32m block', '2024/10/Aspenwood.jpg', '2024/10/Aspenwood.pdf'],
  ['magnolia', 'Magnolia', 'essence', 1, 4, 2, 2, null, 232.26, 22.97, 11.1, '12.5m x 32m block', '2024/10/Magnolia.jpg', '2024/10/Magnolia.pdf'],
  ['briarwood', 'Briarwood', 'essence', 1, 4, 2, 2, null, 232.26, 20.33, 12.3, '14m x 28m block', '2024/10/Briarwood.jpg', '2024/10/Briarwood.pdf'],
  ['harmony', 'Harmony', 'essence', 1, 4, 2, 2, null, 250.83, 21.56, 12.6, '14m x 30m block', '2024/10/Harmony.jpg', '2024/10/Harmony.pdf'],
  ['crescent', 'Crescent', 'essence', 1, 4, 2, 2, null, 260.12, 19.38, 14.6, '16m x 28m block', '2024/10/Crescent.jpg', '2024/10/Crescent.pdf'],
  ['rosewood', 'Rosewood', 'essence', 1, 4, 2, 2, null, 264.76, 22.68, 12.6, '14m x 32m block', '2024/10/Rosewood.jpg', '2024/10/Rosewood.pdf'],
  ['parkview', 'Parkview', 'essence', 1, 4, 2, 2, null, 260.12, 22.37, 12.6, '14m x 32m block', '2024/10/Parkview.jpg', '2024/10/Parkview.pdf'],
  ['sunset', 'Sunset', 'essence', 1, 4, 2, 2, null, 260.12, 22.33, 12.6, '14m x 32m block', '2024/10/Sunset.jpg', '2024/10/Sunset.pdf'],
  ['whispering', 'Whispering', 'essence', 1, 4, 2, 2, null, 260.12, 22.33, 12.6, '14m x 30m block', '2024/10/Whispering.jpg', '2024/10/Whispering.pdf'],
  ['pinecrest', 'Pinecrest', 'essence', 1, 4, 2, 2, null, 278.7, 23.18, 13, '16m x 32m block', '2024/10/Pinecrest.jpg', '2024/10/Pinecrest.pdf'],
  ['ridgeway', 'Ridgeway', 'essence', 1, 4, 2, 2, null, 306.57, 23.68, 13.9, '16m x 32m block', '2024/10/Ridgeway.jpg', '2024/10/Ridgeway.pdf'],
  ['cedarbrook', 'Cedarbrook', 'essence', 1, 4, 2, 2, null, 306.58, 22.6, 13.6, '16m x 32m block', '2024/10/Cedarbrook.jpg', '2024/10/Cedarbrook.pdf'],
  ['elmwood', 'Elmwood', 'essence', 1, 4, 2, 2, null, 334.44, 21.52, 16.6, '18m x 30m block', '2024/10/Elmwood.jpg', '2024/10/Elmwood.pdf'],
  ['greenfield', 'Greenfield', 'essence', 1, 4, 2, 2, null, 334.44, 22.52, 16.8, '18m x 30m block', '2024/10/Greenfield.jpg', '2024/10/Greenfield.pdf'],
  ['brookstone', 'Brookstone', 'essence', 2, 5, 4, 2, null, 371.6, 21.23, 13.05, '16m x 30m block', '2024/10/Brookstone.jpg', '2024/10/Brookstone.pdf'],
  ['sunnyvale', 'Sunnyvale', 'essence', 2, 5, 3, 2, null, 370.18, 20.97, 12.8, '15m x 28m block', '2024/10/Sunnyvale.jpg', '2024/10/Sunnyvale.pdf'],
  ['silverleaf', 'Silverleaf', 'essence', 2, 4, 2, 2, null, 380.09, 21.83, 11.8, '14m x 30m block', '2024/10/Silverleaf.jpg', '2024/10/Silverleaf.pdf'],
  ['fernwood', 'Fernwood', 'essence', 2, 5, 3, 2, null, 380.89, 20.97, 13.39, '14m x 28m block', '2024/10/Fernwood.jpg', '2024/10/Fernwood.pdf'],
  ['lakeshore', 'Lakeshore', 'essence', 2, 5, 3, 2, null, 380.89, 21, 11.27, '14m x 28m block', '2024/10/Lakeshore.jpg', '2024/10/Lakeshore.pdf'],
  ['hillside', 'Hillside', 'essence', 2, 4, 2, 2, null, 380.89, 21, 11.27, '14m x 30m block', '2024/10/Hillside.jpg', '2024/10/Hillside.pdf'],
  // Area, length and width for the next two are as published, but don't add up (e.g. 156 m² over 46 m x 34 m); worth checking with the team.
  ['mapleview', 'Mapleview', 'essence', 2, 5, 3, 2, null, 156, 46, 34, '14.5m x 30m block', '2024/10/Mapleview.jpg', '2024/10/Mapleview.pdf'],
  ['oakridge', 'Oakridge', 'essence', 2, 5, 3, 2, null, 145, 42, 38, '16m x 30m block', '2024/10/Oakridge.jpg', '2024/10/Oakridge.pdf'],
  ['willowcrest', 'Willowcrest', 'essence', 2, 4, 2, 2, null, 418.05, 20.64, 12.24, '14.5m x 28m block', '2024/10/Willowcrest.jpg', '2024/10/Willowcrest.pdf'],
  ['meadowbrook', 'Meadowbrook', 'essence', 2, 4, 4, 2, null, 427.34, 21.44, 12.92, '16m x 30m block', '2024/10/Meadowbrook.jpg', '2024/10/Meadowbrook.pdf'],
]

export const designs: Design[] = rows.map(
  ([slug, name, seriesKey, storeys, bedrooms, bathrooms, cars, living, area, length, width, suits, image, brochure]) => ({
    slug,
    name,
    series: seriesKey,
    storeys,
    bedrooms,
    bathrooms,
    cars,
    living,
    area,
    length,
    width,
    suits,
    frontage: parseFloat(suits.replace(/^\+/, '')),
    image: localImages[slug] ?? UPLOADS + image,
    brochure: UPLOADS + brochure,
  }),
)

export const designBySlug = new Map(designs.map((d) => [d.slug, d]))

export const formatArea = (m2: number) => `${m2.toLocaleString('en-AU', { maximumFractionDigits: 2 })} m²`
export const formatMetres = (m: number) => `${m.toLocaleString('en-AU', { maximumFractionDigits: 2 })} m`
export const storeyLabel = (s: 1 | 2) => (s === 1 ? 'Single storey' : 'Double storey')

/** "14m x 32m block" → "14 m × 32 m block"; "13.91m wide" → "13.91 m wide block" */
export const suitsLabel = (suits: string) =>
  suits.replace(/(\d)m/g, '$1 m').replace(' x ', ' × ').replace(/wide$/, 'wide block')
