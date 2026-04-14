import { useSiteData } from '../hooks/useSiteData'
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
  const { sections, settings, loading } = useSiteData()

  if (loading) {
    return (
      <div className="min-h-screen bg-marfil flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-terracota border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const sectionMap = {
    hero: HeroSection,
    about: AboutSection,
    trajectory: TrajectorySection,
    festival: FestivalSection,
    podcast: PodcastSection,
    libros: BooksSection,
    contact: ContactSection,
  }

  return (
    <>
      <Navbar socialLinks={settings.social_links} />
      <main>
        {sections
          .filter(s => s.is_visible)
          .map((section) => {
            const Component = sectionMap[section.id]
            if (!Component) return null
            return <Component key={section.id} content={section.content} />
          })}
        
        {/* If no sections defined in DB, show fallback or base sections */}
        {sections.length === 0 && (
          <>
            <HeroSection />
            <AboutSection />
            <TrajectorySection />
            <FestivalSection />
            <PodcastSection />
            <BooksSection />
            <ContactSection />
          </>
        )}
      </main>
      <Footer socialLinks={settings.social_links} />
    </>
  )
}
