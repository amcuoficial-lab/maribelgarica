import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import HeroSection from '../components/home/HeroSection'
import AboutSection from '../components/home/AboutSection'
import TrajectorySection from '../components/home/TrajectorySection'
import FestivalSection from '../components/home/FestivalSection'
import PodcastSection from '../components/home/PodcastSection'
import BooksSection from '../components/home/BooksSection'
import ContactSection from '../components/home/ContactSection'

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <AboutSection />
        <TrajectorySection />
        <FestivalSection />
        <PodcastSection />
        <BooksSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  )
}
