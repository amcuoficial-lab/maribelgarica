export default function FestivalSection({ content }) {
  if (!content) return null

  const stats = content.stats || [
    { v: '50+', l: 'Narradores por edición' },
    { v: '12+', l: 'Años de historia' },
    { v: 'Todo el país', l: 'Alcance federal' },
  ]

  const gallery = content.gallery || ['/fotos/brasil.jpg', '/fotos/mural.jpg', '/fotos/playa.jpg', '/fotos/museo-2.jpg']

  return (
    <section id="festival" className="py-24 px-6 bg-crema overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <div className="order-2 md:order-1">
            <p className="text-terracota font-semibold text-sm tracking-widest uppercase mb-3">
              Festival
            </p>
            <h2 className="font-display text-4xl md:text-5xl text-cafe-oscuro mb-6 leading-tight">
              {content.title || 'Los 50 que Cuentan'}
            </h2>

            <div className="text-cafe-medio text-base leading-relaxed whitespace-pre-line">
              {content.description || 'Los 50 que Cuentan es un festival de narración oral...'}
            </div>

            <div className="mt-8 grid grid-cols-3 gap-4">
              {stats.map(({ v, l }) => (
                <div key={l} className="text-center bg-marfil rounded-xl p-4">
                  <p className="font-display text-2xl font-bold text-terracota">{v}</p>
                  <p className="text-xs text-cafe-medio mt-1 leading-tight">{l}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Photo */}
          <div className="order-1 md:order-2 relative">
            <div className="aspect-[4/5] overflow-hidden rounded-2xl shadow-2xl">
              <img
                src={content.main_image || "/fotos/festival.jpg"}
                alt="Festival Los 50 que Cuentan"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Decorative circle */}
            <div className="absolute -top-6 -left-6 w-24 h-24 rounded-full bg-dorado/20 -z-10" />
            <div className="absolute -bottom-6 -right-6 w-40 h-40 rounded-full bg-terracota/10 -z-10" />
          </div>
        </div>

        {/* Extra photos strip */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4">
          {gallery.map((src, i) => (
            <div key={i} className="aspect-square overflow-hidden rounded-xl shadow-md">
              <img
                src={src}
                alt=""
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
