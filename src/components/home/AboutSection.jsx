const stats = [
  { value: '10', label: 'Museos Fundados' },
  { value: '30+', label: 'Años de Carrera' },
  { value: 'Magíster', label: 'Museología Social' },
]

export default function AboutSection() {
  return (
    <section id="sobre-mi" className="py-24 px-6 bg-crema">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Photo */}
          <div className="relative">
            <div className="aspect-[3/4] overflow-hidden rounded-2xl shadow-2xl">
              <img
                src="/fotos/retrato.jpg"
                alt="Maribel García"
                className="w-full h-full object-cover object-top"
              />
            </div>
            {/* Accent frame */}
            <div className="absolute -bottom-4 -right-4 w-full h-full border-2 border-dorado/40 rounded-2xl -z-10" />
          </div>

          {/* Text */}
          <div>
            <p className="text-terracota font-semibold text-sm tracking-widest uppercase mb-3">
              Sobre mí
            </p>
            <h2 className="font-display text-4xl md:text-5xl text-cafe-oscuro mb-6 leading-tight">
              Una vida dedicada a las historias
            </h2>

            <div className="space-y-4 text-cafe-medio text-base leading-relaxed">
              <p>
                Soy narradora oral, museóloga social, locutora, gestora cultural y escritora argentina.
                A lo largo de mi carrera he dedicado cada momento a rescatar, preservar y compartir
                las historias que nos construyen como comunidad.
              </p>
              <p>
                Como Magíster en Museología Social, fundé <strong className="text-cafe-oscuro">10 museos comunitarios</strong> en
                diferentes rincones del país, espacios donde la memoria colectiva cobra vida y las
                voces de los que no tienen voz encuentran su lugar.
              </p>
              <p>
                La narración oral es mi herramienta más poderosa: creo que las historias sanan,
                unen y transforman. En cada actuación, en cada cuento, intento tender un puente
                entre el pasado que nos dio forma y el futuro que estamos construyendo juntos.
              </p>
              <p>
                Conduzco programas de radio y podcast, donde cada semana comparto relatos,
                entrevistas y reflexiones sobre la cultura, la identidad y el poder de las palabras.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mt-10 pt-8 border-t border-arena/50">
              {stats.map(({ value, label }) => (
                <div key={label} className="text-center">
                  <p className="font-display text-3xl font-bold text-terracota">{value}</p>
                  <p className="text-xs text-cafe-medio mt-1 leading-tight">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
