import { useEffect } from 'react'
import { Hero } from '../components/Hero'
import { PromiseBar } from '../components/PromiseBar'
import { Collections } from '../components/Collections'
import { Stats } from '../components/Stats'
import { AerialFilm } from '../components/AerialFilm'
import { FamilyMoments } from '../components/FamilyMoments'
import { HouseModel } from '../components/HouseModel'
import { Questions } from '../components/Questions'
import { Contact } from '../components/Contact'

export function HomePage() {
  useEffect(() => {
    document.title = 'Sattva Homes | Queensland Home Builder'
  }, [])

  return (
    <>
      <Hero />
      <PromiseBar />
      <Collections />
      <Stats />
      <AerialFilm />
      <FamilyMoments />
      <HouseModel />
      <Questions />
      <Contact />
    </>
  )
}
