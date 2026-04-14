import { useState } from 'react'

export default function ContactSection() {
  const [sent, setSent] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', message: '' })

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = (e) => {
    e.preventDefault()
    // Open email client as fallback
    const subject = encodeURIComponent(`Contacto desde web — ${form.name}`)
    const body = encodeURIComponent(`Nombre: ${form.name}\nEmail: ${form.email}\n\n${form.message}`)
    window.open(`mailto:contacto@maribelgarcia.com?subject=${subject}&body=${body}`)
    setSent(true)
  }

  return (
    <section id="contacto" className="py-24 px-6 bg-crema">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-terracota font-semibold text-sm tracking-widest uppercase mb-3">
            Contacto
          </p>
          <h2 className="font-display text-4xl md:text-5xl text-cafe-oscuro">
            Conectemos
          </h2>
          <p className="text-cafe-medio mt-4 max-w-xl mx-auto">
            Para espectáculos, talleres, colaboraciones y el festival Los 50 que Cuentan.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Info */}
          <div className="space-y-8">
            <div>
              <h3 className="font-display text-xl text-cafe-oscuro mb-4">Información de contacto</h3>
              <div className="space-y-4">
                <a
                  href="https://www.instagram.com/maribelgarciamuseoscuentos"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-cafe-medio hover:text-terracota transition-colors group"
                >
                  <div className="w-10 h-10 rounded-full bg-terracota/10 group-hover:bg-terracota/20 flex items-center justify-center transition-colors flex-shrink-0">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </div>
                  <span className="font-medium">@maribelgarciamuseoscuentos</span>
                </a>

                <div className="flex items-center gap-3 text-cafe-medio">
                  <div className="w-10 h-10 rounded-full bg-terracota/10 flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <span>Argentina</span>
                </div>
              </div>
            </div>

            {/* Podcast link */}
            <div className="bg-marfil rounded-2xl p-6">
              <p className="font-display text-lg text-cafe-oscuro mb-2">Seguí el Podcast</p>
              <p className="text-cafe-medio text-sm mb-4">Nuevos episodios cada semana en Spotify.</p>
              <a
                href="https://open.spotify.com/show/3wFzIHyeRQlY93prJVH2X4"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-green-600 hover:text-green-500 font-semibold text-sm transition-colors"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                </svg>
                Escuchar en Spotify
              </a>
            </div>
          </div>

          {/* Form */}
          {sent ? (
            <div className="flex flex-col items-center justify-center text-center bg-marfil rounded-2xl p-12">
              <div className="w-16 h-16 rounded-full bg-terracota/10 flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-terracota" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="font-display text-2xl text-cafe-oscuro mb-2">¡Gracias!</h3>
              <p className="text-cafe-medio">Se abrió tu cliente de correo. ¡Pronto estaremos en contacto!</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-cafe-medio mb-1.5">Nombre</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={form.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-marfil border border-arena rounded-xl text-cafe-oscuro placeholder-cafe-claro/50 focus:outline-none focus:border-terracota transition-colors"
                  placeholder="Tu nombre"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-cafe-medio mb-1.5">Email</label>
                <input
                  type="email"
                  name="email"
                  required
                  value={form.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-marfil border border-arena rounded-xl text-cafe-oscuro placeholder-cafe-claro/50 focus:outline-none focus:border-terracota transition-colors"
                  placeholder="tu@email.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-cafe-medio mb-1.5">Mensaje</label>
                <textarea
                  name="message"
                  required
                  rows={5}
                  value={form.message}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-marfil border border-arena rounded-xl text-cafe-oscuro placeholder-cafe-claro/50 focus:outline-none focus:border-terracota transition-colors resize-none"
                  placeholder="Contame en qué puedo ayudarte..."
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-terracota hover:bg-ambar text-crema font-semibold rounded-xl transition-colors duration-300"
              >
                Enviar mensaje
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}
