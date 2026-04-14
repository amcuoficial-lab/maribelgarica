export default function HeroSection({ content }) {
  if (!content) return null

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src={content.bg_image || "/fotos/hero.jpg"}
          alt={content.title}
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-cafe-oscuro/70 via-cafe-oscuro/50 to-cafe-oscuro/80" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <p className="text-arena/80 text-sm md:text-base font-medium tracking-[0.3em] uppercase mb-4">
          {content.tagline || 'Narradora Oral · Museóloga · Locutora'}
        </p>

        <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold text-crema leading-tight mb-4">
          {content.title || 'Maribel García'}
        </h1>

        <p className="font-display italic text-2xl md:text-3xl text-arena mb-8">
          {content.subtitle || 'Guardiana de Historias'}
        </p>

        <p className="text-crema/75 text-base md:text-lg max-w-2xl mx-auto mb-12 leading-relaxed whitespace-pre-line">
          {content.description || 'Magíster en Museología Social. Fundadora de 10 museos comunitarios.'}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => scrollTo('sobre-mi')}
            className="px-8 py-3 bg-terracota hover:bg-ambar text-crema font-semibold rounded-full transition-colors duration-300 text-sm tracking-wide"
          >
            Conocé mi historia
          </button>
          <button
            onClick={() => scrollTo('festival')}
            className="px-8 py-3 border-2 border-arena/60 hover:border-arena text-arena hover:text-crema font-semibold rounded-full transition-all duration-300 text-sm tracking-wide"
          >
            Festival Los 50 que Cuentan
          </button>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <svg className="w-6 h-6 text-arena/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </section>
  )
}
