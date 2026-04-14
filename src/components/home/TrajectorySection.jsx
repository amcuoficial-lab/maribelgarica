export default function TrajectorySection({ content, onOpenGallery }) {
  if (!content) return null

  const projects = content.projects || [
    {
      photo: '/fotos/escena.jpg',
      title: 'Voces del Sur',
      description: 'Espectáculo de narración oral con vestuario tradicional en el Salón Auditorio.',
      tag: 'Narración Oral',
    },
    // ... other defaults can go here if needed
  ]

  return (
    <section id="trayectoria" className="py-24 px-6 bg-marfil">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-terracota font-semibold text-sm tracking-widest uppercase mb-3">
            Trayectoria
          </p>
          <h2 className="font-display text-4xl md:text-5xl text-cafe-oscuro">
            {content.title || 'Espectáculos & Proyectos'}
          </h2>
          <p className="text-cafe-medio mt-4 max-w-xl mx-auto whitespace-pre-line">
            {content.description || 'Tres décadas recorriendo escenarios, museos y comunidades con el poder transformador de las historias.'}
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.filter(p => p.visible !== false).map((project, i) => (
            <article 
              key={i} 
              className="group overflow-hidden rounded-2xl bg-crema shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
              onClick={() => onOpenGallery(projects.filter(p => p.visible !== false), i)}
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={project.photo}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6">
                <span className="inline-block text-xs font-semibold text-terracota bg-terracota/10 px-3 py-1 rounded-full mb-3">
                  {project.tag}
                </span>
                <h3 className="font-display text-xl text-cafe-oscuro font-semibold mb-2">{project.title}</h3>
                <p className="text-cafe-medio text-sm leading-relaxed">{project.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
