export default function PodcastSection() {
  return (
    <section id="podcast" className="py-24 px-6 bg-cafe-oscuro overflow-hidden relative">
      {/* Decorative blobs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-terracota/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-dorado/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2 pointer-events-none" />

      <div className="max-w-3xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <p className="text-terracota font-semibold text-sm tracking-widest uppercase mb-3">
            Podcast
          </p>
          <h2 className="font-display text-4xl md:text-5xl text-crema">
            El Podcast de Maribel García
          </h2>
          <p className="text-crema/60 mt-4 max-w-xl mx-auto">
            Relatos, conversaciones y reflexiones sobre la cultura, la memoria y el poder de las palabras.
            Disponible en Spotify.
          </p>
        </div>

        {/* Glassmorphism card */}
        <div className="bg-white/10 backdrop-blur-lg border border-dorado/25 shadow-2xl rounded-3xl p-6 md:p-8">
          {/* Spotify header */}
          <div className="flex items-center gap-3 mb-6">
            <svg className="w-8 h-8 text-green-400" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
            </svg>
            <div>
              <p className="text-crema font-semibold text-sm">Disponible en Spotify</p>
              <p className="text-crema/50 text-xs">Podcast de Maribel García</p>
            </div>
          </div>

          {/* Spotify embed */}
          <iframe
            src="https://open.spotify.com/embed/show/3wFzIHyeRQlY93prJVH2X4?utm_source=generator&theme=0"
            width="100%"
            height="352"
            frameBorder="0"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
            className="rounded-xl"
            title="Podcast de Maribel García en Spotify"
          />

          <div className="mt-6 flex flex-wrap gap-3 justify-center">
            <a
              href="https://open.spotify.com/show/3wFzIHyeRQlY93prJVH2X4"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-green-500 hover:bg-green-400 text-white text-sm font-semibold rounded-full transition-colors"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
              </svg>
              Abrir en Spotify
            </a>
            <a
              href="https://www.instagram.com/maribelgarciamuseoscuentos"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 border border-crema/30 hover:border-crema/60 text-crema text-sm font-semibold rounded-full transition-colors"
            >
              @maribelgarciamuseoscuentos
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
