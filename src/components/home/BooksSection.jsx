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

        {/* Public Digital Library (New) */}
        {publicBooks.length > 0 && (
          <div className="pt-16 border-t border-arena/30">
            <div className="text-center mb-12">
              <span className="px-4 py-1.5 bg-terracota/10 text-terracota text-xs font-bold rounded-full uppercase tracking-widest mb-4 inline-block">
                Colecciones Digitales
              </span>
              <h3 className="font-display text-3xl text-cafe-oscuro">Biblioteca Audiovisual</h3>
              <p className="text-cafe-medio text-sm mt-2">Explorá mis libros digitales con cuentos narrados.</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {publicBooks.map((libro) => (
                <div key={libro.id} className="group cursor-pointer">
                  <div className="aspect-[3/4] rounded-xl overflow-hidden shadow-lg transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-terracota/20 relative">
                    {libro.portada_url ? (
                      <img 
                        src={libro.portada_url} 
                        alt={libro.titulo} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                      />
                    ) : (
                      <div className="w-full h-full bg-arena/20 flex items-center justify-center text-5xl">📖</div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-cafe-oscuro/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-4">
                       <button className="w-full py-2 bg-terracota text-crema text-xs font-bold rounded-lg shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                         VER COLECCIÓN
                       </button>
                    </div>
                    {/* Floating Badge */}
                    <div className="absolute top-2 right-2 px-2 py-1 bg-crema/90 backdrop-blur-sm rounded-md text-[10px] font-bold text-terracota shadow-sm border border-terracota/20">
                      AUDIO
                    </div>
                  </div>
                  <h4 className="mt-3 font-display font-semibold text-cafe-oscuro text-sm group-hover:text-terracota transition-colors line-clamp-1">
                    {libro.titulo}
                  </h4>
                  <p className="text-cafe-medio text-[10px] uppercase tracking-tighter">
                    {libro.microcuentos?.[0]?.count || 0} Historias narradas
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
