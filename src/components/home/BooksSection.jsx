const books = [
  { img: '/fotos/feria.jpg', title: 'Presentación en Feria', sub: 'Feria Internacional del Libro, Buenos Aires' },
  { img: '/fotos/radio.jpg', title: 'En los Medios', sub: 'Locutora y conductora de radio y podcast' },
  { img: '/fotos/premio.jpg', title: 'Reconocimientos', sub: 'Premios y reconocimientos a la trayectoria cultural' },
  { img: '/fotos/brasil.jpg', title: 'Misiones Internacionales', sub: 'Brasil — Trabajo con comunidades Quilombola' },
  { img: '/fotos/mexico.jpg', title: 'México', sub: 'Día de Muertos — Intercambio cultural latinoamericano' },
  { img: '/fotos/turquia.jpg', title: 'Turquía', sub: 'Pamukkale — Gira internacional de narración oral' },
]

export default function BooksSection() {
  return (
    <section id="libros" className="py-24 px-6 bg-marfil">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-terracota font-semibold text-sm tracking-widest uppercase mb-3">
            Libros & Presencia
          </p>
          <h2 className="font-display text-4xl md:text-5xl text-cafe-oscuro">
            Publicaciones & Hitos
          </h2>
          <p className="text-cafe-medio mt-4 max-w-xl mx-auto">
            Escritora, locutora y referente cultural con presencia en escenarios nacionales e internacionales.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {books.map(({ img, title, sub }) => (
            <div
              key={title}
              className="group relative overflow-hidden rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300"
            >
              <div className="aspect-[3/2] overflow-hidden">
                <img
                  src={img}
                  alt={title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-cafe-oscuro/80 via-cafe-oscuro/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <h3 className="font-display text-lg text-crema font-semibold">{title}</h3>
                <p className="text-arena/80 text-xs mt-1">{sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
