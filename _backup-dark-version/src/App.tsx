import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { PromiseBar } from './components/PromiseBar'
import { Collections } from './components/Collections'
import { Difference } from './components/Difference'
import { Journey } from './components/Journey'
import { Questions } from './components/Questions'
import { Contact } from './components/Contact'
import { Footer, MobileBar } from './components/Footer'
import { useSmoothScroll } from './hooks/useSmoothScroll'

export default function App() {
  useSmoothScroll()

  return (
    <>
      <Header />
      <main id="main">
        <Hero />
        <PromiseBar />
        <Collections />
        <Difference />
        <Journey />
        <Questions />
        <Contact />
      </main>
      <Footer />
      <MobileBar />
    </>
  )
}
