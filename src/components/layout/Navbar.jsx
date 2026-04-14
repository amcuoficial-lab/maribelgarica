import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { FaInstagram, FaYoutube, FaSpotify, FaTiktok } from 'react-icons/fa'

const navLinks = [
  { href: '#sobre-mi', label: 'Sobre mí' },
  { href: '#trayectoria', label: 'Trayectoria' },
  { href: '#festival', label: 'Festival' },
  { href: '#podcast', label: 'Podcast' },
  { href: '#libros', label: 'Libros' },
  { href: '#contacto', label: 'Contacto' },
]

const iconMap = {
  instagram: FaInstagram,
  youtube: FaYoutube,
  spotify: FaSpotify,
  tiktok: FaTiktok
}

export default function Navbar({ socialLinks = {} }) {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const isHome = location.pathname === '/'

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleNav = (href) => {
    setOpen(false)
    if (!isHome) {
      window.location.href = '/' + href
      return
    }
    const el = document.querySelector(href)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-marfil/95 backdrop-blur-md shadow-sm border-b border-arena/40' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="font-display font-bold text-lg text-cafe-oscuro hover:text-terracota transition-colors">
          Maribel García
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          <ul className="flex items-center gap-6">
            {navLinks.map(({ href, label }) => (
              <li key={href}>
                <button
                  onClick={() => handleNav(href)}
                  className="text-sm font-medium text-cafe-medio hover:text-terracota transition-colors cursor-pointer"
                >
                  {label}
                </button>
              </li>
            ))}
          </ul>

          {/* Social icons */}
          <div className="flex items-center gap-4 border-l border-arena/40 pl-8">
            {Object.entries(socialLinks).map(([platform, url]) => {
              const Icon = iconMap[platform]
              if (!Icon || !url) return null
              return (
                <a
                  key={platform}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cafe-medio hover:text-terracota transition-colors"
                >
                  <Icon className="w-5 h-5" />
                </a>
              )
            })}
          </div>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 text-cafe-oscuro"
          onClick={() => setOpen(!open)}
          aria-label="Menú"
        >
          <div className="w-5 flex flex-col gap-1">
            <span className={`block h-0.5 bg-current transition-transform ${open ? 'rotate-45 translate-y-1.5' : ''}`} />
            <span className={`block h-0.5 bg-current transition-opacity ${open ? 'opacity-0' : ''}`} />
            <span className={`block h-0.5 bg-current transition-transform ${open ? '-rotate-45 -translate-y-1.5' : ''}`} />
          </div>
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-marfil/98 backdrop-blur-md border-t border-arena/40 px-6 py-4">
          <ul className="flex flex-col gap-4 mb-6">
            {navLinks.map(({ href, label }) => (
              <li key={href}>
                <button
                  onClick={() => handleNav(href)}
                  className="text-base font-medium text-cafe-medio hover:text-terracota transition-colors w-full text-left py-1"
                >
                  {label}
                </button>
              </li>
            ))}
          </ul>

          {/* Social Mobile */}
          <div className="flex items-center gap-6 border-t border-arena/20 pt-6">
            {Object.entries(socialLinks).map(([platform, url]) => {
              const Icon = iconMap[platform]
              if (!Icon || !url) return null
              return (
                <a
                  key={platform}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-cafe-medio hover:text-terracota transition-colors"
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-sm capitalize">{platform}</span>
                </a>
              )
            })}
          </div>
        </div>
      )}
    </nav>
  )
}
