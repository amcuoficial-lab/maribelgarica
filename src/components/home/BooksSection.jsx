export default function BooksSection({ content, onOpenGallery, publicBooks = [] }) {
  if (!content) return null

  const milestones = (content.books || [
    { img: '/fotos/feria.jpg', title: 'Presentación en Feria', sub: 'Feria Internacional del Libro, Buenos Aires' },
    { img: '/fotos/radio.jpg', title: 'En los Medios', sub: 'Locutora y conductora de radio y podcast' },
    { img: '', title: 'Reconocimientos', sub: 'Trayectoria cultural' },
    { img: '', title: 'Misiones Internacionales', sub: 'Brasil — Comunidades Quilombola' },
    { img: '', title: 'México', sub: 'Día de Muertos' },
    { img: '', title: 'Turquía', sub: 'Pamukkale — Gira internacional' },
  ]).filter(b => b.visible !== false)

  return (
    <section id="libros" className="py-24 px-6 bg-marfil">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-terracota font-semibold text-sm tracking-widest uppercase mb-3">
             {content.label || 'Libros & Presencia'}
          </p>
          <h2 className="font-display text-4xl md:text-5xl text-cafe-oscuro">
             {content.title || 'Publicaciones & Hitos'}
          </h2>
          <p className="text-cafe-medio mt-4 max-w-xl mx-auto whitespace-pre-line">
             {content.intro || 'Escritora, locutora y referente cultural con presencia en escenarios nacionales e internacionales.'}
          </p>
        </div>

        {/* Milestones Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-24">
          {milestones.map((book, i) => (
            <div
              key={i}
              className="group relative overflow-hidden rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
              onClick={() => onOpenGallery(milestones, i)}
            >
              <div className="aspect-[3/2] overflow-hidden">
                <img
                  src={book.img || '/fotos/hero.jpg'}
                  alt={book.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-cafe-oscuro/80 via-cafe-oscuro/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <h3 className="font-display text-lg text-crema font-semibold">{book.title}</h3>
                <p className="text-arena/80 text-xs mt-1">{book.sub}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
